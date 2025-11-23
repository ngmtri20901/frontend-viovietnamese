'use client'

import { cn } from "@/shared/utils/cn";

interface TocItem {
  slug: string;
  text: string;
  level: number;
  subheadings: TocItem[];
}

interface TableOfContentsProps {
  outline: TocItem[];
}

export function TableOfContents({ outline }: TableOfContentsProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault(); // Ngăn hành vi mặc định của thẻ <a>
    const target = document.getElementById(slug);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth', // Cuộn mượt mà
        block: 'start', // Cuộn đến đầu phần tử
      });
    }
  };

  return (
    <nav>
      {outline.map((heading) => (
        <div key={heading.slug}>
          <a
            href={`#${heading.slug}`}
            onClick={(e) => handleClick(e, heading.slug)}
            className={cn(
              "block py-1 text-sm transition-colors",
              heading.level === 3 && "pl-4",
              heading.level === 4 && "pl-8",
              "text-gray-500 hover:text-gray-900"
            )}
          >
            {heading.text}
          </a>
          {heading.subheadings.length > 0 && (
            <TableOfContents outline={heading.subheadings} />
          )}
        </div>
      ))}
    </nav>
  );
}