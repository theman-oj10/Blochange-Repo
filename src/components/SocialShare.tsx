import React, { useState } from 'react';
import {
  X as TwitterIcon,
  Facebook,
  Linkedin,
  Instagram,
  MessageCircle
} from 'lucide-react';

const SocialShare = ({ projectName, projectDescription }) => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${projectName}: ${projectDescription}`)}&url=${encodeURIComponent(currentUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(projectName)}&summary=${encodeURIComponent(projectDescription)}`,
    instagram: `instagram://library?AssetPath=${encodeURIComponent(currentUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Check out ${projectName}: ${currentUrl}`)}`
  };

  const handleShare = async (platform) => {
    try {
      const url = shareLinks[platform];
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Sharing failed:', error);
    }
  };

  const shareButtons = [
    { 
      platform: 'twitter', 
      icon: TwitterIcon, 
      bgColor: 'bg-black hover:bg-gray-800',
      size: 'w-3.5 h-3.5' 
    },
    { 
      platform: 'facebook', 
      icon: Facebook, 
      bgColor: 'bg-[#4267B2] hover:bg-blue-700',
      size: 'w-3.5 h-3.5' 
    },
    { 
      platform: 'linkedin', 
      icon: Linkedin, 
      bgColor: 'bg-[#0077B2] hover:bg-blue-800',
      size: 'w-3.5 h-3.5' 
    },
    { 
      platform: 'instagram', 
      icon: Instagram, 
      bgColor: 'bg-[#E4405F] hover:bg-pink-600',
      size: 'w-3.5 h-3.5' 
    },
    { 
      platform: 'whatsapp', 
      icon: MessageCircle, 
      bgColor: 'bg-[#25D366] hover:bg-green-500',
      size: 'w-3.5 h-3.5' 
    }
  ];

  return (
    <div className="w-full flex justify-end mb-4">
      <div className="flex items-center gap-2">
        {shareButtons.map(({ platform, icon: Icon, bgColor, size }) => (
          <button
            key={platform}
            onClick={() => handleShare(platform)}
            className={`${bgColor} p-2 rounded-full transition-all duration-200 hover:scale-105 flex items-center justify-center`}
            aria-label={`Share on ${platform}`}
          >
            <Icon className={`${size} text-white`} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SocialShare;