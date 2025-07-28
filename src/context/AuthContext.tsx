import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

interface UserData {
  token: string;
  name: string;
  role: string;
}
interface AuthContextType {
  token: string | null;
  userRole: string | null;
  userName: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {

  const defaultUserData = {
    token: '',
    name: '',
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

  const login = (userData: UserData | any) => {
    setToken(userData.token);
    setCurrentUserData(userData);
    localStorage.setItem('authToken', userData.token);
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userRole', userData.role);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ token, userRole, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
