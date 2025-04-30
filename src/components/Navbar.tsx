
import React from 'react';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 bg-white border-b border-blue-100 sticky top-0 z-10">
      <div className="container max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/caaddcdb-7615-4b2f-a022-f026fce2699a.png" 
            alt="PPK Logo" 
            className="w-8 h-8"
          />
          <h1 className="text-xl font-bold tracking-tight text-blue-500">PPK Toolkit</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-sm font-medium text-gray-500 hover:text-blue-500 transition-colors">Home</a>
          <a href="#" className="text-sm font-medium text-gray-500 hover:text-blue-500 transition-colors">Support</a>
        </nav>
        
        <button className="md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
