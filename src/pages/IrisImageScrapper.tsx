
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import { Scan } from 'lucide-react';

const IrisImageScrapper: React.FC = () => {
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
          <div className="mb-8 flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-full">
              <Scan className="text-green-400" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">IRIS Image Scrapper</h1>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-green-100">
            <FileUpload 
              title="IRIS Image Scrapper Tool" 
              buttonColor="green"
              onFileUpload={handleFileUpload} 
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default IrisImageScrapper;
