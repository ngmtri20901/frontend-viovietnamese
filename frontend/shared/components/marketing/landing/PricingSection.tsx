import { Check } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import Link from "next/link"

const features = [
  "Unlimited vocabulary practice",
  "Interactive lessons",
  "Progress tracking",
  "Mobile app access",
  "Community forum",
  "Cultural insights",
]

export default function PricingSection() {
  return (
    <section className="py-16 px-4 md:px-8">
      <Card className="max-w-7xl mx-auto bg-gray-50">
        <CardHeader className="space-y-2 pb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">Premium Plan</h2>
            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
              20% off
            </Badge>
          </div>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-3xl md:text-4xl font-bold mb-2">Accelerate your Vietnamese learning journey</h3>
              <div className="p-4">
                <p className="text-gray-600 mb-6">Unlock all features with our premium plan:</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-col items-end min-w-[220px]">
              <div className="text-3xl md:text-4xl font-bold">$9.99</div>
              <div className="text-sm text-gray-500">per month</div>
              <div className="mt-12 w-full flex flex-col">
                <Button className="w-full mb-2 bg-[#067BC2] hover:bg-[#0569a6]" size="lg">
                  <Link href="/auth/sign-up">Start your free trial</Link>
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <Link href="/plans">View all plans</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

      </Card>
    </section>
  )
}
