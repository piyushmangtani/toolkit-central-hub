
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <img 
              src="/lovable-uploads/caaddcdb-7615-4b2f-a022-f026fce2699a.png" 
              alt="PPK Logo" 
              className="w-6 h-6"
            />
            <span className="text-sm font-medium text-gray-500">PPK Toolkit</span>
          </div>
          <div className="text-sm text-gray-500">
            © 2025 Bain and Company, all rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
