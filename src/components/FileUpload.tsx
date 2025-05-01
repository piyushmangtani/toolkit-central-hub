
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { FileUp, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

interface FileUploadProps {
  title: string;
  acceptedFileTypes?: string;
  maxFileSizeMB?: number;
  buttonColor?: string;
  onFileUpload: (file: File) => void;
  onRunClick?: () => void;
  isProcessing?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  title,
  acceptedFileTypes = ".xlsx,.xls,.csv",
  maxFileSizeMB = 10,
  buttonColor = "blue",
  onFileUpload,
  onRunClick,
  isProcessing = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateFile = (file: File): boolean => {
    // Validate file type
    const fileType = file.name.toLowerCase().split('.').pop();
    const validTypes = acceptedFileTypes
      .split(',')
      .map(type => type.replace('.', '').toLowerCase());
    
    if (!validTypes.includes(fileType || '')) {
      toast.error(`Invalid file type. Please upload ${acceptedFileTypes} files only.`);
      return false;
    }

    // Validate file size
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      toast.error(`File size exceeds ${maxFileSizeMB}MB limit.`);
      return false;
    }

    return true;
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files.length) {
      const droppedFile = e.dataTransfer.files[0];
      
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        onFileUpload(droppedFile);
        toast.success(`File "${droppedFile.name}" uploaded successfully`);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        onFileUpload(selectedFile);
        toast.success(`File "${selectedFile.name}" uploaded successfully`);
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getButtonColorClasses = () => {
    switch(buttonColor) {
      case 'red': return 'bg-red-400 hover:bg-red-500';
      case 'green': return 'bg-green-400 hover:bg-green-500';
      case 'yellow': return 'bg-yellow-400 hover:bg-yellow-500';
      case 'pink': return 'bg-pink-400 hover:bg-pink-500';
      default: return 'bg-blue-400 hover:bg-blue-500';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-500 mb-6">
        Hey There! Please upload the relevant files so that we can process and share back the report with you.
      </p>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept={acceptedFileTypes}
        className="hidden"
      />

      {!file ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-blue-300",
            "flex flex-col items-center justify-center h-48"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleFileDrop}
          onClick={triggerFileInput}
        >
          <UploadCloud className="w-12 h-12 text-gray-400 mb-3" />
          <p className="text-gray-500 mb-2">
            Drag & drop your file here, or <span className="text-blue-500 font-medium">browse</span>
          </p>
          <p className="text-xs text-gray-400">
            Accepted formats: {acceptedFileTypes} (Max size: {maxFileSizeMB}MB)
          </p>
        </div>
      ) : (
        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileUp className="text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="font-medium">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRemoveFile}
            >
              Remove
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6">
        <Button 
          className={cn("w-full", getButtonColorClasses())}
          disabled={!file || isProcessing}
          onClick={onRunClick}
        >
          {isProcessing ? "Processing..." : "Run"}
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
