
import React, { useState, KeyboardEvent } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import { Image, X, Search } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const LogoSlideGenerator: React.FC = () => {
  const [companyNames, setCompanyNames] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addCompany(inputValue.trim());
    }
  };

  const addCompany = (name: string) => {
    if (name && !companyNames.includes(name)) {
      setCompanyNames([...companyNames, name]);
      setInputValue('');
    }
  };

  const removeCompany = (nameToRemove: string) => {
    setCompanyNames(companyNames.filter(name => name !== nameToRemove));
  };

  const handleRunScript = async () => {
    if (companyNames.length === 0) {
      toast.error("Please add at least one company name");
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);
    setResult(null);
    setError(null);
    
    try {
      toast.info("Processing your request...");
      
      // Simulate processing progress
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return newProgress;
        });
      }, 500);
      
      // Create FormData to send company names
      const formData = new FormData();
      formData.append('companyNames', JSON.stringify(companyNames));
      formData.append('toolType', 'logo-slide-generator');
      
      // Send the data to the Python backend
      const response = await fetch('http://localhost:5000/api/process-companies', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      setProcessingProgress(100);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Python script executed: LogoSlideGenerator.py");
      console.log("Response:", data);
      
      setResult(data.result.message);
      toast.success(`Processing completed successfully!`);
    } catch (error) {
      console.error("Error processing request:", error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      toast.error("Error processing request. Please try again.");
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
            <BackButton color="yellow" />
          </div>

          <div className="mb-6 flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Image className="text-yellow-400" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Logo Slide Generator</h1>
          </div>
          
          <div className="flex gap-6">
            {/* About This Tool Section - LEFT */}
            <div className="w-1/2 bg-white rounded-xl shadow-sm p-5 border border-yellow-100">
              <h2 className="text-lg font-medium mb-3">About This Tool</h2>
              <p className="text-gray-600">
                The Logo Slide Generator tool helps you create professional logo slides for your presentations.
                Enter company names and our system will generate formatted slides with their logos.
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h3 className="text-sm font-medium text-gray-700">How to use:</h3>
                <ol className="list-decimal list-inside mt-2 text-sm text-gray-600 space-y-1">
                  <li>Type a company name in the search field</li>
                  <li>Press Enter to add it to the list</li>
                  <li>Add multiple company names as needed</li>
                  <li>Click the "Generate Slides" button</li>
                  <li>Wait for the Python script to process your request</li>
                  <li>View the results displayed below</li>
                </ol>
              </div>
            </div>
            
            {/* Company Search Section - RIGHT */}
            <div className="w-1/2 bg-white rounded-xl shadow-sm p-5 border border-yellow-100">
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-3">Logo Slide Generator Tool</h2>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Type company name and press Enter..."
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
              
              {/* Company Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {companyNames.map(company => (
                  <div 
                    key={company}
                    className="inline-flex items-center bg-yellow-50 text-yellow-700 rounded-full px-3 py-1 text-sm"
                  >
                    {company}
                    <button 
                      onClick={() => removeCompany(company)}
                      className="ml-1.5 p-0.5 rounded-full hover:bg-yellow-200"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Generate Button */}
              <div className="mt-6">
                <Button
                  onClick={handleRunScript}
                  disabled={isProcessing || companyNames.length === 0}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  {isProcessing ? 'Processing...' : 'Generate Slides'}
                </Button>
              </div>
              
              {/* Progress Bar */}
              {isProcessing && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Processing: {processingProgress}%</p>
                  <Progress value={processingProgress} className="h-2" />
                </div>
              )}

              {result && (
                <div className="mt-4">
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertTitle>Processing Result</AlertTitle>
                    <AlertDescription>
                      {result}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
              
              {error && (
                <div className="mt-4">
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {error}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LogoSlideGenerator;
