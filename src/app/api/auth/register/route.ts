import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthMessage } from '@/lib/supabase/auth-messages';
import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    
    if (!body.email || !body.password || !body.name) {
      return NextResponse.json(
        { message: getAuthMessage({ message: 'missing_data' }) },
        { status: 400 }
      );
    }

    // 1. Criar o usuário na autenticação do Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: body.email,
      password: body.password,
      options: {
        data: {
          name: body.name,
          role: 'CUSTOMER',
        },
      },
    });

    if (authError) {
      return NextResponse.json(
        { message: getAuthMessage(authError) },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { message: getAuthMessage({ message: 'user_creation_failed' }) },
        { status: 500 }
      );
    }

    try {
      // 2. Criar o usuário no Prisma
      const newUser = await prisma.user.create({
        data: {
          id: authData.user.id,
          email: authData.user.email!,
          name: body.name,
          role: 'CUSTOMER'
        }
      });

      return NextResponse.json({
        user: newUser,
        message: 'Verifique seu email para confirmar sua conta'
      });
    } catch (error) {
      // Se der erro de unique constraint no Prisma
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const existingUser = await prisma.user.findUnique({
          where: { id: authData.user.id }
        });

        if (!existingUser) {
          return NextResponse.json(
            { message: getAuthMessage({ message: 'user_not_found' }) },
            { status: 404 }
          );
        }

        return NextResponse.json({
          user: existingUser,
          message: 'Usuário ja existente'
        });
      }

      // Para outros erros do Prisma
      console.error('[REGISTRO_ERRO_PRISMA]:', error);
      return NextResponse.json(
        { message: getAuthMessage(error) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[REGISTRO_ERRO_POST]:', error);
    return NextResponse.json(
      { message: getAuthMessage(error) },
      { status: 500 }
    );
  }
}
