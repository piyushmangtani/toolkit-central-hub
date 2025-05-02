
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, authenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if already authenticated
    if (authenticated) {
      navigate('/');
    }
  }, [authenticated, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email (must be @bain.com)
    if (!email.endsWith('@bain.com')) {
      toast.error('Only Bain.com email addresses are allowed');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(email);
      navigate('/');
      toast.success('Login successful');
    } catch (error) {
      toast.error('Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <img
              src="/lovable-uploads/caaddcdb-7615-4b2f-a022-f026fce2699a.png"
              alt="PPK Logo"
              className="w-16 h-16"
            />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-blue-500">PPK Toolkit</h1>
          <p className="mt-2 text-gray-500">
            Please sign in with your Bain email address to continue
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your.name@bain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-white"
                required
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Only users with @bain.com emails can access this application</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
