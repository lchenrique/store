'use client';

import { itemVariants } from '@/components/auth/animation-variants';
import { AuthLayout } from '@/components/auth/auth-layout';
import { FormCard } from '@/components/auth/form-card';
import { IconInput } from '@/components/auth/icon-input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { signIn } from '@/lib/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Loader2, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { loginSchema, type LoginFormData } from '../types';
import { useQueryClient } from '@tanstack/react-query';

export default function LoginPage() {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (dataForm: LoginFormData) => {
    setLoading(true);
    try {
      const { data, error } = await signIn(dataForm.email, dataForm.password);

      if (error) {
        toast({
          title: 'Erro ao fazer login',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      if (!data.session) {
        toast({
          title: 'Erro ao fazer login',
          description: 'Não foi possível estabelecer a sessão',
          variant: 'destructive',
        });
        return;
      }


      toast({
        title: 'Login realizado com sucesso!',
        description: 'Bem-vindo(a) de volta!',
      });

      await queryClient.refetchQueries({ queryKey: ['profile'] });

      router.push('/');

    } catch (error) {
      console.error('Error during login:', error);
      toast({
        title: 'Erro ao fazer login',
        description: 'Ocorreu um erro ao fazer login. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Bem-vindo de volta"
      subtitle="Entre com suas credenciais para acessar sua conta"
      sidebarTitle="Faça login para acessar sua conta"
      sidebarSubtitle="Gerencie seus produtos, pedidos e clientes em um só lugar."
    >
      <FormCard>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <div className="flex items-center justify-between">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Esqueceu sua senha?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !form.formState.isValid}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Entrar'
            )}
          </Button>
        </form>

        <motion.div
          variants={itemVariants}
          className="mt-4 text-center text-sm text-muted-foreground"
        >
          Não tem uma conta?{' '}
          <Link
            href="/auth/register"
            className="text-primary hover:underline"
          >
            Cadastre-se
          </Link>
        </motion.div>
      </FormCard>
    </AuthLayout>
  );
}