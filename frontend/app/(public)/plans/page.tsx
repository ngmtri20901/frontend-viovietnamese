import { Card } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Check } from "lucide-react"
import { Navbar } from "@/shared/components/layout/public/navbar"
import { Footer } from "@/shared/components/layout/public/footer"

// ISR Configuration - Static generation with no revalidation
export const revalidate = false
export const dynamic = 'force-static'

export default function PricingPage() {
  // Static billing cycle - no client-side state needed
  const billingCycle: "monthly" | "yearly" = "monthly"

  const plans = {
    basic: {
      name: "Basic Plan",
      price: billingCycle === "monthly" ? 79 : 79 * 0.8,
      description: "Good for small teams, or small businesses just starting out.",
      features: [
        "5 projects limit",
        "5GB storage",
        "Up to 3 users",
        "Support by email only",
        "No time tracking feature",
      ],
    },
    pro: {
      name: "Pro Plan",
      price: billingCycle === "monthly" ? 299 : 299 * 0.8,
      description: "Good for medium to large businesses. Get all the features you need.",
      features: ["Unlimited projects", "50GB storage", "Unlimited users", "Priority support"],
    },
  }

  return (
    <>
      <div className="min-h-screen bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Pricing</h1>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia dignissimos aliquam delectus, quasi earum
          veniam?
        </p>

        {/* Pricing Information */}
        <div className="mb-12">
          <p className="text-gray-600 text-lg">
            Choose the plan that fits your learning needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <Card className="p-8 text-left flex flex-col h-full">
            <div className="flex-grow">
              <h2 className="text-2xl font-bold mb-2">{plans.basic.name}</h2>
              <div className="mb-4">
                <span className="text-4xl font-bold">${plans.basic.price}</span>
                <span className="text-gray-600">/per month</span>
              </div>
              <p className="text-gray-600 mb-6">{plans.basic.description}</p>
              <div className="space-y-4">
                {plans.basic.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <Button className="w-full mt-8 bg-[#067BC2] hover:bg-[#0569a6]">Start a free trial</Button>
          </Card>

          {/* Pro Plan */}
          <Card className="p-8 text-left flex flex-col h-full">
            <div className="flex-grow">
              <h2 className="text-2xl font-bold mb-2">{plans.pro.name}</h2>
              <div className="mb-4">
                <span className="text-4xl font-bold">${plans.pro.price}</span>
                <span className="text-gray-600">/per month</span>
              </div>
              <p className="text-gray-600 mb-6">{plans.pro.description}</p>
              <div className="mb-2 text-gray-600">Everything in Basic, plus</div>
              <div className="space-y-4">
                {plans.pro.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <Button className="w-full mt-8 bg-[#067BC2] hover:bg-[#0569a6]">Start a free trial</Button>
          </Card>
        </div>
      </div>
      </div>
      </>
  )
}
