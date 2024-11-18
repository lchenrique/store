import { NextResponse } from 'next/server';
import db  from '@/lib/db';
import { supabase } from '@/lib/supabase/client';

export async function POST(req: Request) {
  try {
    const { name, description, email, password } = await req.json();

    // Check if store already exists
    const existingStore = await db.store.findFirst();
    if (existingStore) {
      return new NextResponse('Store already exists', { status: 400 });
    }

    // Hash the password

    // Create Supabase user with admin role
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'ADMIN',
          name: name
        }
      }
    });

    if (authError) {
      throw new Error(authError.message);
    }

    // Create store in database
    const store = await db.store.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json({ store, user: authData.user });
  } catch (error) {
    console.error('Setup error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}