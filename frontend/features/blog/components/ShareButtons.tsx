'use client'

import { Button } from "@/shared/components/ui/button";
import { Twitter, Facebook, Linkedin, Share2 } from "lucide-react";

interface ShareButtonsProps {
  shareUrl: string;
  shareTitle: string;
}

export function ShareButtons({ shareUrl, shareTitle }: ShareButtonsProps) {
  // Hàm mở pop-up window
  const openPopup = (url: string) => {
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2; // Căn giữa theo chiều ngang
    const top = (window.innerHeight - height) / 2; // Căn giữa theo chiều dọc
    const features = `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`;
    window.open(url, 'popup', features);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => openPopup(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`)}
      >
        <Twitter className="h-4 w-4 text-[#1DA1F2]" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => openPopup(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`)}
      >
        <Facebook className="h-4 w-4 text-[#1877F2]" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => openPopup(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`)}
      >
        <Linkedin className="h-4 w-4 text-[#0A66C2]" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigator.share({ url: shareUrl, title: shareTitle })}
      >
        <Share2 className="h-4 w-4 text-[#6B7280]" />
      </Button>
    </div>
  );
}