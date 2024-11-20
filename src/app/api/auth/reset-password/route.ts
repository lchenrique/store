import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/lib/db";
import { Resend } from "resend";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = body;

    if (!token || !password) {
      return new NextResponse("Token e senha são obrigatórios", { status: 400 });
    }

    // Encontrar usuário com o token válido
    // const user = await db.user.findFirst({
    //   where: {
    //     resetToken: token,
    //     resetTokenExpiry: {
    //       gt: new Date()
    //     }
    //   }
    // });

    // if (!user) {
    //   return new NextResponse("Token inválido ou expirado", { status: 400 });
    // }

    // // Hash da nova senha
    // const hashedPassword = await bcrypt.hash(password, 10);

    // // Atualizar senha e limpar tokens
    // await prismadb.user.update({
    //   where: { id: user.id },
    //   data: {
    //     hashedPassword: hashedPassword,
    //     resetToken: null,
    //     resetTokenExpiry: null
    //   }
    // });

    return NextResponse.json({
      message: "Senha redefinida com sucesso!"
    });

  } catch (error) {
    console.error("[RESET_PASSWORD]", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}
