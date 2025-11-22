import { Button } from "@/shared/components/ui/button"
import Link from "next/link"

interface CTAProps {
  heading: string
  description: string
  buttons?: {
    primary?: {
      text: string
      url: string
    }
    secondary?: {
      text: string
      url: string
    }
  }
}

const CTASection = ({
  heading = "Ready to Start Learning Vietnamese?",
  description = "Join thousands of satisfied learners who are mastering Vietnamese with our interactive platform.",
  buttons = {
    primary: {
      text: "Get Started",
      url: "/auth/sign-up",
    },
    secondary: {
      text: "Learn More",
      url: "/features",
    },
  },
}: CTAProps) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col items-center rounded-lg bg-accent p-8 text-center md:rounded-xl lg:p-16">
          <h3 className="mb-3 max-w-3xl text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6">{heading}</h3>
          <p className="mb-8 max-w-3xl text-muted-foreground lg:text-lg">{description}</p>
          <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
            {buttons.secondary && (
              <Button variant="outline" className="w-full sm:w-auto">
                <Link href={buttons.secondary.url}>{buttons.secondary.text}</Link>
              </Button>
            )}
            {buttons.primary && (
              <Button className="w-full sm:w-auto bg-[#067BC2] hover:bg-[#0569a6]">
                <Link href={buttons.primary.url}>{buttons.primary.text}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export { CTASection }
