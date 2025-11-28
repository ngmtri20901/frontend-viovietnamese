// =====================================================
// PART 1 - SOCIAL COMMUNICATION QUESTIONS
// =====================================================
// 8 topics with 3-7 questions each (40+ total)

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

export const PART1_TOPICS: Part1Topic[] = [
  // =====================================================
  // TOPIC 1: Current Job / Occupation
  // =====================================================
  {
    id: "current_job",
    nameVi: "Công việc hiện tại",
    nameEn: "Current Job",
    questions: [
      {
        id: "job_1",
        questionVi: "Bạn làm nghề gì?",
        questionEn: "What is your job?",
      },
      {
        id: "job_2",
        questionVi: "Bạn làm việc ở đâu?",
        questionEn: "Where do you work?",
      },
      {
        id: "job_3",
        questionVi: "Bạn thích công việc của mình không? Tại sao?",
        questionEn: "Do you like your job? Why?",
      },
      {
        id: "job_4",
        questionVi: "Một ngày làm việc của bạn như thế nào?",
        questionEn: "What is your typical work day like?",
      },
    ],
  },

  // =====================================================
  // TOPIC 2: Vietnamese Impressions
  // =====================================================
  {
    id: "vietnamese_impressions",
    nameVi: "Ấn tượng về Việt Nam",
    nameEn: "Vietnamese Impressions",
    questions: [
      {
        id: "vn_1",
        questionVi: "Bạn đến Việt Nam bao lâu rồi?",
        questionEn: "How long have you been in Vietnam?",
      },
      {
        id: "vn_2",
        questionVi: "Bạn thấy Việt Nam như thế nào?",
        questionEn: "What do you think of Vietnam?",
      },
      {
        id: "vn_3",
        questionVi: "Bạn thích gì nhất ở Việt Nam?",
        questionEn: "What do you like most about Vietnam?",
      },
      {
        id: "vn_4",
        questionVi: "Bạn thấy người Việt Nam như thế nào?",
        questionEn: "What do you think of Vietnamese people?",
      },
      {
        id: "vn_5",
        questionVi: "Bạn có khó khăn gì khi sống ở Việt Nam không?",
        questionEn: "Do you have any difficulties living in Vietnam?",
      },
    ],
  },

  // =====================================================
  // TOPIC 3: Family
  // =====================================================
  {
    id: "family",
    nameVi: "Gia đình",
    nameEn: "Family",
    questions: [
      {
        id: "family_1",
        questionVi: "Gia đình bạn có mấy người?",
        questionEn: "How many people are in your family?",
      },
      {
        id: "family_2",
        questionVi: "Bạn có anh chị em không?",
        questionEn: "Do you have siblings?",
      },
      {
        id: "family_3",
        questionVi: "Bố mẹ bạn làm nghề gì?",
        questionEn: "What do your parents do?",
      },
      {
        id: "family_4",
        questionVi: "Bạn sống với ai?",
        questionEn: "Who do you live with?",
      },
    ],
  },

  // =====================================================
  // TOPIC 4: Describe Relatives
  // =====================================================
  {
    id: "describe_relatives",
    nameVi: "Miêu tả người thân",
    nameEn: "Describe Relatives",
    questions: [
      {
        id: "rel_1",
        questionVi: "Bạn giống ai trong gia đình?",
        questionEn: "Who in your family do you look like?",
      },
      {
        id: "rel_2",
        questionVi: "Người bạn thân nhất trong gia đình là ai?",
        questionEn: "Who is the closest person to you in your family?",
      },
      {
        id: "rel_3",
        questionVi: "Hãy miêu tả một người trong gia đình bạn.",
        questionEn: "Describe a member of your family.",
      },
      {
        id: "rel_4",
        questionVi: "Bạn học được gì từ bố mẹ?",
        questionEn: "What have you learned from your parents?",
      },
    ],
  },

  // =====================================================
  // TOPIC 5: Country Introduction
  // =====================================================
  {
    id: "country_introduction",
    nameVi: "Giới thiệu đất nước",
    nameEn: "Country Introduction",
    questions: [
      {
        id: "country_1",
        questionVi: "Bạn từ đâu đến?",
        questionEn: "Where are you from?",
      },
      {
        id: "country_2",
        questionVi: "Hãy giới thiệu về đất nước của bạn.",
        questionEn: "Tell me about your country.",
      },
      {
        id: "country_3",
        questionVi: "Nước bạn có gì nổi tiếng?",
        questionEn: "What is your country famous for?",
      },
      {
        id: "country_4",
        questionVi: "Thời tiết ở nước bạn như thế nào?",
        questionEn: "What is the weather like in your country?",
      },
      {
        id: "country_5",
        questionVi: "Bạn thích điều gì nhất ở quê hương?",
        questionEn: "What do you like most about your hometown?",
      },
    ],
  },

  // =====================================================
  // TOPIC 6: Daily Activities
  // =====================================================
  {
    id: "daily_activities",
    nameVi: "Hoạt động hàng ngày",
    nameEn: "Daily Activities",
    questions: [
      {
        id: "daily_1",
        questionVi: "Bạn thường dậy lúc mấy giờ?",
        questionEn: "What time do you usually wake up?",
      },
      {
        id: "daily_2",
        questionVi: "Buổi sáng bạn thường làm gì?",
        questionEn: "What do you usually do in the morning?",
      },
      {
        id: "daily_3",
        questionVi: "Bạn đi làm bằng gì?",
        questionEn: "How do you get to work?",
      },
      {
        id: "daily_4",
        questionVi: "Buổi tối bạn thường làm gì?",
        questionEn: "What do you usually do in the evening?",
      },
      {
        id: "daily_5",
        questionVi: "Cuối tuần bạn thường làm gì?",
        questionEn: "What do you usually do on weekends?",
      },
    ],
  },

  // =====================================================
  // TOPIC 7: Favorite Country
  // =====================================================
  {
    id: "favorite_country",
    nameVi: "Đất nước yêu thích",
    nameEn: "Favorite Country",
    questions: [
      {
        id: "fav_1",
        questionVi: "Bạn muốn đi du lịch ở đâu?",
        questionEn: "Where would you like to travel?",
      },
      {
        id: "fav_2",
        questionVi: "Tại sao bạn muốn đến nước đó?",
        questionEn: "Why do you want to go to that country?",
      },
      {
        id: "fav_3",
        questionVi: "Bạn đã từng đi nước ngoài chưa?",
        questionEn: "Have you ever been abroad?",
      },
      {
        id: "fav_4",
        questionVi: "Nước nào để lại cho bạn ấn tượng nhất?",
        questionEn: "Which country left the biggest impression on you?",
      },
    ],
  },

  // =====================================================
  // TOPIC 8: Coming to Vietnam
  // =====================================================
  {
    id: "coming_to_vietnam",
    nameVi: "Đến Việt Nam",
    nameEn: "Coming to Vietnam",
    questions: [
      {
        id: "coming_1",
        questionVi: "Tại sao bạn đến Việt Nam?",
        questionEn: "Why did you come to Vietnam?",
      },
      {
        id: "coming_2",
        questionVi: "Bạn học tiếng Việt bao lâu rồi?",
        questionEn: "How long have you been learning Vietnamese?",
      },
      {
        id: "coming_3",
        questionVi: "Tại sao bạn học tiếng Việt?",
        questionEn: "Why are you learning Vietnamese?",
      },
      {
        id: "coming_4",
        questionVi: "Bạn thấy tiếng Việt khó không?",
        questionEn: "Do you find Vietnamese difficult?",
      },
      {
        id: "coming_5",
        questionVi: "Bạn dự định ở Việt Nam bao lâu?",
        questionEn: "How long do you plan to stay in Vietnam?",
      },
      {
        id: "coming_6",
        questionVi: "Bạn muốn làm gì sau khi học xong tiếng Việt?",
        questionEn: "What do you want to do after finishing learning Vietnamese?",
      },
    ],
  },
];

// =====================================================
// ADDITIONAL TOPICS (for variety)
// =====================================================

export const PART1_ADDITIONAL_TOPICS: Part1Topic[] = [
  // =====================================================
  // TOPIC 9: Hobbies & Free Time
  // =====================================================
  {
    id: "hobbies",
    nameVi: "Sở thích",
    nameEn: "Hobbies",
    questions: [
      {
        id: "hobby_1",
        questionVi: "Sở thích của bạn là gì?",
        questionEn: "What are your hobbies?",
      },
      {
        id: "hobby_2",
        questionVi: "Bạn có hay đọc sách không?",
        questionEn: "Do you often read books?",
      },
      {
        id: "hobby_3",
        questionVi: "Bạn thích nghe nhạc gì?",
        questionEn: "What kind of music do you like?",
      },
      {
        id: "hobby_4",
        questionVi: "Bạn có chơi thể thao không?",
        questionEn: "Do you play sports?",
      },
      {
        id: "hobby_5",
        questionVi: "Bạn thích xem phim gì?",
        questionEn: "What kind of movies do you like?",
      },
    ],
  },

  // =====================================================
  // TOPIC 10: Food & Eating
  // =====================================================
  {
    id: "food",
    nameVi: "Ẩm thực",
    nameEn: "Food",
    questions: [
      {
        id: "food_1",
        questionVi: "Bạn thích ăn món gì?",
        questionEn: "What food do you like?",
      },
      {
        id: "food_2",
        questionVi: "Bạn có thích món ăn Việt Nam không?",
        questionEn: "Do you like Vietnamese food?",
      },
      {
        id: "food_3",
        questionVi: "Món Việt Nam nào bạn thích nhất?",
        questionEn: "What Vietnamese dish do you like the most?",
      },
      {
        id: "food_4",
        questionVi: "Bạn có biết nấu ăn không?",
        questionEn: "Do you know how to cook?",
      },
      {
        id: "food_5",
        questionVi: "Bạn thường ăn sáng lúc mấy giờ?",
        questionEn: "What time do you usually have breakfast?",
      },
    ],
  },

  // =====================================================
  // TOPIC 11: Education & Studies
  // =====================================================
  {
    id: "education",
    nameVi: "Học tập",
    nameEn: "Education",
    questions: [
      {
        id: "edu_1",
        questionVi: "Bạn học ở đâu?",
        questionEn: "Where do you study?",
      },
      {
        id: "edu_2",
        questionVi: "Bạn học ngành gì?",
        questionEn: "What is your major?",
      },
      {
        id: "edu_3",
        questionVi: "Tại sao bạn chọn ngành này?",
        questionEn: "Why did you choose this major?",
      },
      {
        id: "edu_4",
        questionVi: "Bạn có thích học không?",
        questionEn: "Do you like studying?",
      },
      {
        id: "edu_5",
        questionVi: "Môn học nào bạn thích nhất?",
        questionEn: "What subject do you like the most?",
      },
    ],
  },

  // =====================================================
  // TOPIC 12: Friends & Social Life
  // =====================================================
  {
    id: "friends",
    nameVi: "Bạn bè",
    nameEn: "Friends",
    questions: [
      {
        id: "friend_1",
        questionVi: "Bạn có nhiều bạn không?",
        questionEn: "Do you have many friends?",
      },
      {
        id: "friend_2",
        questionVi: "Bạn thân nhất của bạn là ai?",
        questionEn: "Who is your best friend?",
      },
      {
        id: "friend_3",
        questionVi: "Bạn quen nhau như thế nào?",
        questionEn: "How did you meet each other?",
      },
      {
        id: "friend_4",
        questionVi: "Bạn có bạn người Việt Nam không?",
        questionEn: "Do you have Vietnamese friends?",
      },
      {
        id: "friend_5",
        questionVi: "Các bạn thường làm gì khi gặp nhau?",
        questionEn: "What do you usually do when you meet your friends?",
      },
    ],
  },
];

// =====================================================
// ALL TOPICS COMBINED
// =====================================================

export const ALL_PART1_TOPICS: Part1Topic[] = [
  ...PART1_TOPICS,
  ...PART1_ADDITIONAL_TOPICS,
];

// =====================================================
// HELPER: Count total questions
// =====================================================

export function getTotalQuestionCount(): number {
  return ALL_PART1_TOPICS.reduce(
    (total, topic) => total + topic.questions.length,
    0
  );
}

// Total: 57 questions across 12 topics
