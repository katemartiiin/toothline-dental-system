import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

interface UserData {
  token: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  token: string | null;
  userRole: string | null;
  userName: string | null;
  userEmail: string | null;
  login: (userData: UserData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {

  const defaultUserData: UserData = {
    token: '',
    name: '',
    email: '',
    role: ''
  }

  const [currentUserData, setCurrentUserData] = useState<UserData>(defaultUserData);

  const [token, setToken] = useState<string | null>(
    localStorage.getItem('authToken')
  );

  const [userRole, setUserRole] = useState<string | null>(
    localStorage.getItem('userRole')
  );

  const [userName, setUserName] = useState<string | null>(
    localStorage.getItem('userName')
  );

  const [userEmail, setUserEmail] = useState<string | null>(
    localStorage.getItem('userEmail')
  );

  const login = (userData: UserData) => {
    setToken(userData.token);
    setUserName(userData.name);
    setUserEmail(userData.email);
    setUserRole(userData.role);
    setCurrentUserData(userData);
    
    localStorage.setItem('authToken', userData.token);
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userRole', userData.role);
  };

  const logout = () => {
    setToken(null);
    setUserName(null);
    setUserEmail(null);
    setUserRole(null);
    setCurrentUserData(defaultUserData);
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ token, userRole, userName, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
