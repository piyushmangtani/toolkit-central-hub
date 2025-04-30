
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ToolGrid from '@/components/ToolGrid';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <Hero />
      <main className="flex-grow">
        <ToolGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
