/**
 * Topic Randomizer Utility
 *
 * Provides functions for randomly selecting topics and questions
 * for the Vietnamese Speaking Test Exam.
 */

import {
  type Part1Topic,
  type Part1Question,
  ALL_PART1_TOPICS,
  PART1_TOPICS,
} from "../constants/exam-questions";
import {
  PART2_TOPICS,
  PART3_TOPICS,
  type Part2Topic,
  type Part3Topic,
} from "../constants/vietnamese-voice";

// =====================================================
// PART 1: Social Communication
// =====================================================

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Selects 2 random topics from the Part 1 topic pool
 * Uses only the core 8 topics by default for consistency
 */
export function selectPart1Topics(count: number = 2, useAllTopics: boolean = false): Part1Topic[] {
  const topicPool = useAllTopics ? ALL_PART1_TOPICS : PART1_TOPICS;
  const shuffled = shuffleArray(topicPool);
  return shuffled.slice(0, count);
}

/**
 * Selects 8-10 questions from the given topics
 * Distributes questions evenly between topics
 */
export function selectPart1Questions(
  topics: Part1Topic[],
  targetCount: number = 10
): Part1Question[] {
  // Get all questions from selected topics
  const allQuestions: Part1Question[] = [];
  
  // First, take at least 2 questions from each topic to ensure coverage
  const minPerTopic = 2;
  topics.forEach((topic) => {
    const shuffledTopicQuestions = shuffleArray(topic.questions);
    const questionsToTake = Math.min(minPerTopic, shuffledTopicQuestions.length);
    allQuestions.push(...shuffledTopicQuestions.slice(0, questionsToTake));
  });

  // If we need more questions, randomly select from remaining questions
  const remainingQuestions: Part1Question[] = [];
  topics.forEach((topic) => {
    const shuffledTopicQuestions = shuffleArray(topic.questions);
    remainingQuestions.push(...shuffledTopicQuestions.slice(minPerTopic));
  });

  // Add more questions if needed to reach target
  const additionalNeeded = targetCount - allQuestions.length;
  if (additionalNeeded > 0) {
    const shuffledRemaining = shuffleArray(remainingQuestions);
    allQuestions.push(...shuffledRemaining.slice(0, additionalNeeded));
  }

  // Shuffle the final selection to mix topics
  return shuffleArray(allQuestions);
}

/**
 * Convenience function that combines topic and question selection
 */
export function selectPart1TopicsAndQuestions(
  topicCount: number = 2,
  questionCount: number = 10
): {
  topics: Part1Topic[];
  questions: Part1Question[];
} {
  const topics = selectPart1Topics(topicCount);
  const questions = selectPart1Questions(topics, questionCount);
  return { topics, questions };
}

// =====================================================
// PART 2: Solution Discussion
// =====================================================

/**
 * Selects 1 random topic from Part 2 topics
 */
export function selectPart2Topic(): Part2Topic {
  const randomIndex = Math.floor(Math.random() * PART2_TOPICS.length);
  return PART2_TOPICS[randomIndex];
}

/**
 * Selects multiple Part 2 topics (useful for showing options)
 */
export function selectPart2Topics(count: number = 1): Part2Topic[] {
  const shuffled = shuffleArray([...PART2_TOPICS]);
  return shuffled.slice(0, Math.min(count, PART2_TOPICS.length));
}

// =====================================================
// PART 3: Topic Presentation
// =====================================================

/**
 * Selects 3 random topics from Part 3 topics for user to choose from
 */
export function selectPart3Topics(count: number = 3): Part3Topic[] {
  const shuffled = shuffleArray([...PART3_TOPICS]);
  return shuffled.slice(0, Math.min(count, PART3_TOPICS.length));
}

/**
 * Selects 1 random Part 3 topic (used when user wants random selection)
 */
export function selectPart3Topic(): Part3Topic {
  const randomIndex = Math.floor(Math.random() * PART3_TOPICS.length);
  return PART3_TOPICS[randomIndex];
}

// =====================================================
// TYPE EXPORTS FOR CONVENIENCE
// =====================================================

export type { Part1Topic, Part1Question };
export type { Part2Topic, Part3Topic };
