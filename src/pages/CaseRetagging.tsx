
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import BackButton from '@/components/BackButton';
import QueuedTaskStatus from '@/components/QueuedTaskStatus';
import { FileText } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const CaseRetagging: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setTaskId(null);
    console.log('File uploaded:', file);
  };

  const handleRunScript = async () => {
    if (!uploadedFile) {
      toast.error("Please upload a file first");
      return;
    }

    setIsProcessing(true);
    setTaskId(null);
    
    try {
      toast.info("Submitting your request to the queue...");
      
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('toolType', 'case-retagging');
      
      // Send the file to the Python backend
      const response = await fetch('http://localhost:5000/api/process', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Task submitted to queue:", data);
      
      setTaskId(data.task_id);
      toast.success(`Request added to queue at position ${data.position}`);
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Error submitting request. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-6">
            <BackButton color="red" />
          </div>

          <div className="mb-6 flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-full">
              <FileText className="text-red-400" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Case Retagging</h1>
          </div>
          
          <div className="flex gap-6">
            {/* About This Tool Section - LEFT */}
            <div className="w-1/2 bg-white rounded-xl shadow-sm p-5 border border-red-100">
              <h2 className="text-lg font-medium mb-3">About This Tool</h2>
              <p className="text-gray-600">
                The Case Retagging tool helps you organize and tag case files efficiently.
                Upload your Excel file and our system will process the data, applying smart retagging algorithms.
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h3 className="text-sm font-medium text-gray-700">How to use:</h3>
                <ol className="list-decimal list-inside mt-2 text-sm text-gray-600 space-y-1">
                  <li>Upload an Excel file (XLSX, XLS, or CSV)</li>
                  <li>Click the "Run" button</li>
                  <li>Your request will be added to the queue</li>
                  <li>Wait for the Python script to process your file</li>
                  <li>View the results displayed below</li>
                </ol>
              </div>
            </div>
            
            {/* File Upload Section - RIGHT */}
            <div className="w-1/2 bg-white rounded-xl shadow-sm p-5 border border-red-100">
              <FileUpload 
                title="Case Retagging Tool" 
                buttonColor="red"
                acceptedFileTypes=".xlsx,.xls,.csv"
                onFileUpload={handleFileUpload}
                onRunClick={handleRunScript}
                isProcessing={isProcessing}
              />
              
              {uploadedFile && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h3 className="text-sm font-medium text-gray-700">Ready to process:</h3>
                  <p className="text-sm text-gray-500">{uploadedFile.name}</p>
                </div>
              )}

              <QueuedTaskStatus taskId={taskId} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CaseRetagging;
