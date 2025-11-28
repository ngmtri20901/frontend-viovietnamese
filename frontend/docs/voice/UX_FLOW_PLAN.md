# Voice Chat Feature - UX Flow Plan

## Overview

This document outlines the UX flow for the Vietnamese voice chat feature with 5 different conversation modes, each designed to meet different learning objectives and provide appropriate user experiences.

---

## Mode Classification

### Group A: Casual Practice Modes (Pop-up/Dialog Flow)
- **Free Talk** - Open conversation practice
- **Scenario-Based** - Situational conversation practice

### Group B: Exam Preparation Modes (Fullscreen Setup Flow)
- **Part 1: Social Communication** - Basic Q&A and personal topics
- **Part 2: Solution Discussion** - Problem-solving conversations
- **Part 3: Topic Presentation** - Extended speaking on academic topics

---

## 1. Mode Details & Requirements

### 1.1 Free Talk Mode

**Purpose**: Practice conversational Vietnamese in a relaxed, unstructured environment

**User Flow**: Quick Start (Pop-up Dialog)
```
Home → Click "Free Talk" → Pop-up Dialog → Select Settings → Start Call
```

**Settings (in Pop-up)**:
- Language preference: Vietnamese only / Bilingual (Vietnamese + English)
- Topic (optional): User can suggest a topic or leave blank for AI to choose
- Difficulty level: Beginner / Intermediate / Advanced

**Vapi Assistant**: `free_talk_assistant`

**UI Components Needed**:
- Dialog/Modal component (shadcn/ui Dialog)
- Simple form with 3 fields
- Start button

**Implementation**:
```typescript
// Route: /ai/voice/speak?mode=free_talk
// Opens dialog on current page
<FreeModDialog>
  <Select language="vietnamese_only | bilingual" />
  <Input topic="optional" />
  <Select difficulty="beginner | intermediate | advanced" />
  <Button>Start Conversation</Button>
</FreeModDialog>
```

---

### 1.2 Scenario-Based Mode

**Purpose**: Practice Vietnamese in specific real-life situations (restaurant, shopping, doctor, etc.)

**User Flow**: Quick Start (Pop-up Dialog)
```
Home → Click "Scenario Practice" → Pop-up Dialog → Select Scenario → Start Call
```

**Settings (in Pop-up)**:
- Language preference: Vietnamese only / Bilingual (Vietnamese + English)
- Scenario selection: Dropdown with pre-defined scenarios
  - Ordering food at a restaurant
  - Shopping at a market
  - Asking for directions
  - Doctor's appointment
  - Job interview
  - Renting an apartment

**Vapi Assistant**: `scenario_based_assistant`

**UI Components Needed**:
- Dialog/Modal component
- Scenario selector with icons/images
- Language toggle

**Implementation**:
```typescript
// Route: /ai/voice/speak?mode=scenario_based
<ScenarioDialog>
  <Select language="vietnamese_only | bilingual" />
  <ScenarioGrid>
    {scenarios.map(scenario => (
      <ScenarioCard
        icon={scenario.icon}
        title={scenario.title}
        description={scenario.description}
      />
    ))}
  </ScenarioGrid>
  <Button>Start Practice</Button>
</ScenarioDialog>
```

---

### 1.3 Part 1: Social Communication (Exam Mode)

**Purpose**: Simulate real Vietnamese speaking test Part 1 - answering simple questions about familiar topics

**User Flow**: Full Setup Screen (New Page)
```
Home → Click "Part 1: Social Communication" → Setup Page → Rules Explanation → Start Test
```

**Test Format**:
- Duration: 3-5 minutes
- 8-10 simple questions
- Topics: Personal info, family, hobbies, daily routine, hometown
- Must speak Vietnamese only
- Automatic scoring

**Setup Page Sections**:

1. **Test Instructions** (top section)
   ```
   Part 1: Social Communication
   - Answer simple questions about yourself
   - Speak clearly in Vietnamese
   - Duration: 3-5 minutes
   - Automatic feedback provided
   ```

2. **Topic Pool Display** (middle section)
   Show possible topics that may be asked:
   - Personal introduction
   - Family
   - Hobbies and interests
   - Daily routine
   - Hometown/City
   - Education
   - Work/Job

3. **Test Rules** (expandable section)
   - Speak only in Vietnamese
   - Answer each question within 20-30 seconds
   - Be natural and conversational
   - Grammar and pronunciation will be evaluated

4. **Countdown Timer** (before start)
   - "Test will begin in 3... 2... 1..."

5. **Action Buttons**
   - [Back to Home] [Start Test]

**Vapi Assistant**: `part1_social_communication_assistant`

**UI Components Needed**:
- Full page layout
- Instructions card
- Topic chips/badges
- Rules accordion
- Countdown component
- Progress indicator

**Implementation**:
```typescript
// Route: /ai/voice/speak/exam/part1
<Part1SetupPage>
  <TestHeader
    title="Part 1: Social Communication"
    duration="3-5 minutes"
  />

  <InstructionsCard>
    {instructions}
  </InstructionsCard>

  <TopicPool topics={part1Topics} />

  <RulesAccordion>
    {rules}
  </RulesAccordion>

  <ActionButtons>
    <Button variant="outline">Back</Button>
    <Button onClick={handleStartTest}>Start Test</Button>
  </ActionButtons>
</Part1SetupPage>

// After start → Countdown → Agent Component
```

---

### 1.4 Part 2: Solution Discussion (Exam Mode)

**Purpose**: Simulate Vietnamese speaking test Part 2 - discussing solutions to everyday problems

**User Flow**: Full Setup Screen (New Page)
```
Home → Click "Part 2: Solution Discussion" → Setup Page → Draw Topic → Prepare → Start Test
```

**Test Format**:
- Duration: 5-7 minutes
- Random problem scenario provided
- 1 minute preparation time
- Must propose solutions and discuss pros/cons
- Vietnamese only
- Automatic scoring

**Setup Page Sections**:

1. **Test Instructions**
   ```
   Part 2: Solution Discussion
   - You will receive a problem scenario
   - Propose 2-3 solutions
   - Discuss advantages and disadvantages
   - Duration: 5-7 minutes
   - 1 minute preparation time
   ```

2. **How It Works**
   - Step 1: Draw a random topic
   - Step 2: Read the scenario (1 minute preparation)
   - Step 3: Discuss solutions with AI examiner

3. **Sample Topics Preview**
   Show 2-3 example scenarios:
   - "Your city has traffic congestion..."
   - "Young people spend too much time on social media..."
   - "Air pollution in urban areas..."

4. **Draw Topic Button**
   - Large button: "Draw My Topic"
   - After clicking → Show the scenario card
   - Start preparation countdown

5. **Preparation Phase**
   - Display the problem scenario
   - 60-second countdown timer
   - Tips: "Think about causes, solutions, pros & cons"

**Vapi Assistant**: `part2_solution_discussion_assistant`

**UI Components Needed**:
- Full page layout
- Topic draw mechanism
- Scenario card display
- Preparation timer (60 seconds)
- Note-taking area (optional)
- Multi-step progression

**Implementation**:
```typescript
// Route: /ai/voice/speak/exam/part2
<Part2SetupPage>
  <TestHeader
    title="Part 2: Solution Discussion"
    duration="5-7 minutes"
  />

  <InstructionsCard>
    {instructions}
  </InstructionsCard>

  <ProcessSteps>
    <Step>Draw Topic</Step>
    <Step>Prepare (60s)</Step>
    <Step>Discuss</Step>
  </ProcessSteps>

  <SampleTopics topics={sampleTopics} />

  {!topicDrawn ? (
    <DrawTopicButton onClick={drawRandomTopic}>
      Draw My Topic
    </DrawTopicButton>
  ) : (
    <PreparationPhase>
      <ScenarioCard scenario={drawnTopic} />
      <CountdownTimer seconds={60} />
      <NotesArea placeholder="Plan your ideas..." />
      <Button onClick={startTest}>
        Ready to Discuss
      </Button>
    </PreparationPhase>
  )}
</Part2SetupPage>
```

---

### 1.5 Part 3: Topic Presentation (Exam Mode)

**Purpose**: Simulate Vietnamese speaking test Part 3 - giving an extended presentation on an academic/social topic

**User Flow**: Full Setup Screen (New Page)
```
Home → Click "Part 3: Topic Presentation" → Setup Page → Choose Topic → Prepare → Present
```

**Test Format**:
- Duration: 7-10 minutes
- Choose from 3 random topics
- 2 minutes preparation time
- 3-4 minutes presentation
- 3-4 minutes Q&A with AI examiner
- Vietnamese only
- Automatic scoring

**Setup Page Sections**:

1. **Test Instructions**
   ```
   Part 3: Topic Presentation
   - Choose 1 topic from 3 options
   - Prepare for 2 minutes
   - Present for 3-4 minutes
   - Answer follow-up questions (3-4 minutes)
   - Total duration: 7-10 minutes
   ```

2. **Test Structure**
   - Phase 1: Topic selection (choose 1 from 3)
   - Phase 2: Preparation (2 minutes)
   - Phase 3: Presentation (3-4 minutes)
   - Phase 4: Q&A discussion (3-4 minutes)

3. **Topic Selection**
   Display 3 random topics as cards:
   ```
   Option 1: "The impact of technology on education"
   Option 2: "Environmental protection in modern society"
   Option 3: "The role of cultural traditions in today's world"
   ```

4. **Presentation Tips**
   - Structure: Introduction → Main points → Conclusion
   - Speak clearly and naturally
   - Use examples and explanations
   - Maintain good flow

5. **Preparation Phase**
   - Selected topic displayed
   - 120-second countdown
   - Note-taking area
   - Outline suggestions

**Vapi Assistant**: `part3_topic_presentation_assistant`

**UI Components Needed**:
- Full page layout
- Topic selection cards (3 options)
- Preparation timer (120 seconds)
- Note-taking area
- Presentation outline template
- Phase indicator (Selection → Prep → Present → Q&A)

**Implementation**:
```typescript
// Route: /ai/voice/speak/exam/part3
<Part3SetupPage>
  <TestHeader
    title="Part 3: Topic Presentation"
    duration="7-10 minutes"
  />

  <InstructionsCard>
    {instructions}
  </InstructionsCard>

  <TestPhases>
    <Phase>Select Topic</Phase>
    <Phase>Prepare (2min)</Phase>
    <Phase>Present (3-4min)</Phase>
    <Phase>Q&A (3-4min)</Phase>
  </TestPhases>

  {phase === 'selection' && (
    <TopicSelection>
      {threeRandomTopics.map(topic => (
        <TopicCard
          key={topic.id}
          title={topic.title}
          description={topic.description}
          onClick={() => selectTopic(topic)}
        />
      ))}
    </TopicSelection>
  )}

  {phase === 'preparation' && (
    <PreparationPhase>
      <SelectedTopic topic={selectedTopic} />
      <CountdownTimer seconds={120} />
      <OutlineTemplate>
        <Input placeholder="Introduction..." />
        <Input placeholder="Main Point 1..." />
        <Input placeholder="Main Point 2..." />
        <Input placeholder="Main Point 3..." />
        <Input placeholder="Conclusion..." />
      </OutlineTemplate>
      <Button onClick={startPresentation}>
        Start Presentation
      </Button>
    </PreparationPhase>
  )}

  {phase === 'presentation' && (
    <AgentComponent mode="part3_presentation" />
  )}
</Part3SetupPage>
```

---

## 2. UX Flow Comparison

| Feature | Group A (Dialog) | Group B (Fullscreen) |
|---------|-----------------|---------------------|
| **Entry Point** | Pop-up on same page | Navigate to new page |
| **Setup Time** | < 10 seconds | 30-60 seconds |
| **Instructions** | Minimal | Detailed |
| **Preparation** | None | Yes (1-2 minutes) |
| **Topic Selection** | Quick select | Draw/Choose |
| **Countdown** | No | Yes |
| **Notes Area** | No | Yes (Parts 2 & 3) |
| **Progress Indicator** | No | Yes |
| **Rules Display** | Brief tooltip | Full section |
| **Back Navigation** | Close dialog | Back button |

---

## 3. Navigation Structure

```
/ai/voice (Home)
├── Free Talk → Dialog on same page
├── Scenario Practice → Dialog on same page
├── Part 1: Social Communication → /ai/voice/speak/exam/part1
├── Part 2: Solution Discussion → /ai/voice/speak/exam/part2
└── Part 3: Topic Presentation → /ai/voice/speak/exam/part3
```

---

## 4. Vapi Assistant Mapping

| Mode | Assistant ID (Vapi) | Configuration Type |
|------|-------------------|-------------------|
| Free Talk | `free_talk_assistant` | Pre-configured in Vapi dashboard |
| Scenario-Based | `scenario_based_assistant` | Pre-configured in Vapi dashboard |
| Part 1 | `part1_social_assistant` | Pre-configured in Vapi dashboard |
| Part 2 | `part2_solution_assistant` | Pre-configured in Vapi dashboard |
| Part 3 | `part3_presentation_assistant` | Pre-configured in Vapi dashboard |

**Note**: You mentioned you have 4 assistants already created in Vapi. We'll need to create one more assistant (either split Free Talk and Scenario, or merge Part 2 and Part 3 depending on your preference).

---

## 5. Component Architecture

### Shared Components
```
/features/ai/voice/components/
├── Agent.tsx (existing - core calling component)
├── dialogs/
│   ├── FreeTalkDialog.tsx (NEW)
│   └── ScenarioDialog.tsx (NEW)
├── exam/
│   ├── Part1SetupPage.tsx (NEW)
│   ├── Part2SetupPage.tsx (NEW)
│   ├── Part3SetupPage.tsx (NEW)
│   ├── ExamInstructions.tsx (NEW)
│   ├── TopicDrawer.tsx (NEW)
│   ├── PreparationTimer.tsx (NEW)
│   └── ProgressIndicator.tsx (NEW)
└── common/
    ├── ModeSelector.tsx (NEW)
    └── TestRules.tsx (NEW)
```

---

## 6. Database Schema Updates

### Conversation Types
Update the `conversation_type` enum to support all 5 modes:

```sql
ALTER TYPE conversation_type ADD VALUE IF NOT EXISTS 'free_talk';
ALTER TYPE conversation_type ADD VALUE IF NOT EXISTS 'scenario_based';
ALTER TYPE conversation_type ADD VALUE IF NOT EXISTS 'part1_social';
ALTER TYPE conversation_type ADD VALUE IF NOT EXISTS 'part2_solution';
ALTER TYPE conversation_type ADD VALUE IF NOT EXISTS 'part3_presentation';
```

### Additional Fields in `voice_conversations` Table

```sql
ALTER TABLE voice_conversations
ADD COLUMN IF NOT EXISTS language_mode VARCHAR(20), -- 'vietnamese_only' or 'bilingual'
ADD COLUMN IF NOT EXISTS scenario_type VARCHAR(50), -- for scenario-based mode
ADD COLUMN IF NOT EXISTS preparation_time_seconds INT, -- for exam modes
ADD COLUMN IF NOT EXISTS topic_selected JSONB, -- stores the drawn/selected topic
ADD COLUMN IF NOT EXISTS test_phase VARCHAR(20); -- 'preparation', 'speaking', 'qa', etc.
```

---

## 7. Constants Update

### In `vietnamese-voice.ts`

```typescript
export const CONVERSATION_TYPES = {
  FREE_TALK: "free_talk",
  SCENARIO_BASED: "scenario_based",
  PART1_SOCIAL: "part1_social",
  PART2_SOLUTION: "part2_solution",
  PART3_PRESENTATION: "part3_presentation",
} as const;

export const CONVERSATION_TYPE_LABELS: Record<string, string> = {
  free_talk: "Free Talk",
  scenario_based: "Scenario Practice",
  part1_social: "Part 1: Social Communication",
  part2_solution: "Part 2: Solution Discussion",
  part3_presentation: "Part 3: Topic Presentation",
};

export const LANGUAGE_MODES = {
  VIETNAMESE_ONLY: "vietnamese_only",
  BILINGUAL: "bilingual",
} as const;

export const SCENARIO_TYPES = [
  {
    id: "restaurant",
    title: "At the Restaurant",
    icon: "🍜",
    description: "Ordering food and drinks",
  },
  {
    id: "shopping",
    title: "Shopping at Market",
    icon: "🛒",
    description: "Buying groceries and negotiating prices",
  },
  {
    id: "directions",
    title: "Asking Directions",
    icon: "🗺️",
    description: "Finding your way around the city",
  },
  {
    id: "doctor",
    title: "Doctor's Appointment",
    icon: "🏥",
    description: "Describing symptoms and health issues",
  },
  {
    id: "job_interview",
    title: "Job Interview",
    icon: "💼",
    description: "Professional interview practice",
  },
  {
    id: "apartment",
    title: "Renting Apartment",
    icon: "🏠",
    description: "Discussing rental terms and conditions",
  },
] as const;

export const PART2_TOPICS = [
  "Your city has serious traffic congestion. Suggest solutions.",
  "Young people spend too much time on social media. What can be done?",
  "Air pollution is a major problem in urban areas. How to address it?",
  "Many students struggle with time management. What are effective solutions?",
  "Food waste is increasing in restaurants and households. How to reduce it?",
  // ... add more
] as const;

export const PART3_TOPICS = [
  {
    id: "tech_education",
    title: "The Impact of Technology on Education",
    description: "Discuss how technology changes learning and teaching",
  },
  {
    id: "environment",
    title: "Environmental Protection in Modern Society",
    description: "The role of individuals and governments in protecting nature",
  },
  {
    id: "culture",
    title: "Cultural Traditions in Today's World",
    description: "Should we preserve traditions or embrace modernization?",
  },
  {
    id: "social_media",
    title: "Social Media and Human Connection",
    description: "Effects of social media on relationships and society",
  },
  {
    id: "work_life",
    title: "Work-Life Balance",
    description: "Challenges and solutions for modern professionals",
  },
  {
    id: "globalization",
    title: "Globalization and Cultural Identity",
    description: "Maintaining identity in an interconnected world",
  },
  // ... add more
] as const;
```

---

## 8. Home Page Updates

### Feature Cards Update

```typescript
// In /app/(app)/ai/voice/page.tsx

<section className="mb-12">
  <h2 className="text-2xl font-bold mb-4">Choose Your Practice Mode</h2>

  {/* Group A: Quick Practice */}
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-3 text-gray-600">
      Quick Practice
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FeatureCard
        title="Free Talk"
        icon="💬"
        mode="free_talk"
        description="Casual conversation in Vietnamese"
        onClick={() => openFreeTalkDialog()}
      />
      <FeatureCard
        title="Scenario Practice"
        icon="🎭"
        mode="scenario_based"
        description="Real-life situation practice"
        onClick={() => openScenarioDialog()}
      />
    </div>
  </div>

  {/* Group B: Exam Preparation */}
  <div>
    <h3 className="text-lg font-semibold mb-3 text-gray-600">
      Speaking Test Preparation
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FeatureCard
        title="Part 1: Social Communication"
        icon="👤"
        href="/ai/voice/speak/exam/part1"
        description="Simple Q&A about personal topics"
        badge="3-5 min"
      />
      <FeatureCard
        title="Part 2: Solution Discussion"
        icon="💡"
        href="/ai/voice/speak/exam/part2"
        description="Discuss solutions to problems"
        badge="5-7 min"
      />
      <FeatureCard
        title="Part 3: Topic Presentation"
        icon="🎤"
        href="/ai/voice/speak/exam/part3"
        description="Present and discuss a topic"
        badge="7-10 min"
      />
    </div>
  </div>
</section>
```

---

## 9. Implementation Checklist

### Phase 1: Foundation (Week 1)
- [ ] Update database schema with new conversation types
- [ ] Update constants file with all 5 modes
- [ ] Create 5 Vapi assistants (or configure existing 4 + 1 new)
- [ ] Update TypeScript types

### Phase 2: Group A - Dialog Modes (Week 1-2)
- [ ] Create `FreeTalkDialog.tsx`
- [ ] Create `ScenarioDialog.tsx`
- [ ] Update home page with mode selector
- [ ] Test dialog flows

### Phase 3: Group B - Exam Setup Pages (Week 2-3)
- [ ] Create `Part1SetupPage.tsx`
- [ ] Create `Part2SetupPage.tsx` with topic drawer
- [ ] Create `Part3SetupPage.tsx` with topic selection
- [ ] Implement preparation timers
- [ ] Add note-taking areas

### Phase 4: Shared Components (Week 3-4)
- [ ] Create `PreparationTimer.tsx`
- [ ] Create `TopicDrawer.tsx`
- [ ] Create `ExamInstructions.tsx`
- [ ] Create `ProgressIndicator.tsx`
- [ ] Update `Agent.tsx` for all 5 modes

### Phase 5: Testing & Polish (Week 4)
- [ ] Test all 5 flows end-to-end
- [ ] Verify Vapi integration for each mode
- [ ] Test feedback generation for each mode
- [ ] Mobile responsive testing
- [ ] Performance optimization

---

## 10. User Journey Examples

### Journey 1: Quick Practice (Free Talk)
1. User lands on `/ai/voice`
2. Clicks "Free Talk" card
3. Dialog appears (no page change)
4. Selects "Vietnamese only" + "Intermediate"
5. Clicks "Start"
6. Agent component activates
7. Conversation begins immediately
8. After ending → Feedback page

**Total setup time**: < 10 seconds

---

### Journey 2: Exam Preparation (Part 2)
1. User lands on `/ai/voice`
2. Clicks "Part 2: Solution Discussion" card
3. Navigates to `/ai/voice/speak/exam/part2`
4. Reads test instructions
5. Reviews sample topics
6. Clicks "Draw My Topic"
7. Random topic appears
8. 60-second preparation countdown starts
9. User reads topic and plans ideas
10. Clicks "Ready to Discuss"
11. Agent component activates
12. Test begins
13. After ending → Detailed exam feedback

**Total setup time**: 30-90 seconds (including prep)

---

## 11. Mobile Considerations

### Group A (Dialogs)
- Full-screen dialog on mobile
- Simplified form layout
- Large touch targets

### Group B (Fullscreen Pages)
- Vertical scroll layout
- Collapsible sections
- Fixed bottom action bar
- Preparation timer always visible

---

## 12. Accessibility

- Keyboard navigation for all modes
- Screen reader announcements for timers
- High contrast mode support
- Clear focus indicators
- ARIA labels for all interactive elements

---

## 13. Analytics Events to Track

```typescript
// Group A
trackEvent('voice_mode_selected', { mode: 'free_talk', language: 'vietnamese_only' })
trackEvent('scenario_selected', { scenario: 'restaurant' })

// Group B
trackEvent('exam_mode_started', { part: 'part1_social' })
trackEvent('topic_drawn', { mode: 'part2_solution', topic_id: 'traffic' })
trackEvent('topic_selected', { mode: 'part3_presentation', topic_id: 'tech_education' })
trackEvent('preparation_completed', { mode: 'part2', prep_time: 60 })
```

---

## 14. Success Metrics

### Group A (Dialog Modes)
- Average setup time < 15 seconds
- Completion rate > 80%
- User returns for 2nd session within 7 days

### Group B (Exam Modes)
- Average preparation time matches target
- Test completion rate > 70%
- Feedback satisfaction score > 4.0/5.0

---

## Next Steps

1. **Review with team**: Discuss the UX flow and make adjustments
2. **Vapi assistant setup**: Configure all 5 assistants with proper prompts
3. **Design mockups**: Create UI designs for each mode
4. **Start Phase 1**: Begin with database and constants updates
5. **Iterative development**: Build and test one mode at a time

---

## Questions to Address

1. Which existing 4 Vapi assistants map to which modes?
2. Should we create separate assistants for "Free Talk" and "Scenario-Based", or use one assistant with different configurations?
3. What should the exact scoring criteria be for each exam mode?
4. Should preparation notes be saved to the database for later review?
5. Do we need a practice mode for exam parts (no scoring, just practice)?

---

**Document Version**: 1.0
**Last Updated**: 2025-11-26
**Author**: Claude AI Assistant
