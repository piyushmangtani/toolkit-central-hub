
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, Clock, Loader2 } from 'lucide-react';
import { Progress } from './ui/progress';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { toast } from './ui/sonner';

interface TaskStatus {
  status: string;
  position: number;
  result: any;
  tool_type: string;
}

interface QueuedTaskStatusProps {
  taskId: string | null;
}

const QueuedTaskStatus: React.FC<QueuedTaskStatusProps> = ({ taskId }) => {
  const fetchTaskStatus = async (taskId: string): Promise<TaskStatus> => {
    const response = await fetch(`/api/task/${taskId}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch task status');
    }
    return response.json();
  };

  const { 
    data, 
    error, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['taskStatus', taskId],
    queryFn: () => fetchTaskStatus(taskId!),
    enabled: !!taskId,
    refetchInterval: taskId ? 3000 : false,
  });

  if (!taskId) return null;
  
  if (isError) {
    return (
      <Alert className="mt-4 border-red-200 bg-red-50">
        <AlertTitle className="text-red-800">Error checking task status</AlertTitle>
        <AlertDescription className="text-red-600">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
          <span className="text-sm text-gray-600">Checking task status...</span>
        </div>
      </div>
    );
  }

  // Handle different task states
  if (data.status === 'queued') {
    return (
      <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-700">Task is queued</span>
        </div>
        <p className="text-sm text-yellow-600 mb-2">Your task is at position {data.position} in the queue.</p>
        <Progress className="h-2 bg-yellow-100" value={25} />
      </div>
    );
  }

  if (data.status === 'processing') {
    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-center gap-2 mb-2">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <span className="text-sm font-medium text-blue-700">Task is processing</span>
        </div>
        <p className="text-sm text-blue-600 mb-2">Please wait while we process your request.</p>
        <Progress className="h-2 bg-blue-100" value={75} />
      </div>
    );
  }

  if (data.status === 'completed') {
    // Show success message
    return (
      <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100">
        <div className="flex items-center gap-2 mb-2">
          <Check className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">Task completed successfully</span>
        </div>
        
        {data.result && (
          <div className="mt-2">
            <h4 className="text-sm font-medium text-green-800">Results:</h4>
            
            {data.tool_type === 'logo-slide-generator' && (
              <div className="mt-2 text-sm">
                <p>Total Companies: {data.result.total_companies}</p>
                <p>Successful Logos: {data.result.successful_logos?.length || 0}</p>
                <p>Failed Logos: {data.result.failed_logos?.length || 0}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (data.status === 'failed') {
    return (
      <Alert className="mt-4 border-red-200 bg-red-50">
        <AlertTitle className="text-red-800">Task Failed</AlertTitle>
        <AlertDescription className="text-red-600">
          {data.result?.error || 'An unknown error occurred while processing your task.'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
      <p className="text-sm text-gray-600">Task status: {data.status}</p>
    </div>
  );
};

export default QueuedTaskStatus;
