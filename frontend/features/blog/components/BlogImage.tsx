'use client';

import Image from 'next/image';
import { client, urlFor } from '@/shared/lib/sanity/client';
import { useNextSanityImage } from 'next-sanity-image';

interface BlogImageProps {
  image: any;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

interface SanityImageProps {
  src: string;
  loader: any;
  width: number;
  height: number;
}

const BlogImage: React.FC<BlogImageProps> = ({ 
  image, 
  alt = 'Image',
  width = 500,
  height = 300,
  className = ''
}) => {
  const imageProps = useNextSanityImage(client, image) as SanityImageProps | null;

  if (!imageProps) {
    return (
      <Image
        src={urlFor(image).url()}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  return (
    <Image
      src={imageProps.src}
      loader={imageProps.loader}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
};

export default BlogImage; 