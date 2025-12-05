'use client'
import React, { useState } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Check, Minus, Info } from "lucide-react";

const BILLING = {
  monthly: "monthly",
  yearly: "yearly",
} as const;

const PLANS = [
  {
    id: "free",
    name: "FREE",
    priceMonthly: 0,
    priceYearly: 0,
    description: "Start learning the basics.",
  },
  {
    id: "plus",
    name: "PLUS",
    priceMonthly: 10,
    priceYearly: 96,
    description: "Unlock full learning content.",
  },
  {
    id: "ai",
    name: "AI TUTOR",
    priceMonthly: 15,
    priceYearly: 144,
    description: "Full access + Extended AI tools.",
  },
];

const FEATURES = [
  {
    key: "starter_topics",
    label: "Starter topics (2 free topics)",
    tooltip: "Free plan includes 2 beginner Vietnamese topics.",
    free: true,
    plus: true,
    ai: true,
  },
  {
    key: "all_lessons",
    label: "All lessons & topics",
    tooltip: "Full curriculum including grammar, dialogues, and exercises.",
    free: false,
    plus: true,
    ai: true,
  },
  {
    key: "practice_exercises",
    label: "Practice exercises",
    tooltip: "All exercise types: MCQ, matching, dialogues, listening.",
    free: false,
    plus: true,
    ai: true,
  },
  {
    key: "flashcards",
    label: "Advanced flashcards & statistics",
    tooltip: "SRS spaced repetition, analytics, custom decks.",
    free: false,
    plus: true,
    ai: true,
  },
  {
    key: "chatbot_light",
    label: "AI chatbot (light)",
    tooltip: "Limited AI chat messages per month.",
    free: false,
    plus: true,
    ai: false,
  },
  {
    key: "chatbot_unlimited",
    label: "AI chatbot (unlimited)",
    tooltip: "Unlimited AI conversation and explanations.",
    free: false,
    plus: false,
    ai: true,
  },
  {
    key: "voice_ai",
    label: "AI Voice Tutor (speaking practice)",
    tooltip: "Voice-based chatbot with pronunciation scoring.",
    free: false,
    plus: false,
    ai: true,
  },
  {
    key: "roleplay",
    label: "AI role-play conversations",
    tooltip: "Scenario-based role-play with cultural context.",
    free: false,
    plus: false,
    ai: true,
  },
];

export default function PricingLayoutFix() {
  const [billing, setBilling] = useState(BILLING.monthly);

  const formatPrice = (plan: any) => {
    const price = billing === BILLING.monthly ? plan.priceMonthly : plan.priceYearly;
    return `$${price}`;
  };

  return (
    <div className="w-full py-16 px-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Choose Your Plan</h1>
      <p className="text-center text-gray-600 mb-10">Learn Vietnamese your way — unlock lessons, AI tools, and personalized study support.</p>

      {/* Main table where first column contains billing + feature labels */}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col style={{ width: '22rem' }} />
            <col />
            <col />
            <col />
          </colgroup>

          <thead>
            <tr>
              {/* first header cell shows Billing toggle and title */}
              <th className="align-top p-6">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-4">Billings</div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-sm text-gray-600">Annual</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={billing === BILLING.monthly}
                        onChange={() => setBilling((prev) => (prev === BILLING.monthly ? BILLING.yearly : BILLING.monthly))}
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
                    </label>
                    <span className="text-sm text-gray-600">Monthly</span>
                  </div>
                </div>
              </th>

              {/* pricing cards aligned with each plan column */}
              {PLANS.map((plan) => (
                <th key={plan.id} className="p-6 align-top">
                  <div className="max-w-xs mx-auto">
                    <Card className="border rounded-2xl p-6">
                      <CardContent>
                        <h2 className="text-xl font-bold text-center mb-2">{plan.name}</h2>
                        <p className="text-center text-gray-500 mb-4">{plan.description}</p>
                        <p className="text-3xl font-bold text-center">{formatPrice(plan)}</p>
                        <p className="text-center text-gray-500 mb-4">/{billing}</p>
                        <Button className="w-full">Get Started</Button>
                      </CardContent>
                    </Card>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {FEATURES.map((f) => (
              <tr key={f.key} className="border-t last:border-b">
                {/* Feature label cell - aligned with left sidebar visual */}
                <td className="py-6 px-6 align-middle">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">{f.label}</div>
                    <Info className="w-4 h-4 text-gray-400 ml-3" />
                  </div>
                </td>

                {/* Plan columns */}
                {PLANS.map((plan) => {
                  const enabled = (f as any)[plan.id];
                  return (
                    <td key={plan.id} className="text-center align-middle py-6">
                      {enabled ? <Check className="w-6 h-6 text-green-600 mx-auto" /> : <Minus className="w-6 h-6 text-gray-300 mx-auto" />}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Add-ons row (as an example) */}
            <tr className="border-t">
              <td className="py-6 px-6 align-middle">
                <div className="text-sm font-semibold">Individual Packs</div>
                <div className="text-xs text-gray-500">Unlock Travel, Business, Daily Life packs forever. $9–29</div>
              </td>
              <td className="py-6 text-center align-middle" colSpan={3}>
                <Button>Browse Packs</Button>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
}
