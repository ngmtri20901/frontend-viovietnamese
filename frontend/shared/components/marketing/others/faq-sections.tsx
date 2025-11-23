"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/components/ui/accordion"
import { cn } from "@/shared/utils/cn"

type FAQCategory = "support" | "account" | "features" | "security" | "other"

interface FAQItem {
  question: string
  answer: string
  category: FAQCategory
}

const faqData: FAQItem[] = [
  {
    question: "Is there a free version?",
    answer:
      "Yes, we offer a free tier with limited features. You can upgrade to our premium plans anytime to access all features.",
    category: "support",
  },
  {
    question: "Is support free, or do I need to Perplexity everything?",
    answer:
      "Our basic support is free for all users. Premium support with faster response times is available for paid plans.",
    category: "support",
  },
  {
    question: "What if I need immediate assistance?",
    answer:
      "For immediate assistance, you can use our live chat feature available during business hours or submit a priority ticket if you're on a premium plan.",
    category: "support",
  },
  {
    question: "How do I update my account without breaking my laptop?",
    answer:
      "You can safely update your account through the settings page. Don't worry, we've designed the process to be simple and secure, with no risk to your device.",
    category: "account",
  },
  {
    question: "How do I update my account without breaking the universe?",
    answer:
      "Our account update process has been thoroughly tested and is guaranteed to maintain the integrity of the space-time continuum. Update with confidence!",
    category: "account",
  },
  {
    question: "What happens if I forget my password?",
    answer:
      "If you forget your password, you can use the 'Forgot Password' link on the login page. We'll send you a secure link to reset your password.",
    category: "account",
  },
  {
    question: "Are you going to be subsumed by AI?",
    answer:
      "While we embrace AI technology to enhance our services, we maintain a human-centered approach. Our team works alongside AI to provide the best experience.",
    category: "other",
  },
  {
    question: "What makes your platform unique?",
    answer:
      "Our platform combines cutting-edge technology with intuitive design, creating a seamless experience that sets us apart from competitors.",
    category: "other",
  },
  {
    question: "What security measures do you have in place?",
    answer:
      "We implement industry-standard encryption, regular security audits, and multi-factor authentication to keep your data safe.",
    category: "security",
  },
  {
    question: "Can I enable two-factor authentication?",
    answer:
      "Yes, we strongly recommend enabling two-factor authentication for added security. You can set this up in your account settings.",
    category: "security",
  },
  {
    question: "What features are included in the premium plan?",
    answer:
      "Our premium plan includes advanced analytics, priority support, custom integrations, and unlimited storage.",
    category: "features",
  },
  {
    question: "Do you offer API access?",
    answer:
      "Yes, API access is available on our business and enterprise plans, allowing you to integrate our services with your existing systems.",
    category: "features",
  },
]

const categories: { id: FAQCategory; label: string }[] = [
  { id: "support", label: "Support" },
  { id: "account", label: "Account" },
  { id: "features", label: "Features" },
  { id: "security", label: "Security" },
  { id: "other", label: "Other" },
]

export function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<FAQCategory>("support")

  const filteredFAQs = faqData.filter((faq) => faq.category === activeCategory)

  return (
    <div className="grid md:grid-cols-[250px_1fr] gap-8">
      {/* Category Navigation */}
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              "w-full text-left px-4 py-2 text-lg font-medium rounded-md transition-colors",
              activeCategory === category.id
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* FAQ Accordion */}
      <div className="border rounded-xl overflow-hidden">
        <Accordion type="single" collapsible className="w-full">
          {filteredFAQs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-muted-foreground">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
