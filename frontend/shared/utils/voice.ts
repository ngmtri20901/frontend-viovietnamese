// =====================================================
// VIETNAMESE VOICE CHAT UTILITIES
// =====================================================

/**
 * Get random cover image for Vietnamese conversation cards
 */
export function getRandomConversationCover(): string {
  const covers = [
    "/voice/cover-1.jpg",
    "/voice/cover-2.jpg",
    "/voice/cover-3.jpg",
    "/voice/cover-4.jpg",
    "/voice/cover-5.jpg",
    "/voice/cover-6.jpg",
    "/voice/cover-7.jpg",
    "/voice/cover-8.jpg",
  ];
  return covers[Math.floor(Math.random() * covers.length)];
}

/**
 * Get emoji icon for Vietnamese topic
 */
export function getTopicIcon(topicTitle: string): string {
  const iconMap: Record<string, string> = {
    "Giới thiệu bản thân": "👋",
    "Ăn uống": "🍜",
    "Du lịch": "✈️",
    "Mua sắm": "🛍️",
    "Gia đình": "👨‍👩‍👧‍👦",
    "Công việc": "💼",
    "Sức khỏe": "🏥",
    "Giáo dục": "📚",
    "Thể thao": "⚽",
    "Giải trí": "🎬",
    "Thời tiết": "☁️",
    "Giao thông": "🚗",
    "Nhà ở": "🏠",
    "Quần áo": "👕",
    "Màu sắc": "🎨",
    "Số đếm": "🔢",
    "Thời gian": "⏰",
    "Ngày tháng": "📅",
  };
  return iconMap[topicTitle] || "💬";
}

/**
 * Get CSS color class for difficulty level
 */
export function getDifficultyColor(level: string): string {
  const colors: Record<string, string> = {
    beginner: "bg-green-500",
    intermediate: "bg-yellow-500",
    advanced: "bg-red-500",
  };
  return colors[level] || "bg-gray-500";
}

/**
 * Get badge color for difficulty level (light background)
 */
export function getDifficultyBadgeColor(level: string): string {
  const colors: Record<string, string> = {
    beginner: "bg-green-100 text-green-700",
    intermediate: "bg-yellow-100 text-yellow-700",
    advanced: "bg-red-100 text-red-700",
  };
  return colors[level] || "bg-gray-100 text-gray-700";
}

/**
 * Get conversation type label
 */
export function getConversationTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    free_talk: "Free Talk",
    scenario_based: "Scenario-Based",
    vocabulary_practice: "Vocabulary Practice",
    pronunciation_drill: "Pronunciation Drill",
  };
  return labels[type] || type;
}

