'use client';

import { itemVariants } from '@/components/auth/animation-variants';
import { AuthLayout } from '@/components/auth/auth-layout';
import { FormCard } from '@/components/auth/form-card';
import { IconInput } from '@/components/auth/icon-input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Loader2, Lock, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { registerSchema, type RegisterFormData } from '../types';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      // 1. Criar o usuário na autenticação
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: 'CUSTOMER',  // Sempre será CUSTOMER para novos registros
          },
        },
      });

      if (authError) {
        toast({
          title: 'Erro ao criar conta',
          description: authError.message,
          variant: 'destructive',
        });
        return;
      }

      if (authData.user) {
        // 2. Criar o usuário no banco de dados
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao criar perfil');
        }
      }

      toast({
        title: 'Conta criada com sucesso!',
        description: 'Verifique seu email para confirmar sua conta.',
      });

      router.push('/auth/login');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Erro ao criar conta',
        description: 'Ocorreu um erro ao criar sua conta. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Criar conta"
      subtitle="Preencha os dados abaixo para criar sua conta"
      sidebarTitle="Bem-vindo à Gift Shop"
      sidebarSubtitle="Crie sua conta e comece a comprar os melhores presentes."
    >
      <FormCard>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <IconInput
            label="Nome"
            type="text"
            id="name"
            icon={<User className="w-5 h-5" />}
            error={form.formState.errors.name?.message}
            disabled={loading}
            required
            {...form.register('name')}
          />

          <IconInput
            label="Email"
            type="email"
            id="email"
            icon={<Mail className="w-5 h-5" />}
            error={form.formState.errors.email?.message}
            disabled={loading}
            required
            {...form.register('email')}
          />

          <IconInput
            label="Senha"
            type="password"
            id="password"
            icon={<Lock className="w-5 h-5" />}
            error={form.formState.errors.password?.message}
            disabled={loading}
            required
            {...form.register('password')}
          />

          <IconInput
            label="Confirmar senha"
            type="password"
            id="confirmPassword"
            icon={<Lock className="w-5 h-5" />}
            error={form.formState.errors.confirmPassword?.message}
            disabled={loading}
            required
            {...form.register('confirmPassword')}
          />

          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !form.formState.isValid}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                'Criar conta'
              )}
            </Button>
          </motion.div>

          <motion.div 
            className="flex items-center justify-center text-sm"
            variants={itemVariants}
          >
            <Link
              href="/auth/login"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Já tem uma conta? Faça login
            </Link>
          </motion.div>
        </form>
      </FormCard>
    </AuthLayout>
  );
}
