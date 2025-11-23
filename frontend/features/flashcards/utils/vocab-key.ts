/**
 * Utility functions for generating and parsing deterministic vocabulary keys
 * Format: t{topicId}-l{lessonId}-{slugified_vietnamese}
 */

/**
 * Generates a deterministic vocabulary key from topic, lesson, and Vietnamese text
 * @param topicId - Topic ID (bigint)
 * @param lessonId - Lesson ID (bigint)
 * @param vietnameseText - Vietnamese text to slugify
 * @returns Deterministic key in format: t{topicId}-l{lessonId}-{slugified}
 */
export function generateVocabKey(
  topicId: number,
  lessonId: number,
  vietnameseText: string
): string {
  const slugified = vietnameseText
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^\w\-_]/g, '')
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, ''); // Remove leading/trailing underscores

  return `t${topicId}-l${lessonId}-${slugified}`;
}

/**
 * Parses a vocabulary key to extract topic ID, lesson ID, and slug
 * @param key - Vocabulary key in format: t{topicId}-l{lessonId}-{slug}
 * @returns Parsed components or null if invalid format
 */
export function parseVocabKey(
  key: string
): { topicId: number; lessonId: number; slug: string } | null {
  const match = key.match(/^t(\d+)-l(\d+)-(.+)$/);
  if (!match) return null;

  return {
    topicId: parseInt(match[1], 10),
    lessonId: parseInt(match[2], 10),
    slug: match[3],
  };
}

/**
 * Checks if a string is a valid vocabulary key format
 * @param key - String to validate
 * @returns True if key matches vocabulary key format
 */
export function isValidVocabKey(key: string): boolean {
  return /^t\d+-l\d+-[\w\-_]+$/.test(key);
}

