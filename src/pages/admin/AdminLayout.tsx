import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Login from './Login';

const AdminLayout: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Check session storage on mount
  useEffect(() => {
    const sessionToken = sessionStorage.getItem('admin_token');
    if (sessionToken) {
      setToken(sessionToken);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (newToken: string) => {
    sessionStorage.setItem('admin_token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
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
