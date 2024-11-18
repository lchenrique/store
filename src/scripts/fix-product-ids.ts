const { PrismaClient } = require('@prisma/client')
const { v4: uuidv4 } = require('uuid')

const prisma = new PrismaClient()

async function fixProductIds() {
  try {
    // Buscar todos os produtos
    const products = await prisma.product.findMany()
    
    for (const product of products) {
      // Verificar se o ID não é um UUID válido
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(product.id)) {
        const newId = uuidv4()
        console.log(`Updating product ${product.id} to ${newId}`)
        
        try {
          // Atualizar todas as referências primeiro
          await prisma.$transaction([
            // Atualizar OrderItems
            prisma.orderItem.updateMany({
              where: { productId: product.id },
              data: { productId: newId }
            }),
            // Atualizar Favorites
            prisma.favorite.updateMany({
              where: { productId: product.id },
              data: { productId: newId }
            }),
            // Atualizar CartItems
            prisma.cartItem.updateMany({
              where: { productId: product.id },
              data: { productId: newId }
            }),
            // Atualizar Reviews
            prisma.review.updateMany({
              where: { productId: product.id },
              data: { productId: newId }
            }),
            // Finalmente, atualizar o produto
            prisma.product.update({
              where: { id: product.id },
              data: { id: newId }
            })
          ])
          console.log(`Successfully updated product ${product.id}`)
        } catch (updateError) {
          console.error(`Error updating product ${product.id}:`, updateError)
        }
      } else {
        console.log(`Product ${product.id} already has valid UUID`)
      }
    }
    
    console.log('All product IDs have been processed!')
  } catch (error) {
    console.error('Error fixing product IDs:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixProductIds()
