import { NextRequest } from "next/server";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const queryString = Array.from(searchParams.entries())
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  redirect(`/order/pending?${queryString}`);
}
