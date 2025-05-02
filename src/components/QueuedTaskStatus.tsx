
import React, { useEffect, useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';

interface QueuedTaskStatusProps {
  taskId: string | null;
}

interface TaskStatus {
  status: 'queued' | 'processing' | 'completed' | 'failed';
  position: number;
  result: any;
}

const QueuedTaskStatus: React.FC<QueuedTaskStatusProps> = ({ taskId }) => {
  const [progress, setProgress] = useState(0);
  
  const { 
    data: taskStatus,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['task-status', taskId],
    queryFn: async () => {
      if (!taskId) return null;
      
      // Use relative URL instead of absolute URL with localhost
      const response = await fetch(`/api/task/${taskId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch task status');
      }
      
      return response.json() as Promise<TaskStatus>;
    },
    enabled: !!taskId,
    // Fix TypeScript error by correctly accessing data property
    refetchInterval: (data) => {
      // Stop polling if task is completed or failed
      if (data?.status === 'completed' || data?.status === 'failed') {
        return false;
      }
      return 2000; // Poll every 2 seconds
    }
  });
  
  useEffect(() => {
    if (taskStatus) {
      if (taskStatus.status === 'processing') {
        // Simulate processing progress
        setProgress(50);
        
        const interval = setInterval(() => {
          setProgress(prev => {
            const newProgress = prev + 5;
            if (newProgress >= 95) {
              clearInterval(interval);
              return 95;
            }
            return newProgress;
          });
        }, 1000);
        
        return () => clearInterval(interval);
      } else if (taskStatus.status === 'completed') {
        setProgress(100);
      }
    }
  }, [taskStatus?.status]);
  
  if (!taskId) return null;
  
  if (isLoading) {
    return (
      <Alert className="bg-gray-50 border-gray-200 mt-4">
        <AlertTitle>Loading task status...</AlertTitle>
      </Alert>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {(error as Error).message}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!taskStatus) return null;
  
  if (taskStatus.status === 'queued') {
    return (
      <Alert className="bg-yellow-50 border-yellow-200 mt-4">
        <AlertTitle>In Queue</AlertTitle>
        <AlertDescription>
          Your task is in position {taskStatus.position} in the queue. Please wait...
        </AlertDescription>
      </Alert>
    );
  }
  
  if (taskStatus.status === 'processing') {
    return (
      <div className="mt-4">
        <Alert className="bg-blue-50 border-blue-200 mb-2">
          <AlertTitle>Processing</AlertTitle>
          <AlertDescription>
            Your request is being processed...
          </AlertDescription>
        </Alert>
        <Progress value={progress} className="h-2" />
      </div>
    );
  }
  
  if (taskStatus.status === 'completed') {
    return (
      <Alert className="bg-green-50 border-green-200 mt-4">
        <AlertTitle>Processing Result</AlertTitle>
        <AlertDescription>
          {taskStatus.result?.message || 'Task completed successfully'}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (taskStatus.status === 'failed') {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {taskStatus.result?.error || 'An error occurred during processing'}
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};

export default QueuedTaskStatus;
