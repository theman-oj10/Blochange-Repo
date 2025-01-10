import React from 'react';
import { Twitter, Facebook, Linkedin, Instagram, Link } from 'lucide-react';

interface SocialShareProps {
  projectName: string;
  projectDescription: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ projectName, projectDescription }) => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const handleShare = (platform: string) => {
    const shareLinks = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${projectName}: ${projectDescription}`)}&url=${encodeURIComponent(currentUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(projectName)}&summary=${encodeURIComponent(projectDescription)}`,
      instagram: `instagram://library?AssetPath=${encodeURIComponent(currentUrl)}`,
      copyLink: currentUrl
    };

    try {
      if (platform === 'copyLink') {
        navigator.clipboard.writeText(currentUrl);
        return;
      }
      const url = shareLinks[platform];
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Sharing failed:', error);
    }
  };

  return (
    <div className="flex justify-center gap-4">
      {[
        { icon: Twitter, platform: 'twitter' },
        { icon: Facebook, platform: 'facebook' },
        { icon: Linkedin, platform: 'linkedin' },
        { icon: Instagram, platform: 'instagram' },
        { icon: Link, platform: 'copyLink' }
      ].map(({ icon: Icon, platform }) => (
        <button
          key={platform}
          onClick={() => handleShare(platform)}
          className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <Icon className="w-5 h-5 text-gray-600" />
        </button>
      ))}
    </div>
  );
};

export default SocialShare;