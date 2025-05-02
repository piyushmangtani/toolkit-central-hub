
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';

interface TaskStatus {
  status: 'queued' | 'processing' | 'completed' | 'failed';
  position: number;
  tool_type: string;
  result: any;
  email: string;
  timestamp: string;
}

const QueueStatus: React.FC = () => {
  const { authenticated, email } = useAuth();
  
  // Fetch user tasks
  const { data: tasks, isLoading, error, refetch } = useQuery({
    queryKey: ['user-tasks'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/tasks', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      return response.json();
    },
    enabled: authenticated,
    refetchInterval: 5000 // Refetch every 5 seconds
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'queued':
        return <Badge className="bg-yellow-500">In Queue</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500">Processing</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };
  
  const formatToolType = (toolType: string) => {
    switch (toolType) {
      case 'iris':
        return 'IRIS Image Scrapper';
      case 'case-retagging':
        return 'Case Retagging';
      case 'insight-archiving':
        return 'Insight Archiving';
      case 'logo-slide-generator':
        return 'Logo Slide Generator';
      default:
        return toolType;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Task Queue Status</h1>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border">
            {isLoading ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">Loading tasks...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-red-500">Error loading tasks: {(error as Error).message}</p>
              </div>
            ) : !tasks || Object.keys(tasks).length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No tasks found. Start using tools to create tasks!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task ID</TableHead>
                      <TableHead>Tool</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Submitted At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(tasks)
                      .sort((a, b) => {
                        // Sort by timestamp (newest first)
                        const dateA = new Date(a[1].timestamp);
                        const dateB = new Date(b[1].timestamp);
                        return dateB.getTime() - dateA.getTime();
                      })
                      .map(([taskId, task]: [string, TaskStatus]) => (
                        <TableRow key={taskId}>
                          <TableCell className="font-medium">{taskId}</TableCell>
                          <TableCell>{formatToolType(task.tool_type)}</TableCell>
                          <TableCell>{getStatusBadge(task.status)}</TableCell>
                          <TableCell>
                            {task.status === 'queued' 
                              ? `Position ${task.position} in queue` 
                              : task.status === 'processing' 
                                ? 'Currently processing' 
                                : '-'}
                          </TableCell>
                          <TableCell>{task.timestamp}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QueueStatus;
