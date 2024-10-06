import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import as a named import

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profilePicture?: string;
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

// Define the expected structure of the token
interface DecodedToken {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profilePicture?: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to decode the token and extract user info
  const decodeToken = (token: string): User | null => {
    try {
      const decoded: DecodedToken = jwtDecode<DecodedToken>(token); // Properly type the decoded token
      return {
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        email: decoded.email,
        role: decoded.role,
        profilePicture: decoded.profilePicture || '',
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Load user data from the token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = decodeToken(token);
      if (user) {
        setUser(user);
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('token', data.token); // Store the token
        const user = decodeToken(data.token);      // Decode token to get user data
        if (user) {
          setUser(user);
        }
        setLoading(false);
        return true;
      } else {
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
