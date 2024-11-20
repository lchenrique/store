export const authMessages = {
  SIGNUP_PASSWORD_MISMATCH: 'As senhas não coincidem',
  SIGNUP_DUPLICATE_EMAIL: 'Usuário ja existente',
  SIGNUP_INVALID_EMAIL: 'E-mail inválido',
  SIGNUP_INVALID_PASSWORD: 'A senha deve ter pelo menos 6 caracteres',
  SIGNUP_MISSING_PASSWORD: 'Por favor, insira uma senha',
  SIGNUP_MISSING_EMAIL: 'Por favor, insira um e-mail',
  SIGNUP_MISSING_DATA: 'Por favor, preencha todos os campos',
  
  SIGNIN_INVALID_CREDENTIALS: 'E-mail ou senha incorretos',
  SIGNIN_INVALID_EMAIL: 'E-mail inválido',
  SIGNIN_MISSING_PASSWORD: 'Por favor, insira sua senha',
  SIGNIN_MISSING_EMAIL: 'Por favor, insira seu e-mail',
  SIGNIN_USER_NOT_FOUND: 'Usuário não encontrado',

  PASSWORD_RESET_INVALID_EMAIL: 'E-mail inválido',
  PASSWORD_RESET_EMAIL_SENT: 'E-mail de recuperação enviado',
  PASSWORD_RESET_USER_NOT_FOUND: 'Usuário não encontrado',

  EMAIL_VERIFICATION_SENT: 'E-mail de verificação enviado',
  EMAIL_VERIFICATION_INVALID: 'Link de verificação inválido ou expirado',
  EMAIL_VERIFICATION_SUCCESS: 'E-mail verificado com sucesso',

  OAUTH_ERROR: 'Erro ao conectar com provedor externo',
  OAUTH_MISSING_PROVIDER: 'Provedor de autenticação não especificado',
  OAUTH_INVALID_PROVIDER: 'Provedor de autenticação inválido',

  TOKEN_EXPIRED: 'Sua sessão expirou, por favor faça login novamente',
  TOKEN_INVALID: 'Sessão inválida, por favor faça login novamente',
  TOKEN_REVOKED: 'Sua sessão foi encerrada, por favor faça login novamente',

  NETWORK_ERROR: 'Erro de conexão, por favor tente novamente',
  RATE_LIMIT_ERROR: 'Muitas tentativas, por favor aguarde um momento',
  SERVER_ERROR: 'Erro interno do servidor, por favor tente novamente'
}

export function getAuthMessage(error: any): string {
  if (!error) return 'Ocorreu um erro desconhecido';

  // Se o erro for uma string direta
  if (error.message) {
    const message = error.message.toLowerCase();
    
    if (message.includes('user already registered')) {
      return authMessages.SIGNUP_DUPLICATE_EMAIL;
    }
  }

  // Trata erros do Supabase Auth
  if (error.message) {
    const message = error.message.toLowerCase();
    
    if (message.includes('invalid login credentials')) {
      return authMessages.SIGNIN_INVALID_CREDENTIALS;
    }
    
    if (message.includes('email already registered')) {
      return authMessages.SIGNUP_DUPLICATE_EMAIL;
    }
    
    if (message.includes('invalid email')) {
      return authMessages.SIGNUP_INVALID_EMAIL;
    }
    
    if (message.includes('password')) {
      if (message.includes('mismatch')) {
        return authMessages.SIGNUP_PASSWORD_MISMATCH;
      }
      if (message.includes('too short')) {
        return authMessages.SIGNUP_INVALID_PASSWORD;
      }
    }
    
    if (message.includes('rate limit')) {
      return authMessages.RATE_LIMIT_ERROR;
    }
    
    if (message.includes('network')) {
      return authMessages.NETWORK_ERROR;
    }
  }

  // Se não encontrar uma mensagem específica, retorna o erro original ou uma mensagem genérica
  return error.message || error || 'Ocorreu um erro desconhecido';
}
