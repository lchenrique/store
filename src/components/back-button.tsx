import { ArrowLeft } from "lucide-react"
import Link from "next/link"

  interface BackButtonProps {
    href: string
  }

  const BackButton = ({ href }: BackButtonProps) => {
    return (
      <div className="w-min">
        <Link href={href} className="flex items-center">
          <ArrowLeft className="h-10 w-h-10 mr-2" />
        </Link>
      </div>
    )
  }

  export default BackButton
