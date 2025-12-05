import { Check } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardHeader } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import Link from "next/link"

const features = [
  "Full lesson access",
  "Ad-free learning",
  "Progress tracking",
  "AI Conversation Tutors",
  "Community forum",
  "Cultural insights",
]

export default function PricingSection() {
  return (
    <section className="py-16 px-4 md:px-8">
      <Card className="pricing-card-glow max-w-7xl mx-auto bg-gradient-to-br from-ds-accent-light to-white">
        <CardHeader className="space-y-2 pb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-title font-bold text-ds-text">Start with Plus Plan</h2>
            <Badge variant="secondary" className="bg-ds-success-light text-ds-success hover:bg-ds-success-light font-ui">
              20% off
            </Badge>
          </div>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-3xl md:text-4xl font-display font-bold text-ds-text mb-2">Accelerate your Vietnamese learning journey
              </h3>
              <div className="p-4">
                <p className="font-body text-ds-text-light mb-6 leading-relaxed">Unlock all lessons, get extra practice, and learn without limits.</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-ds-success flex-shrink-0" />
                      <span className="font-body text-ds-text">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-col items-end min-w-[220px]">
              <div className="text-3xl md:text-4xl font-bold font-display text-ds-primary">$7.99</div>
              <div className="text-sm font-body text-ds-text-lighter">per month</div>
              <div className="mt-12 w-full flex flex-col gap-2">
                <Link href="/auth/sign-up">
                  <Button className="w-full" size="lg">
                    Start your free trial
                  </Button>
                </Link>
                <Link href="/plans">
                  <Button variant="outline" className="w-full" size="lg">
                    View all plans
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardHeader>

      </Card>
    </section>
  )
}
