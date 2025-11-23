// This file will store shared utility functions and constants for the blog. 

import { BookOpen, Lightbulb, Users, TrendingUp, Plane, Languages, Tag as TagIcon } from 'lucide-react';
import type { CategoryWithCount } from '@/features/blog/types/blog';

// Define category display names mapping
export const categoryDisplayNames: { [key: string]: string } = {
  'grammar': 'Grammar',
  'vocabulary': 'Vocabulary',
  'updates': 'App Updates',
  'vietnamese-culture': 'Vietnamese Culture',
  'learning-strategies': 'Learning Strategies',
  'travel-lifestyle': 'Travel and Lifestyle',
  'pronunciation': 'Pronunciation',
};

// Helper to get a placeholder icon for a category
export const getCategoryIcon = (categoryTitle: string, index: number) => {
  const icons = [BookOpen, Lightbulb, Users, TrendingUp, Plane, Languages, TagIcon];
  const lowerTitle = categoryTitle.toLowerCase();
  if (lowerTitle.includes("grammar")) return BookOpen;
  if (lowerTitle.includes("vocabulary")) return Languages;
  if (lowerTitle.includes("culture")) return Plane;
  if (lowerTitle.includes("strategies")) return Lightbulb;
  if (lowerTitle.includes("updates")) return TrendingUp;
  return icons[index % icons.length];
};

export const categoryBackgrounds = [
  { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
  { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
  { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-300' },
  { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-300' },
  { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300' },
  { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
];

export const categoryGroups = [
  {
    name: 'Language Fundamentals',
    titles: ['vocabulary', 'grammar', 'pronunciation'],
  },
  {
    name: 'Culture & Exploration',
    titles: ['vietnamese-culture', 'travel-lifestyle'],
  },
  {
    name: 'Learning Strategies',
    titles: ['learning-strategies'],
  },
  {
    name: 'App Updates',
    titles: ['updates'],
  },
]; 