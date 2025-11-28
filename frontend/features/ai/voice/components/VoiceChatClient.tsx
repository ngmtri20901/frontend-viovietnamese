"use client";

import { useState } from "react";
import Link from "next/link";
import { FreeTalkDialog } from "./dialogs/FreeTalkDialog";
import { ScenarioDialog } from "./dialogs/ScenarioDialog";

interface VoiceChatClientProps {
  userName: string;
  userId: string;
}

export function VoiceChatClient({ userName, userId }: VoiceChatClientProps) {
  const [freeTalkOpen, setFreeTalkOpen] = useState(false);
  const [scenarioOpen, setScenarioOpen] = useState(false);

  return (
    <>
      {/* Feature Cards Section */}
      <section className="mb-12">
        <h3 className="text-xl font-bold mb-4 text-gray-700">Quick Practice</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <FeatureCard
            title="Free Talk"
            icon="💬"
            description="Casual conversation in Vietnamese"
            onClick={() => setFreeTalkOpen(true)}
          />
          <FeatureCard
            title="Scenario Practice"
            icon="🎭"
            description="Real-life situation practice"
            onClick={() => setScenarioOpen(true)}
          />
        </div>

        <h3 className="text-xl font-bold mb-4 text-gray-700">
          Speaking Test Preparation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeatureCard
            title="Part 1: Social Communication"
            icon="👤"
            description="Simple Q&A about personal topics"
            badge="2-3 min"
            href="/ai/voice/exam/part1"
          />
          <FeatureCard
            title="Part 2: Solution Discussion"
            icon="💡"
            description="Discuss solutions to problems"
            badge="~5 min"
            href="/ai/voice/exam/part2"
          />
          <FeatureCard
            title="Part 3: Topic Presentation"
            icon="🎤"
            description="Present and discuss a topic"
            badge="~7 min"
            href="/ai/voice/exam/part3"
          />
        </div>
      </section>

      {/* Dialogs */}
      <FreeTalkDialog
        open={freeTalkOpen}
        onOpenChange={setFreeTalkOpen}
        userName={userName}
        userId={userId}
      />
      <ScenarioDialog
        open={scenarioOpen}
        onOpenChange={setScenarioOpen}
        userName={userName}
        userId={userId}
      />
    </>
  );
}

interface FeatureCardProps {
  title: string;
  icon: string;
  description: string;
  badge?: string;
  href?: string;
  onClick?: () => void;
}

function FeatureCard({
  title,
  icon,
  description,
  badge,
  href,
  onClick,
}: FeatureCardProps) {
  const content = (
    <div className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 border border-gray-200 cursor-pointer h-full">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="text-4xl mb-2">{icon}</div>
        <h3 className="font-semibold text-sm">{title}</h3>
        <p className="text-xs text-gray-500">{description}</p>
        {badge && (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
            {badge}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return <div onClick={onClick}>{content}</div>;
}
