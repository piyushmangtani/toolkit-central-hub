
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
      case 'red': return 'hover:text-red-400';
      case 'blue': return 'hover:text-blue-400';
      case 'yellow': return 'hover:text-yellow-400';
      case 'green': return 'hover:text-green-400';
      default: return 'hover:text-blue-400';
    }
  };

  return (
    <Button 
      variant="ghost" 
      className={`gap-2 text-gray-500 ${getHoverColor()} ${className}`} 
      onClick={handleGoBack}
    >
      <ArrowLeft size={18} />
      <span>Back</span>
    </Button>
  );
};

export default BackButton;
