'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { toast } from '@/hooks/use-toast';
import { IconInput } from '@/components/auth/icon-input';
import { AuthLayout } from '@/components/auth/auth-layout';
import { FormCard } from '@/components/auth/form-card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { itemVariants } from '@/components/auth/animation-variants';
import { Mail, Loader } from 'lucide-react';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../types';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        toast({
          title: 'Erro ao enviar email',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Email enviado',
        description: 'Verifique sua caixa de entrada para redefinir sua senha.',
      });

      router.push('/auth/login');
    } catch (error) {
      toast({
        title: 'Erro ao enviar email',
        description: 'Ocorreu um erro ao enviar o email. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Esqueceu sua senha?"
      subtitle="Digite seu email para receber um link de redefinição"
      sidebarTitle="Recupere sua senha"
      sidebarSubtitle="Enviaremos um link para você redefinir sua senha com segurança."
    >
      <FormCard>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <IconInput
            label="Email"
            type="email"
            id="email"
            icon={<Mail className="w-5 h-5" />}
            error={form.formState.errors.email?.message}
            {...form.register('email')}
          />

          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar email'
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
              Voltar para o login
            </Link>
          </motion.div>
        </form>
      </FormCard>
    </AuthLayout>
  );
}
