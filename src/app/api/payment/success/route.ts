import { NextRequest } from "next/server";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const queryString = Array.from(searchParams.entries())
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  // Redireciona para a página de sucesso com todos os parâmetros
  redirect(`/order/success?${queryString}`);
}
