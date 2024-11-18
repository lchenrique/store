import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prismadb";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return new NextResponse("Email é obrigatório", { status: 400 });
    }

    // Verificar se o usuário existe
    const user = await prismadb.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Por segurança, não informamos se o email existe ou não
      return NextResponse.json({
        message: "Se o email existir, você receberá as instruções de recuperação."
      });
    }

    // Gerar token de recuperação
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    // Salvar token no banco
    await prismadb.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    // URL de reset (ajuste conforme seu domínio)
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

    // Enviar email
    await resend.emails.send({
      from: "Store <noreply@seudominio.com>",
      to: email,
      subject: "Recuperação de Senha",
      html: `
        <h1>Recuperação de Senha</h1>
        <p>Você solicitou a recuperação de senha. Clique no link abaixo para redefinir sua senha:</p>
        <a href="${resetUrl}">Redefinir Senha</a>
        <p>Este link é válido por 1 hora.</p>
        <p>Se você não solicitou a recuperação de senha, ignore este email.</p>
      `
    });

    return NextResponse.json({
      message: "Email de recuperação enviado com sucesso!"
    });

  } catch (error) {
    console.error("[FORGOT_PASSWORD]", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}
