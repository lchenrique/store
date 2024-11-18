import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Precisa ser a service role key para listar usuários

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)
const prisma = new PrismaClient()

async function main() {
  try {
    // Buscar todos os usuários do Supabase
    const { data: supabaseUsers, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      throw error
    }

    console.log(`Found ${supabaseUsers.users.length} users in Supabase`)

    // Para cada usuário do Supabase
    for (const user of supabaseUsers.users) {
      // Verificar se o usuário já existe no Prisma
      const existingUser = await prisma.user.findUnique({
        where: { id: user.id }
      })

      if (!existingUser) {
        // Se não existe, criar novo usuário
        await prisma.user.create({
          data: {
            id: user.id,
            email: user.email!,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Unknown',
            role: user.user_metadata?.role || 'CUSTOMER',
            is_admin: user.user_metadata?.is_admin || false
          }
        })
        console.log(`Created user ${user.email}`)
      } else {
        // Se existe, atualizar dados
        await prisma.user.update({
          where: { id: user.id },
          data: {
            email: user.email!,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Unknown',
            role: user.user_metadata?.role || 'CUSTOMER',
            is_admin: user.user_metadata?.is_admin || false
          }
        })
        console.log(`Updated user ${user.email}`)
      }
    }

    console.log('User synchronization completed successfully!')
  } catch (error) {
    console.error('Error synchronizing users:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
