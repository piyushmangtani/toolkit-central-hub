
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import BackButton from '@/components/BackButton';
import { Image } from 'lucide-react';

const LogoSlideGenerator: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    console.log('File uploaded:', file);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow py-10 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <BackButton color="yellow" />
          </div>

          <div className="mb-8 flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Image className="text-yellow-400" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Logo Slide Generator</h1>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-yellow-100">
            <FileUpload 
              title="Logo Slide Generator Tool" 
              buttonColor="yellow"
              onFileUpload={handleFileUpload} 
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LogoSlideGenerator;
