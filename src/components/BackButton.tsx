
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  className?: string;
  color?: 'red' | 'blue' | 'yellow' | 'green';
}

const BackButton: React.FC<BackButtonProps> = ({ className, color = 'blue' }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const getHoverColor = () => {
    switch (color) {
      case 'red': return 'hover:text-white';
      case 'blue': return 'hover:text-white';
      case 'yellow': return 'hover:text-white';
      case 'green': return 'hover:text-white';
      default: return 'hover:text-white';
    }
  };

  return (
    <Button 
      variant="ghost" 
      className={`gap-2 text-gray-500 hover:bg-black ${getHoverColor()} ${className}`} 
      onClick={handleGoBack}
    >
      <ArrowLeft size={18} />
      <span>Back</span>
    </Button>
  );
};

export default BackButton;
