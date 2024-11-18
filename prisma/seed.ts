const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  // Create store
  const store = await prisma.store.create({
    data: {
      name: 'My Store',
      description: 'A store for all your needs',
      logo: 'https://via.placeholder.com/150',
      settings: {
        enableReviews: true
      }
    },
  })

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Product 1',
        description: 'Description for product 1',
        price: 99.99,
        images: ['https://via.placeholder.com/150'],
        stock: 10,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Product 2',
        description: 'Description for product 2',
        price: 149.99,
        images: ['https://via.placeholder.com/150'],
        stock: 5,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Product 3',
        description: 'Description for product 3',
        price: 199.99,
        images: ['https://via.placeholder.com/150'],
        stock: 3,
      },
    }),
  ])

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'ADMIN',
        is_admin: true,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Customer User',
        email: 'customer@example.com',
        role: 'CUSTOMER',
        is_admin: false,
      },
    }),
  ])

  // Create some reviews
  await Promise.all([
    prisma.review.create({
      data: {
        rating: 5,
        comment: 'Great product!',
        userId: users[1].id,
        productId: products[0].id,
      },
    }),
    prisma.review.create({
      data: {
        rating: 4,
        comment: 'Good product, but could be better',
        userId: users[1].id,
        productId: products[1].id,
      },
    }),
  ])

  // Create some favorites
  await Promise.all([
    prisma.favorite.create({
      data: {
        userId: users[1].id,
        productId: products[0].id,
      },
    }),
    prisma.favorite.create({
      data: {
        userId: users[1].id,
        productId: products[1].id,
      },
    }),
  ])

  // Create some cart items
  await Promise.all([
    prisma.cartItem.create({
      data: {
        userId: users[1].id,
        productId: products[0].id,
        quantity: 1,
        price: products[0].price,
      },
    }),
    prisma.cartItem.create({
      data: {
        userId: users[1].id,
        productId: products[1].id,
        quantity: 2,
        price: products[1].price,
      },
    }),
  ])

  console.log('Database has been seeded. 🌱')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
