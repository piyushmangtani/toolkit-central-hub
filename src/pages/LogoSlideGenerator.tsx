
import React, { useState, KeyboardEvent } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import QueuedTaskStatus from '@/components/QueuedTaskStatus';
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
  const [taskId, setTaskId] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addCompanies(inputValue.trim());
    }
  };

  const addCompanies = (input: string) => {
    // Check if input contains commas or semicolons
    if (input.includes(',') || input.includes(';')) {
      // Split by comma or semicolon and filter out empty entries
      const companiesArray = input
        .split(/[,;]/)
        .map(name => name.trim())
        .filter(name => name !== '');
      
      // Add all valid companies from the array
      const newCompanies = [...companyNames];
      let addedCount = 0;
      
      companiesArray.forEach(company => {
        if (!newCompanies.includes(company)) {
          newCompanies.push(company);
          addedCount++;
        }
      });
      
      if (addedCount > 0) {
        setCompanyNames(newCompanies);
        if (addedCount > 1) {
          toast.success(`Added ${addedCount} companies`);
        }
      }
    } else {
      // Single company name case
      if (!companyNames.includes(input)) {
        setCompanyNames([...companyNames, input]);
      }
    }
    
    // Clear input field after processing
    setInputValue('');
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
    setTaskId(null);
    
    try {
      toast.info("Submitting your request to the queue...");
      
      // Create FormData to send company names
      const formData = new FormData();
      formData.append('companyNames', JSON.stringify(companyNames));
      formData.append('toolType', 'logo-slide-generator');
      
      // Send the data to the Python backend
      const response = await fetch('api/process-companies', {
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
      console.error("Error processing request:", error);
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
                The Logo Slide Generator tool helps you fetch company logos and create professional logo slides for your presentations.
                Enter company names and our system will generate formatted slides with their logos.
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h3 className="text-sm font-medium text-gray-700">How to use:</h3>
                <ol className="list-decimal list-inside mt-2 text-sm text-gray-600 space-y-1">
                  <li>Type a company name in the search field</li>
                  <li>Press Enter to add it to the list</li>
                  <li>Add multiple company names at once by separating them with commas or semicolons</li>
                  <li>Click the "Generate Slides" button</li>
                  <li>Your request will be added to the queue</li>
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
                      placeholder="Type company names (separate multiple with comma or semicolon)..."
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
                <div className="mt-2 text-sm text-gray-500">
                  {companyNames.length > 0 && (
                    <span>Ready to generate slides for {companyNames.length} companies</span>
                  )}
                </div>
              </div>
              
              {/* Task Status */}
              <QueuedTaskStatus taskId={taskId} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LogoSlideGenerator;
