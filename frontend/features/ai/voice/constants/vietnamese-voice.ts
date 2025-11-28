
// =====================================================
// VAPI ASSISTANT IDS
// =====================================================

export const VAPI_ASSISTANT_IDS = {
  FREE_TALK_SCENARIO: "0f2810a0-b81a-46bf-94a0-14f5c0bbbd2c", // VioTutor
  PART1_SOCIAL: "ac506a8e-25f6-4c4a-9160-cf9d3429c93d",
  PART2_SOLUTION: "eb7ad632-3715-4a3e-b5d4-dc536b3da5ef",
  PART3_PRESENTATION: "a5dc79d6-d23a-4e52-a16d-d77081b0f4db",
} as const;

// =====================================================
// CONVERSATION MODES
// =====================================================

export const CONVERSATION_MODES = {
  FREE_TALK: "free_talk",
  SCENARIO_BASED: "scenario_based",
  PART1_SOCIAL: "part1_social",
  PART2_SOLUTION: "part2_solution",
  PART3_PRESENTATION: "part3_presentation",
} as const;

export type ConversationMode = typeof CONVERSATION_MODES[keyof typeof CONVERSATION_MODES];

export const CONVERSATION_MODE_LABELS: Record<string, string> = {
  free_talk: "Free Talk",
  scenario_based: "Scenario Practice",
  part1_social: "Part 1: Social Communication",
  part2_solution: "Part 2: Solution Discussion",
  part3_presentation: "Part 3: Topic Presentation",
};

// =====================================================
// LANGUAGE MODES
// =====================================================

export const LANGUAGE_MODES = {
  VIETNAMESE_ONLY: "vietnamese_only",
  BILINGUAL: "bilingual",
} as const;

export type LanguageMode = typeof LANGUAGE_MODES[keyof typeof LANGUAGE_MODES];

export const LANGUAGE_MODE_LABELS: Record<string, string> = {
  vietnamese_only: "Vietnamese Only",
  bilingual: "Bilingual (Vietnamese + English)",
};

// =====================================================
// FEEDBACK LANGUAGES
// =====================================================

export const FEEDBACK_LANGUAGES = {
  VIETNAMESE: "vietnamese",
  ENGLISH: "english",
  CHINESE: "chinese",
  KOREAN: "korean",
  JAPANESE: "japanese",
  FRENCH: "french",
  GERMAN: "german",
  ITALIAN: "italian",
  PORTUGUESE: "portuguese",
  RUSSIAN: "russian",
  SPANISH: "spanish",
  THAI: "thai",
  TURKISH: "turkish",
} as const;

export type FeedbackLanguage = typeof FEEDBACK_LANGUAGES[keyof typeof FEEDBACK_LANGUAGES];

export const FEEDBACK_LANGUAGE_LABELS: Record<FeedbackLanguage, string> = {
  vietnamese: "Vietnamese (Tiếng Việt)",
  english: "English",
  chinese: "Chinese (中文)",
  korean: "Korean (한국어)",
  japanese: "Japanese (日本語)",
  french: "French (Français)",
  german: "German (Deutsch)",
  italian: "Italian (Italiano)",
  portuguese: "Portuguese (Português)",
  russian: "Russian (Русский)",
  spanish: "Spanish (Español)",
  thai: "Thai (ไทย)",
  turkish: "Turkish (Türkçe)",
};

// =====================================================
// DIFFICULTY LEVELS
// =====================================================

export const DIFFICULTY_LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
} as const;

export type DifficultyLevel = typeof DIFFICULTY_LEVELS[keyof typeof DIFFICULTY_LEVELS];

export const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

// =====================================================
// SCENARIO TYPES
// =====================================================

export const SCENARIO_TYPES = [
  {
    id: "restaurant",
    title: "At the Restaurant",
    icon: "🍜",
    description: "Ordering food and drinks in Vietnamese",
    context: "You are at a Vietnamese restaurant. Practice ordering food, asking about dishes, and making requests.",
  },
  {
    id: "shopping",
    title: "Shopping at Market",
    icon: "🛒",
    description: "Buying groceries and negotiating prices",
    context: "You are at a traditional Vietnamese market. Practice asking for prices, negotiating, and making purchases.",
  },
  {
    id: "directions",
    title: "Asking for Directions",
    icon: "🗺️",
    description: "Finding your way around the city",
    context: "You are lost in the city. Practice asking for directions and understanding location-based vocabulary.",
  },
  {
    id: "doctor",
    title: "Doctor's Appointment",
    icon: "🏥",
    description: "Describing symptoms and health issues",
    context: "You are at a doctor's office. Practice describing your symptoms and understanding medical advice in Vietnamese.",
  },
  {
    id: "job_interview",
    title: "Job Interview",
    icon: "💼",
    description: "Professional interview practice",
    context: "You are in a job interview. Practice introducing yourself professionally and answering common interview questions.",
  },
  {
    id: "apartment",
    title: "Renting an Apartment",
    icon: "🏠",
    description: "Discussing rental terms and conditions",
    context: "You are looking to rent an apartment. Practice discussing rental terms, amenities, and asking questions about the property.",
  },
] as const;

export type ScenarioType = typeof SCENARIO_TYPES[number];

// =====================================================
// PART 2 - SOLUTION DISCUSSION TOPICS
// =====================================================

export const PART2_TOPICS = [
  {
    id: "traffic_congestion",
    title: "Ùn tắc giao thông",
    titleEn: "Traffic Congestion",
    description: "Thành phố của bạn gặp vấn đề ùn tắc giao thông nghiêm trọng vào giờ cao điểm. Điều này ảnh hưởng đến công việc, sức khỏe và chất lượng cuộc sống của người dân. Bạn hãy đề xuất các giải pháp.",
    descriptionEn: "Your city experiences severe traffic congestion during peak hours. This affects people's work, health, and quality of life. Propose solutions.",
  },
  {
    id: "social_media_overuse",
    title: "Lạm dụng mạng xã hội",
    titleEn: "Social Media Overuse",
    description: "Giới trẻ hiện nay dành quá nhiều thời gian trên mạng xã hội, ảnh hưởng đến học tập và quan hệ gia đình. Bạn nghĩ nên làm gì?",
    descriptionEn: "Young people spend too much time on social media, affecting their studies and family relationships. What should be done?",
  },
  {
    id: "air_pollution",
    title: "Ô nhiễm không khí",
    titleEn: "Air Pollution",
    description: "Ô nhiễm không khí là vấn đề nghiêm trọng ở các thành phố lớn, ảnh hưởng đến sức khỏe cộng đồng. Hãy đề xuất giải pháp giải quyết vấn đề này.",
    descriptionEn: "Air pollution is a major problem in big cities, affecting public health. Propose solutions to address this issue.",
  },
  {
    id: "time_management",
    title: "Quản lý thời gian",
    titleEn: "Time Management",
    description: "Nhiều sinh viên gặp khó khăn trong việc quản lý thời gian giữa học tập, làm thêm và sinh hoạt cá nhân. Giải pháp hiệu quả là gì?",
    descriptionEn: "Many students struggle with managing time between studies, part-time work, and personal life. What are effective solutions?",
  },
  {
    id: "food_waste",
    title: "Lãng phí thức ăn",
    titleEn: "Food Waste",
    description: "Lãng phí thức ăn đang gia tăng ở các nhà hàng và hộ gia đình. Làm thế nào để giảm thiểu vấn đề này?",
    descriptionEn: "Food waste is increasing in restaurants and households. How can we reduce this problem?",
  },
  {
    id: "stress_students",
    title: "Căng thẳng học đường",
    titleEn: "Student Stress",
    description: "Học sinh hiện nay phải đối mặt với áp lực học tập rất lớn, dẫn đến căng thẳng và lo âu. Bạn đề xuất giải pháp gì?",
    descriptionEn: "Students today face enormous academic pressure, leading to stress and anxiety. What solutions do you propose?",
  },
] as const;

export type Part2Topic = typeof PART2_TOPICS[number];

// =====================================================
// PART 3 - PRESENTATION TOPICS
// =====================================================

export const PART3_TOPICS = [
  {
    id: "tech_education",
    title: "Tác động của công nghệ đến giáo dục",
    titleEn: "The Impact of Technology on Education",
    description: "Thảo luận về cách công nghệ thay đổi phương pháp học tập và giảng dạy trong xã hội hiện đại.",
    descriptionEn: "Discuss how technology changes learning and teaching methods in modern society.",
  },
  {
    id: "environment",
    title: "Bảo vệ môi trường trong xã hội hiện đại",
    titleEn: "Environmental Protection in Modern Society",
    description: "Vai trò của cá nhân và chính phủ trong việc bảo vệ thiên nhiên và môi trường sống.",
    descriptionEn: "The role of individuals and governments in protecting nature and the environment.",
  },
  {
    id: "culture",
    title: "Truyền thống văn hóa trong thế giới ngày nay",
    titleEn: "Cultural Traditions in Today's World",
    description: "Chúng ta nên giữ gìn truyền thống hay chấp nhận hiện đại hóa? Làm sao cân bằng hai yếu tố này?",
    descriptionEn: "Should we preserve traditions or embrace modernization? How to balance these two factors?",
  },
  {
    id: "social_media",
    title: "Mạng xã hội và kết nối con người",
    titleEn: "Social Media and Human Connection",
    description: "Tác động của mạng xã hội đến các mối quan hệ và xã hội. Lợi ích và thách thức.",
    descriptionEn: "Effects of social media on relationships and society. Benefits and challenges.",
  },
  {
    id: "work_life",
    title: "Cân bằng công việc và cuộc sống",
    titleEn: "Work-Life Balance",
    description: "Thách thức và giải pháp cho việc cân bằng giữa sự nghiệp và cuộc sống cá nhân trong thế giới hiện đại.",
    descriptionEn: "Challenges and solutions for balancing career and personal life in the modern world.",
  },
  {
    id: "globalization",
    title: "Toàn cầu hóa và bản sắc văn hóa",
    titleEn: "Globalization and Cultural Identity",
    description: "Làm thế nào để duy trì bản sắc văn hóa dân tộc trong thế giới toàn cầu hóa?",
    descriptionEn: "How to maintain national cultural identity in a globalized world?",
  },
  {
    id: "urban_rural",
    title: "Cuộc sống thành thị và nông thôn",
    titleEn: "Urban and Rural Life",
    description: "So sánh ưu điểm và nhược điểm của cuộc sống ở thành phố và nông thôn. Xu hướng di cư.",
    descriptionEn: "Compare advantages and disadvantages of urban and rural life. Migration trends.",
  },
  {
    id: "health_lifestyle",
    title: "Lối sống khỏe mạnh",
    titleEn: "Healthy Lifestyle",
    description: "Tầm quan trọng của lối sống khỏe mạnh. Thách thức trong việc duy trì sức khỏe ở xã hội hiện đại.",
    descriptionEn: "Importance of healthy lifestyle. Challenges in maintaining health in modern society.",
  },
] as const;

export type Part3Topic = typeof PART3_TOPICS[number];

// =====================================================
// VAPI ASSISTANT OVERRIDES HELPERS
// =====================================================

export interface FreeTalkVariables {
  userName: string;
  userId: string;
  conversationMode: "free_talk";
  languageMode: LanguageMode;
  topic?: string;
  difficultyLevel?: DifficultyLevel;
  assistantRole: string;
}

export interface ScenarioVariables {
  userName: string;
  userId: string;
  conversationMode: "scenario_based";
  languageMode: LanguageMode;
  scenarioType: string;
  scenarioDescription: string;
  difficultyLevel?: DifficultyLevel;
  assistantRole: string;
}

export interface Part1Variables {
  userName: string;
  userId: string;
  selectedTopics?: string; // JSON array of topic IDs (e.g., '["current_job", "family"]')
  allQuestions?: string; // JSON array of Part1Question objects
}

export interface Part2Variables {
  userName: string;
  userId: string;
  topicTitle: string;
  topicDescription: string;
  preparationTime: number;
}

export interface Part3Variables {
  userName: string;
  userId: string;
  topicId: string;
  topicTitle: string;
  topicDescription: string;
  preparationTime: number;
}

// Helper function to get assistant ID for a mode
export function getAssistantIdForMode(mode: ConversationMode): string {
  switch (mode) {
    case CONVERSATION_MODES.FREE_TALK:
    case CONVERSATION_MODES.SCENARIO_BASED:
      return VAPI_ASSISTANT_IDS.FREE_TALK_SCENARIO;
    case CONVERSATION_MODES.PART1_SOCIAL:
      return VAPI_ASSISTANT_IDS.PART1_SOCIAL;
    case CONVERSATION_MODES.PART2_SOLUTION:
      return VAPI_ASSISTANT_IDS.PART2_SOLUTION;
    case CONVERSATION_MODES.PART3_PRESENTATION:
      return VAPI_ASSISTANT_IDS.PART3_PRESENTATION;
    default:
      return VAPI_ASSISTANT_IDS.FREE_TALK_SCENARIO;
  }
}

// Helper to get random topics for Part 2
export function getRandomPart2Topic(): Part2Topic {
  return PART2_TOPICS[Math.floor(Math.random() * PART2_TOPICS.length)];
}

// Helper to get 3 random topics for Part 3
export function getRandomPart3Topics(count: number = 3): Part3Topic[] {
  const shuffled = [...PART3_TOPICS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// =====================================================
// FEEDBACK CATEGORIES (for Vietnamese learning)
// =====================================================

export const FEEDBACK_CATEGORIES = [
  {
    key: "pronunciation",
    name: "Pronunciation",
    description: "Accuracy of pronunciation and tones",
    color: "blue",
  },
  {
    key: "grammar",
    name: "Grammar",
    description: "Sentence structure and Vietnamese grammar",
    color: "green",
  },
  {
    key: "vocabulary",
    name: "Vocabulary",
    description: "Range and accuracy of vocabulary",
    color: "purple",
  },
  {
    key: "communication",
    name: "Communication",
    description: "Ability to express ideas clearly",
    color: "orange",
  },
  {
    key: "fluency",
    name: "Fluency",
    description: "Natural flow and coherence",
    color: "pink",
  },
];

// =====================================================
// SCORE THRESHOLDS
// =====================================================

export const SCORE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 75,
  AVERAGE: 60,
  NEEDS_IMPROVEMENT: 40,
};

export const SCORE_LABELS: Record<string, string> = {
  excellent: "Excellent",
  good: "Good",
  average: "Average",
  needs_improvement: "Needs Improvement",
  poor: "Poor",
};

export function getScoreLabel(score: number): string {
  if (score >= SCORE_THRESHOLDS.EXCELLENT) return SCORE_LABELS.excellent;
  if (score >= SCORE_THRESHOLDS.GOOD) return SCORE_LABELS.good;
  if (score >= SCORE_THRESHOLDS.AVERAGE) return SCORE_LABELS.average;
  if (score >= SCORE_THRESHOLDS.NEEDS_IMPROVEMENT)
    return SCORE_LABELS.needs_improvement;
  return SCORE_LABELS.poor;
}

// =====================================================
// OLD TYPES (deprecated, kept for backward compatibility)
// =====================================================

export const CONVERSATION_TYPES = {
  FREE_TALK: "free_talk",
  SCENARIO_BASED: "scenario_based",
  VOCABULARY_PRACTICE: "vocabulary_practice",
  PRONUNCIATION_DRILL: "pronunciation_drill",
} as const;

export const CONVERSATION_TYPE_LABELS: Record<string, string> = {
  free_talk: "Free Talk",
  scenario_based: "Scenario Practice",
  vocabulary_practice: "Vocabulary Practice",
  pronunciation_drill: "Pronunciation Drill",
  part1_social: "Part 1: Social Communication",
  part2_solution: "Part 2: Solution Discussion",
  part3_presentation: "Part 3: Topic Presentation",
};
