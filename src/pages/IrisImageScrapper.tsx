
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import BackButton from '@/components/BackButton';
import { Scan } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const IrisImageScrapper: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    console.log('File uploaded:', file);
  };

  const handleRunScript = async () => {
    if (!uploadedFile) {
      toast.error("Please upload a file first");
      return;
    }

    setIsProcessing(true);
    
    try {
      // In a real implementation, you would send the file to a backend API
      // For now, we'll simulate a backend call
      toast.info("Processing your file...");
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate response from Python script
      console.log("Python script executed: ImageScrapper.py");
      toast.success("File processed successfully! Python script says: \"Hello World\"");
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Error processing file. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow py-10 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <BackButton color="green" />
          </div>

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
            
            <div className="mt-6">
              <button 
                onClick={handleRunScript}
                disabled={!uploadedFile || isProcessing}
                className={`w-full py-2 px-4 rounded-md text-white font-medium
                  ${!uploadedFile || isProcessing 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-400 hover:bg-green-500'}`}
              >
                {isProcessing ? "Processing..." : "Run"}
              </button>
            </div>
            
            {uploadedFile && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h3 className="text-sm font-medium text-gray-700">Ready to process:</h3>
                <p className="text-sm text-gray-500">{uploadedFile.name}</p>
              </div>
            )}
          </div>

          <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-green-100">
            <h2 className="text-lg font-medium mb-3">About This Tool</h2>
            <p className="text-gray-600">
              The IRIS Image Scrapper tool extracts valuable data from your IRIS images. 
              When you click Run, our Python script (ImageScrapper.py) processes your file 
              and returns the results.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default IrisImageScrapper;
