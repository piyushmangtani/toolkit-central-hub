import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  authenticated: boolean;
  email: string | null;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  email: null,
  login: async () => {},
  logout: async () => {},
  loading: true
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Use relative URL instead of absolute URL with localhost
        const response = await fetch('/api/auth/check', {
          method: 'GET',
          credentials: 'include'  // Important for cookies/session
        });
        
        if (response.ok) {
          const data = await response.json();
          setAuthenticated(true);
          setEmail(data.email);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email: string): Promise<void> => {
    // Use relative URL instead of absolute URL with localhost
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
      credentials: 'include'  // Important for cookies/session
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    const data = await response.json();
    setAuthenticated(true);
    setEmail(data.email);
  };
  
  const logout = async (): Promise<void> => {
    // Use relative URL instead of absolute URL with localhost
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'  // Important for cookies/session
    });
    
    setAuthenticated(false);
    setEmail(null);
  };
  
  const value = {
    authenticated,
    email,
    login,
    logout,
    loading
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);