
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import { FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CaseRetagging: React.FC = () => {
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
          <Link to="/" className="inline-block mb-6">
            <Button variant="ghost" className="gap-2 text-gray-500 hover:text-red-400">
              <ArrowLeft size={18} />
              <span>Back</span>
            </Button>
          </Link>

          <div className="mb-8 flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-full">
              <FileText className="text-red-400" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Case Retagging</h1>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-red-100">
            <FileUpload 
              title="Case Retagging Tool" 
              buttonColor="red"
              onFileUpload={handleFileUpload} 
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CaseRetagging;
