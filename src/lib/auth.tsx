import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthState, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 认证状态管理 Context
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    loading: true,
  });

  // 检查本地存储中的认证状态
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem('auth_token');
        const timestamp = localStorage.getItem('auth_timestamp');
        
        if (token && timestamp) {
          const tokenAge = Date.now() - parseInt(timestamp);
          const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
          
          if (tokenAge < thirtyDaysInMs) {
            setAuthState({
              isAuthenticated: true,
              token,
              loading: false,
            });
            return;
          } else {
            // Token 过期，清除本地存储
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_timestamp');
          }
        }
        
        setAuthState({
          isAuthenticated: false,
          token: null,
          loading: false,
        });
      } catch (error) {
        console.error('检查认证状态失败:', error);
        setAuthState({
          isAuthenticated: false,
          token: null,
          loading: false,
        });
      }
    };

    checkAuthStatus();
  }, []);

  const login = (token: string) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_timestamp', Date.now().toString());
    setAuthState({
      isAuthenticated: true,
      token,
      loading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_timestamp');
    setAuthState({
      isAuthenticated: false,
      token: null,
      loading: false,
    });
  };

  const checkAuth = (): boolean => {
    return authState.isAuthenticated;
  };

  const value: AuthContextType = {
    authState,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 使用认证状态的 Hook
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用');
  }
  return context;
}