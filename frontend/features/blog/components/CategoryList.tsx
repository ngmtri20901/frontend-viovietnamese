// This file will contain the CategoryList component. 

import Link from "next/link";
import { Badge } from "@/shared/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible";
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { CategoryWithCount, GroupedCategory } from "@/features/blog/types/blog";
import { categoryDisplayNames, getCategoryIcon, categoryBackgrounds } from "@/features/blog/utils/blogUtils";

interface CategoryListProps {
  groupedCategories: GroupedCategory[];
  selectedCategorySlug?: string;
}

export function CategoryList({ groupedCategories, selectedCategorySlug }: CategoryListProps) {
  if (groupedCategories.length === 0) {
    return <p className="text-gray-600">No categories found.</p>;
  }

  // Find the group that contains the selected category
  const selectedGroupIndex = groupedCategories.findIndex(group => 
    group.categories.some(category => category.slug === selectedCategorySlug)
  );

  return (
    <div className="space-y-4">
      {groupedCategories.map((group, groupIndex) => {
        // Only keep the group with the selected category open
        const isOpen = selectedGroupIndex === groupIndex;
        
        return (
          <Collapsible 
            key={group.name} 
            defaultOpen={isOpen}
            className="transition-all duration-500 ease-in-out"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 group">
              <h3 className="text-lg font-medium text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                {group.name}
              </h3>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2 group-hover:text-gray-600 transition-colors duration-300">
                  ({group.categories.reduce((sum: number, cat: CategoryWithCount) => sum + (cat.postCount || 0), 0)})
                </span>
                <div className="transform transition-transform duration-500 ease-in-out [&[data-state=open]>.chevron-up]:block [&[data-state=open]>.chevron-down]:hidden">
                  <ChevronDown className="chevron-down h-5 w-5 text-gray-500 transition-transform duration-500 ease-in-out" />
                  <ChevronUp className="chevron-up h-5 w-5 text-gray-500 hidden transition-transform duration-500 ease-in-out" />
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="transition-all duration-500 ease-in-out">
              <div className="space-y-2 mt-2">
                {group.categories.map((category: CategoryWithCount, index: number) => {
                  const IconComponent = getCategoryIcon(category.title, index);
                  const colors = categoryBackgrounds[index % categoryBackgrounds.length];
                  const displayTitle = categoryDisplayNames[category.title] || category.title;
                  const isSelected = selectedCategorySlug === category.slug;

                  return (
                    <Link 
                      key={category._id} 
                      href={`/blog/category/${category.slug}`} 
                      className="block group"
                    >
                      <div 
                        className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-500 ease-in-out transform ${
                          isSelected
                            ? `${colors.border} ${colors.bg} shadow-md scale-[1.02]`
                            : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:shadow-sm hover:scale-[1.01]'
                        }`}
                      >
                        <div className="flex items-center">
                          <IconComponent 
                            size={20} 
                            className={`mr-3 transition-all duration-500 ease-in-out ${
                              isSelected ? colors.text : 'text-gray-400 group-hover:text-gray-500'
                            }`} 
                          />
                          <span 
                            className={`font-medium transition-all duration-500 ease-in-out ${
                              isSelected 
                                ? `${colors.text} underline` 
                                : 'text-gray-400 group-hover:text-gray-500 group-hover:underline'
                            }`}
                          >
                            {displayTitle}
                          </span>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs transition-all duration-500 ease-in-out ${
                            isSelected 
                              ? `${colors.text} bg-white border ${colors.border}` 
                              : 'text-gray-400 bg-white border-gray-200 group-hover:text-gray-500 group-hover:border-gray-300'
                          }`}
                        >
                          {category.postCount}
                        </Badge>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
} 