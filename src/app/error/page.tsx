import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[420px]">
        <CardHeader>
          <CardTitle>Oops! Algo deu errado</CardTitle>
          <CardDescription>
            Desculpe pelo inconveniente. Por favor, tente novamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Se o problema persistir, entre em contato com o suporte.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/">Voltar para a home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}