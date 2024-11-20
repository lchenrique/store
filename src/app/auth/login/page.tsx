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
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { loginSchema, type LoginFormData } from '../types';
import { useQueryClient } from '@tanstack/react-query';

export default function LoginPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    // Verifica se a sessão expirou
    const expired = searchParams.get('expired');
    if (expired === 'true') {
      toast({
        title: 'Sessão expirada',
        description: 'Por favor, faça login novamente.',
        variant: 'destructive',
      });
    }
  }, [searchParams]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const { data: sessionData, error } = await signIn(data.email, data.password);
      if (error) throw error;

      if (!sessionData.session) {
        toast({
          title: 'Erro ao fazer login',
          description: 'Não foi possível estabelecer a sessão',
          variant: 'destructive',
        });
        return;
      }

      // Limpa o cache e redireciona
      await queryClient.refetchQueries({ queryKey: ['session'] });
      await queryClient.refetchQueries({ queryKey: ['profile'] });
      router.push('/');

      toast({
        title: 'Login realizado com sucesso!',
        description: 'Bem-vindo de volta!',
      });
    } catch (error) {
      console.error('[LoginPage] Error:', error);
      toast({
        title: 'Erro ao fazer login',
        description: 'Verifique suas credenciais e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Acessar sua conta"
      subtitle="Entre com suas credenciais para continuar"
      sidebarTitle="Área do usuário"
      sidebarSubtitle="Acesse sua conta para gerenciar suas atividades na plataforma."
    >
      <FormCard>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <IconInput
            label="Email"
            type="email"
            id="email"
            icon={<Mail className="w-5 h-5" />}
            error={errors.email?.message}
            disabled={loading}
            required
            {...register('email')}
          />

          <IconInput
            label="Senha"
            type="password"
            id="password"
            icon={<Lock className="w-5 h-5" />}
            error={errors.password?.message}
            disabled={loading}
            required
            {...register('password')}
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
            disabled={loading || !errors}
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