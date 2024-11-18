const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createTestProducts() {
  try {
    const product = await prisma.product.create({
      data: {
        name: 'Produto Teste',
        description: 'Produto para testar os IDs UUID',
        price: 99.99,
        images: ['https://example.com/image.jpg'],
        stock: 10
      }
    })

    console.log('Produto criado com sucesso:', product)
  } catch (error) {
    console.error('Erro ao criar produto:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestProducts()
