import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Login from './Login';
import { 
  clearSession, 
  createSession, 
  extendSession, 
  getSessionHash,
  validateSession 
} from '../../utils/sessionManager';

const AdminLayout: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Check session on mount
  useEffect(() => {
    if (validateSession()) {
      const sessionHash = getSessionHash();
      setToken(sessionHash);
      setIsAuthenticated(true);
    }
  }, []);

  // Extend session on user activity
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const handleActivity = () => extendSession();
    window.addEventListener('click', handleActivity);
    window.addEventListener('keypress', handleActivity);
    
    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keypress', handleActivity);
    };
  }, [isAuthenticated]);

  const handleLogin = async (password: string) => {
    // Note: password is already verified by Login component via checkAuth
    // We just create a session here
    const sessionHash = await createSession();
    setToken(sessionHash);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    clearSession();
    setIsAuthenticated(false);
    setToken(null);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans">
        {/* Pass extra context if needed, currently just rendering children */}
        <Outlet context={{ token, handleLogout }} />
    </div>
  );
};

export default AdminLayout;
