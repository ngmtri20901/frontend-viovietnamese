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
        <div className="flex flex-col items-center rounded-3xl bg-gradient-to-br from-ds-primary/10 to-ds-secondary/10 p-8 text-center md:rounded-3xl lg:p-16 border-2 border-dashed border-ds-primary/30">
          <h3 className="mb-3 max-w-3xl text-2xl font-display font-bold text-ds-text md:mb-4 md:text-4xl lg:mb-6">{heading}</h3>
          <p className="mb-8 max-w-3xl font-body text-ds-text-light leading-relaxed lg:text-lg">{description}</p>
          <div className="flex w-full flex-col justify-center gap-4 sm:flex-row">
            {buttons.primary && (
              <Link href={buttons.primary.url}>
                <Button size="lg" className="w-full sm:w-auto">
                  {buttons.primary.text}
                </Button>
              </Link>
            )}
            {buttons.secondary && (
              <Link href={buttons.secondary.url}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  {buttons.secondary.text}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export { CTASection }
