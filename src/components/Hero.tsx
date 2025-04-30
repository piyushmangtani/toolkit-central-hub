
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-100 to-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
          <div className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-500 mb-2">
            Professional Productivity Kit
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-blue-500">
            PPK Toolkit
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-[700px]">
            A powerful suite of tools designed to streamline your workflow and boost productivity.
          </p>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-pink-200 rounded-full opacity-20 blur-3xl"></div>
    </section>
  );
};

export default Hero;
