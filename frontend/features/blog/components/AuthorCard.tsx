'use client';

import { urlFor } from '@/lib/sanity/client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { PortableText } from "@portabletext/react";
import Link from 'next/link';

interface AuthorCardProps {
  author: {
    name: string;
    slug: { current: string };
    image: any;
    bio: any[];
  };
}

export function AuthorCard({ author }: AuthorCardProps) {
  if (!author) return null;

  return (
    <Card className="p-6 mt-8">
      <Link 
        href={`/blog/author/${author.slug.current}`}
        className="flex items-start gap-4 group"
      >
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={author.image ? urlFor(author.image).width(64).height(64).url() : ''}
            alt={author.name}
          />
          <AvatarFallback>
            {author.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold group-hover:underline">
            {author.name}
          </h3>
          <div className="text-sm text-gray-600 mt-2 prose-sm">
            <PortableText value={author.bio} />
          </div>
        </div>
      </Link>
    </Card>
  );
} 