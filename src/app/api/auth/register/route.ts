import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Verifica se o usuário já existe no banco
    const { data: existingUser, error: existingError } = await supabase
      .from('User')
      .select()
      .eq('id', user.id)
      .single();

    if (existingUser) {
      return NextResponse.json(existingUser);
    }

    // Cria o usuário no banco usando o mesmo ID do Auth
    const { data: newUser, error } = await supabase
      .from('User')
      .insert({
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name || user.email?.split('@')[0],
        role: 'CUSTOMER'
      })
      .select()
      .single();

    if (error) {
      console.error('[REGISTER_INSERT]:', error);
      return new NextResponse('Error creating user', { status: 500 });
    }

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('[REGISTER_POST]:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
