import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ChevronRight, AlertCircle } from 'lucide-react';
import { checkAuth } from '../../utils/adminApi';

interface LoginProps {
  onLogin: (password: string) => void | Promise<void>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // In a real app, you might use a Personal Access Token as the password
    // so you can pass it to the GitHub API functions.
    // For now, we simulate a check.
    try {
        const isValid = await checkAuth(password);
        
        if (isValid) {
            // If using GitHub API, the 'password' might actually BE the GitHub Token.
            // For local dev, it's just a gatekeeper.
            onLogin(password); 
        } else {
            setError('ACCESS DENIED: Invalid Credentials');
            setLoading(false);
        }
    } catch (e) {
        setError('Login Error: Please try again');
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-500/10 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-black/50 border border-orange-500/30 rounded-2xl flex items-center justify-center relative group">
             <img src="/HP_Omen_logo.svg" alt="Logo" className="w-10 h-10 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-white mb-2 tracking-tight">System Access</h2>
        <p className="text-center text-gray-500 mb-8 text-sm font-mono">AUTHORIZED PERSONNEL ONLY</p>

        <form onSubmit={handleSubmit} className="space-y-6" aria-label="Admin login form">
          <div className="space-y-2">
            <label htmlFor="admin-password" className="text-xs font-mono text-gray-400 ml-1">SECURITY KEY</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-orange-500 transition-colors" aria-hidden="true" />
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all font-mono"
                placeholder="••••••••••••"
                aria-describedby={error ? "login-error" : undefined}
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20"
              role="alert"
              id="login-error"
            >
              <AlertCircle className="w-4 h-4 mr-2" aria-hidden="true" />
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className={`w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-3.5 rounded-xl hover:from-orange-500 hover:to-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-orange-500 transition-all transform hover:scale-[1.02] flex items-center justify-center ${loading ? 'opacity-70 cursor-wait' : ''}`}
          >
            {loading ? (
              <span className="animate-pulse">AUTHENTICATING...</span>
            ) : (
              <>
                ENTER SYSTEM <ChevronRight className="ml-2 w-4 h-4" aria-hidden="true" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
