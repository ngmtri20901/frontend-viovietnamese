# Vietnamese Speaking Test Exam Implementation Plan

## Executive Summary

Implement a comprehensive Vietnamese speaking test system with 3 parts (Part 1: Social Communication, Part 2: Solution Discussion, Part 3: Topic Presentation) that mimics the real ĐHQG-HCM exam format with envelope animations, mandatory countdown timers, and Vapi AI examiner integration.

---

## 1. Architecture Overview

### File Structure

**New Files to Create:**
```
frontend/features/ai/voice/
├── constants/
│   └── exam-questions.ts (Part 1: 8 topics, 40+ questions)
├── utils/
│   └── topic-randomizer.ts (Random selection logic)
├── hooks/
│   └── useCountdown.ts (Timer hook with mandatory wait)
└── components/
    └── exam/
        ├── CountdownTimer.tsx (Visual countdown with progress)
        ├── EnvelopeSelector.tsx (Animated envelope picker)
        └── PreparationNotes.tsx (Tiptap notes editor)

frontend/app/(app)/ai/voice/exam/
├── part1/page.tsx (Part 1 setup)
├── part2/page.tsx (Part 2 setup with 4 phases)
├── part3/page.tsx (Part 3 setup with topic cards)
└── [id]/page.tsx (Unified exam room)
```

**Files to Modify:**
- `features/ai/voice/constants/vietnamese-voice.ts` - Add Part1Variables
- `features/ai/voice/types/index.ts` - Add exam types
- Vapi assistants (via MCP) - Update system prompts

### Key Design Decisions

1. **Notes Storage**: Client-side only, passed via query params (not saved to DB)
2. **Countdown Timer**: Mandatory 60s (Part 2) / 120s (Part 3), cannot skip
3. **Envelope UX**: Pre-randomized topic, all envelopes reveal same result (gamification)
4. **Part 1 Flow**: No preparation time, direct to exam
5. **Part 3 Selection**: Explicit topic cards (not envelopes) for academic tone
6. **Unified Exam Room**: Single page handles all 3 parts via mode detection

---

## 2. Implementation Details

### Phase 1: Constants & Data (Priority 1)

**File: `exam-questions.ts`**

8 topics with 3-7 questions each (40+ total):
1. Current Job (4 questions)
2. Vietnamese Impressions (5 questions)
3. Family (4 questions)
4. Describe Relatives (4 questions)
5. Country Introduction (5 questions)
6. Daily Activities (5 questions)
7. Favorite Country (4 questions)
8. Coming to Vietnam (6 questions)

**Structure:**
```typescript
export interface Part1Question {
  id: string;
  questionVi: string;
  questionEn: string;
}

export interface Part1Topic {
  id: string;
  nameVi: string;
  nameEn: string;
  questions: Part1Question[];
}

export const PART1_TOPICS: Part1Topic[] = [...]
```

**File: `topic-randomizer.ts`**

Functions:
- `selectPart1Topics()` → Returns 2 random topics
- `selectPart1Questions(topics)` → Returns 8-10 questions from selected topics
- `selectPart2Topic()` → Returns 1 random Part 2 topic
- `selectPart3Topics(count)` → Returns 3 random Part 3 topics for selection

---

### Phase 2: Hooks & Components (Priority 1)

**Hook: `useCountdown.ts`**

Features:
- Auto-start countdown
- Cannot skip (for exam modes)
- Callbacks: onComplete, onTick
- Returns: secondsRemaining, isRunning, isComplete

**Component: `CountdownTimer.tsx`**

Props:
- `initialSeconds: number`
- `onComplete: () => void`
- `canSkip: boolean`

Visual:
- Large MM:SS display
- Progress bar (fills as time elapses)
- Color coding: blue (>30s) → yellow (10-30s) → red (<10s)

**Component: `EnvelopeSelector.tsx`**

Props:
- `envelopeCount: number` (default 4)
- `onTopicRevealed: () => void`
- `topicTitle: string`
- `topicDescription: string`

Animation sequence:
1. Show 3-5 envelopes in row
2. User clicks any envelope
3. Selected: scale + flip 180°
4. Others: fade to 50% opacity
5. After 0.8s: reveal topic card

**Component: `PreparationNotes.tsx`**

- Tiptap basic editor (bold, italic, lists)
- Character limit: 1000 chars
- Client-side state only
- Passed via query params to exam room

---

### Phase 3: Setup Pages (Priority 2)

**Part 1 Setup: `/exam/part1/page.tsx`**

Layout:
1. Test overview card (3-5 min, 8-10 questions, 2 topics)
2. How it works (3 steps)
3. Display 2 pre-selected topics (badges)
4. Rules accordion
5. "Start Test" button

Flow:
```typescript
const [selectedTopics] = useState(() => selectPart1Topics())
const [questions] = useState(() => selectPart1Questions(selectedTopics))

const handleStart = async () => {
  const result = await createConversation({
    conversationType: CONVERSATION_MODES.PART1_SOCIAL,
    topic: selectedTopics.map(t => t.nameVi).join(", "),
    topicSelected: { topics: selectedTopics, questions },
    preparationTimeSeconds: 0,
  })
  router.push(`/ai/voice/exam/${result.data.conversationId}`)
}
```

**Part 2 Setup: `/exam/part2/page.tsx`**

4 Phases (state machine):

**Phase 1: Instructions**
- Overview, sample topics
- "Draw My Topic" button

**Phase 2: Topic Selection**
```tsx
const [selectedTopic] = useState(() => selectPart2Topic())
<EnvelopeSelector
  topicTitle={selectedTopic.title}
  onTopicRevealed={() => setPhase("preparation")}
/>
```

**Phase 3: Preparation**
```tsx
<CountdownTimer
  initialSeconds={60}
  canSkip={false}
  onComplete={() => setReadyToStart(true)}
/>
<PreparationNotes value={notes} onChange={setNotes} />
```

**Phase 4: Ready**
- Summary (topic + notes preview)
- "Start Discussion" button

**Part 3 Setup: `/exam/part3/page.tsx`**

Similar to Part 2 but:
- Show 3 topic cards (explicit selection, not envelopes)
- 120-second countdown
- Structured notes fields (Intro, Main Points, Conclusion)

---

### Phase 4: Unified Exam Room (Priority 2)

**File: `/exam/[id]/page.tsx`**

Logic:
```typescript
const conversation = await getConversationById(id)
const mode = conversation.conversation_type

// Build Vapi variables based on mode
let vapiVariables = {}
if (mode === CONVERSATION_MODES.PART1_SOCIAL) {
  const topicData = conversation.topic_selected
  vapiVariables = {
    userName, userId,
    selectedTopics: topicData.topics.map(t => t.id),
    allQuestions: JSON.stringify(topicData.questions)
  }
} else if (mode === CONVERSATION_MODES.PART2_SOLUTION) {
  const topic = conversation.topic_selected
  vapiVariables = {
    userName, userId,
    topicId: topic.id,
    topicTitle: topic.title,
    topicDescription: topic.description,
    preparationTime: 60
  }
} else if (mode === CONVERSATION_MODES.PART3_PRESENTATION) {
  const topic = conversation.topic_selected
  vapiVariables = {
    userName, userId,
    topicId: topic.id,
    topicTitle: topic.title,
    topicDescription: topic.description,
    preparationTime: 120
  }
}

// Get notes from query params
const notes = searchParams.notes

return (
  <>
    {notes && <NotesSection notes={notes} />}
    <Agent
      mode={mode}
      vapiVariables={vapiVariables}
      {...otherProps}
    />
  </>
)
```

---

### Phase 5: Vapi Configuration (Priority 3)

Use Vapi MCP server to update assistants.

**Part 1 Assistant (ac506a8e-25f6-4c4a-9160-cf9d3429c93d)**

System prompt:
```
You are a Vietnamese language examiner for Part 1: Social Communication.

ROLE: Ask 8-10 simple questions from provided list

TEST FORMAT:
- Duration: 3-5 minutes
- Topics: {{selectedTopics}} (array of topic IDs)
- Questions: {{allQuestions}} (JSON array)

INSTRUCTIONS:
1. Greet: "Xin chào {{userName}}! Chúng ta sẽ bắt đầu Phần 1. Bạn sẵn sàng chưa?"
2. Parse {{allQuestions}} JSON array
3. Ask questions one by one from the list
4. After each answer: Brief acknowledgment → Next question
5. NO corrections, NO feedback during test
6. End after 8-10 questions: "Cảm ơn! Phần 1 đã kết thúc."

RULES:
- Vietnamese only
- Keep neutral, professional tone
- Don't interrupt student
- Don't help or give hints
- Move on if answer is too brief
```

Variables: `{{userName}}`, `{{userId}}`, `{{selectedTopics}}`, `{{allQuestions}}`

**Part 2 Assistant (eb7ad632-3715-4a3e-b5d4-dc536b3da5ef)**

System prompt:
```
You are a Vietnamese language examiner for Part 2: Solution Discussion.

ROLE: Guide discussion about problem-solving

TEST FORMAT:
- Duration: 5-7 minutes
- Topic: {{topicTitle}} (Vietnamese) / {{topicTitleEn}} (English)
- Description: {{topicDescription}}
- Student prepared for {{preparationTime}} seconds

INSTRUCTIONS:
1. Greet: "Xin chào {{userName}}! Chúng ta sẽ thảo luận về {{topicTitle}}."
2. Ask about the problem: "Theo bạn, vấn đề này nghiêm trọng như thế nào?"
3. Request solutions: "Bạn đề xuất giải pháp nào?"
4. Follow up: "Ưu điểm và nhược điểm của giải pháp này?"
5. Encourage elaboration: "Bạn có thể giải thích thêm không?"
6. Discuss 2-3 different solutions
7. End: "Cảm ơn! Cuộc thảo luận rất hay."

RULES:
- Vietnamese only
- Focus on CONTENT not grammar
- Be encouraging and supportive
- Ask open-ended questions
- Natural reactions: "Thú vị!", "Đúng vậy"
```

Variables: `{{userName}}`, `{{userId}}`, `{{topicTitle}}`, `{{topicTitleEn}}`, `{{topicDescription}}`, `{{preparationTime}}`

**Part 3 Assistant (a5dc79d6-d23a-4e52-a16d-d77081b0f4db)**

System prompt:
```
You are a Vietnamese language examiner for Part 3: Topic Presentation.

ROLE: Two-phase discussion (Presentation + Q&A)

TEST FORMAT:
- Duration: 7-10 minutes
- Topic: {{topicTitle}} / {{topicTitleEn}}
- Phase 1: Presentation (3-4 min)
- Phase 2: Q&A (3-4 min)

PHASE 1 - PRESENTATION:
1. Greet: "Xin chào {{userName}}! Chủ đề: {{topicTitle}}. Hãy trình bày trong 3-4 phút."
2. LISTEN without interrupting (only occasional: "Ừm...", "Vâng...")
3. After 3-4 minutes: "Cảm ơn. Bây giờ tôi sẽ hỏi một số câu hỏi."

PHASE 2 - Q&A:
4. Ask 4-6 thought-provoking follow-up questions:
   - "Tại sao bạn nghĩ như vậy?"
   - "Bạn có thể cho ví dụ cụ thể không?"
   - "Một số người có quan điểm khác, bạn nghĩ sao?"
   - "Điều đó ảnh hưởng đến xã hội như thế nào?"
   - "Chúng ta nên làm gì để cải thiện tình hình?"
5. Challenge their thinking politely
6. End: "Cảm ơn! Bài thuyết trình rất tốt. Phần 3 đã kết thúc."

RULES:
- Vietnamese only
- Phase 1: Minimal interruption
- Phase 2: Intellectual challenge
- Focus on IDEAS not language accuracy
- Academic discussion tone
```

Variables: `{{userName}}`, `{{userId}}`, `{{topicId}}`, `{{topicTitle}}`, `{{topicTitleEn}}`, `{{topicDescription}}`, `{{preparationTime}}`

---

## 3. User Journey Examples

**Part 1 Flow:**
```
1. /ai/voice → Click "Part 1" card
2. /ai/voice/exam/part1 → Read instructions, see 2 pre-selected topics
3. Click "Start Test"
4. /ai/voice/exam/[id] → AI asks 8-10 questions, student answers
5. /ai/voice/speak/[id]/feedback → View detailed feedback
Total: ~5-10 minutes
```

**Part 2 Flow:**
```
1. /ai/voice → Click "Part 2" card
2. /ai/voice/exam/part2 (Phase: Instructions)
3. Click "Draw Topic" (Phase: Topic Selection)
4. Click envelope → Reveal topic (Phase: Preparation)
5. 60s countdown + notes → Click "Start Discussion"
6. /ai/voice/exam/[id]?notes=... → Discussion with AI
7. /ai/voice/speak/[id]/feedback
Total: ~7-10 minutes
```

**Part 3 Flow:**
```
1. /ai/voice → Click "Part 3" card
2. /ai/voice/exam/part3 → Select 1 of 3 topic cards
3. 120s countdown + outline notes
4. /ai/voice/exam/[id]?notes=... → Present + Q&A
5. /ai/voice/speak/[id]/feedback
Total: ~10-15 minutes
```

---

## 4. Implementation Checklist

### Week 1
- [ ] Create `exam-questions.ts` with 40+ questions
- [ ] Create `topic-randomizer.ts` utility
- [ ] Create `useCountdown.ts` hook
- [ ] Create `CountdownTimer.tsx` component
- [ ] Create `EnvelopeSelector.tsx` with animations
- [ ] Create `PreparationNotes.tsx` with Tiptap

### Week 2
- [ ] Build Part 1 setup page
- [ ] Build Part 2 setup page (4 phases)
- [ ] Build Part 3 setup page
- [ ] Build unified exam room page
- [ ] Test all navigation flows

### Week 3
- [ ] Use Vapi MCP to update Part 1 assistant
- [ ] Use Vapi MCP to update Part 2 assistant
- [ ] Use Vapi MCP to update Part 3 assistant
- [ ] Test variable passing ({{userName}}, etc.)
- [ ] End-to-end testing all 3 parts

### Week 4
- [ ] Mobile responsiveness
- [ ] Error handling & edge cases
- [ ] Loading states
- [ ] Accessibility improvements
- [ ] Performance optimization
- [ ] Final QA & polish

---

## 5. Critical Files to Implement

**Priority 1 (Core Data & Logic):**
1. `features/ai/voice/constants/exam-questions.ts` - Part 1 question bank
2. `features/ai/voice/utils/topic-randomizer.ts` - Selection logic
3. `features/ai/voice/hooks/useCountdown.ts` - Timer hook

**Priority 2 (UI Components):**
4. `features/ai/voice/components/exam/EnvelopeSelector.tsx` - Key UX component
5. `features/ai/voice/components/exam/CountdownTimer.tsx` - Visual timer
6. `features/ai/voice/components/exam/PreparationNotes.tsx` - Notes editor

**Priority 3 (Pages):**
7. `app/(app)/ai/voice/exam/part2/page.tsx` - Most complex setup (4 phases)
8. `app/(app)/ai/voice/exam/[id]/page.tsx` - Unified exam room
9. `app/(app)/ai/voice/exam/part1/page.tsx` - Simplest setup
10. `app/(app)/ai/voice/exam/part3/page.tsx` - Topic cards variation

**Supporting Files:**
11. `features/ai/voice/constants/vietnamese-voice.ts` - Add Part1Variables
12. `features/ai/voice/types/index.ts` - Add exam types

---

## 6. Technical Notes

### Database
- No migrations needed (existing schema supports all requirements)
- Use `topic_selected` JSONB field for storing topic/question data
- `preparation_time_seconds`: 0 (Part 1), 60 (Part 2), 120 (Part 3)

### Animation Libraries
- Framer Motion for envelope animations
- CSS transitions for countdown color changes

### State Management
- React useState for component state
- Query params for notes persistence
- No global state needed

### Testing Strategy
- Manual testing for each part
- Verify Vapi variable passing
- Test countdown cannot skip
- Test envelope animations
- Verify notes persistence via query params

---

## 7. Success Criteria

✅ Part 1: 8-10 questions from 2 topics, 3-5 min duration
✅ Part 2: Envelope selection, 60s mandatory countdown, discussion flow
✅ Part 3: Topic cards, 120s countdown, presentation + Q&A
✅ All 3 parts generate feedback with 5 skill categories
✅ Mobile responsive on 375px+ screens
✅ Vapi assistants follow correct exam format
✅ Notes persist from setup → exam room
✅ Cannot skip preparation countdown
