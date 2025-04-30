
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  Archive, 
  Image, 
  Scan 
} from 'lucide-react';

type ToolType = 'case-retagging' | 'insight-archiving' | 'logo-slide-generator' | 'iris-image-scrapper';

interface ToolCardProps {
  type: ToolType;
  title: string;
  description: string;
  className?: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ 
  type, 
  title, 
  description,
  className 
}) => {
  const getIconAndColor = () => {
    switch (type) {
      case 'case-retagging':
        return {
          icon: <FileText size={24} />,
          bgColor: 'bg-red-100',
          iconColor: 'text-red-400',
          borderColor: 'hover:border-red-200',
        };
      case 'insight-archiving':
        return {
          icon: <Archive size={24} />,
          bgColor: 'bg-blue-100',
          iconColor: 'text-blue-400',
          borderColor: 'hover:border-blue-200',
        };
      case 'logo-slide-generator':
        return {
          icon: <Image size={24} />,
          bgColor: 'bg-yellow-100',
          iconColor: 'text-yellow-400',
          borderColor: 'hover:border-yellow-200',
        };
      case 'iris-image-scrapper':
        return {
          icon: <Scan size={24} />,
          bgColor: 'bg-green-100',
          iconColor: 'text-green-400',
          borderColor: 'hover:border-green-200',
        };
      default:
        return {
          icon: <FileText size={24} />,
          bgColor: 'bg-gray-100',
          iconColor: 'text-gray-400',
          borderColor: 'hover:border-gray-200',
        };
    }
  };

  const { icon, bgColor, iconColor, borderColor } = getIconAndColor();

  return (
    <div 
      className={cn(
        "tool-card group cursor-pointer", 
        borderColor,
        className
      )}
    >
      <div className={cn("tool-icon", bgColor, iconColor)}>
        {icon}
      </div>
      <h3 className="tool-title">{title}</h3>
      <p className="tool-description">{description}</p>
    </div>
  );
};

export default ToolCard;
