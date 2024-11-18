import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cep = searchParams.get("cep")?.replace(/\D/g, "");

    if (!cep || cep.length !== 8) {
      return new NextResponse("CEP inválido", { status: 400 });
    }

    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) {
      return new NextResponse("CEP não encontrado", { status: 404 });
    }

    return NextResponse.json({
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
      zipCode: cep,
    });
  } catch (error) {
    console.error("Error fetching address:", error);
    if (error instanceof Error) {
      return new NextResponse(`Erro ao buscar endereço: ${error.message}`, { status: 500 });
    }
    return new NextResponse("Erro ao buscar endereço", { status: 500 });
  }
}
