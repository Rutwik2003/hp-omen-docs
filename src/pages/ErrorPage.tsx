import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, RefreshCw, AlertTriangle, WifiOff, ServerCrash, FileQuestion } from 'lucide-react';

interface ErrorPageProps {
  code?: number;
  title?: string;
  message?: string;
}

// Gaming-themed error messages
const errorMessages: Record<number, { title: string; message: string; icon: React.ReactNode; tip: string }> = {
  404: {
    title: "Page Not Found",
    message: "Looks like this page rolled a natural 1 and critically failed to exist.",
    icon: <FileQuestion className="w-12 h-12 sm:w-16 sm:h-16 text-orange-500" />,
    tip: "Check the URL or head back to the docs."
  },
  500: {
    title: "Server Error",
    message: "Our server encountered an unexpected boss fight and needs to respawn.",
    icon: <ServerCrash className="w-12 h-12 sm:w-16 sm:h-16 text-red-500" />,
    tip: "Try refreshing the page or come back later."
  },
  502: {
    title: "Bad Gateway",
    message: "The gateway guardian is blocking our path. We're working on a bypass.",
    icon: <WifiOff className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500" />,
    tip: "This usually fixes itself. Try again in a moment."
  },
  503: {
    title: "Service Unavailable",
    message: "Our servers are currently in maintenance mode, buffing their stats.",
    icon: <ServerCrash className="w-12 h-12 sm:w-16 sm:h-16 text-orange-500" />,
    tip: "We'll be back online shortly!"
  },
  504: {
    title: "Gateway Timeout",
    message: "The connection timed out. Even our fastest speedrunners couldn't make it.",
    icon: <WifiOff className="w-12 h-12 sm:w-16 sm:h-16 text-purple-500" />,
    tip: "Your connection might be slow. Try refreshing."
  }
};

const defaultError = {
  title: "Something Went Wrong",
  message: "An unexpected error occurred. Even the best players encounter bugs.",
  icon: <AlertTriangle className="w-12 h-12 sm:w-16 sm:h-16 text-orange-500" />,
  tip: "Try refreshing the page."
};

const ErrorPage: React.FC<ErrorPageProps> = ({ code = 404, title, message }) => {
  const location = useLocation();
  const errorInfo = errorMessages[code] || defaultError;
  
  const displayTitle = title || errorInfo.title;
  const displayMessage = message || errorInfo.message;
  
  // Extract the wrong path for display
  const requestedPath = location.pathname;

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center"
      >
        {/* Error Code with Glitch Effect */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="relative mb-4 sm:mb-6"
        >
          <span className="text-[80px] sm:text-[120px] md:text-[150px] font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 leading-none select-none">
            {code}
          </span>
          {/* Glitch shadow effect */}
          <span 
            className="absolute inset-0 text-[80px] sm:text-[120px] md:text-[150px] font-black text-orange-500/20 leading-none select-none blur-sm" 
            style={{ transform: 'translate(4px, 4px)' }}
            aria-hidden="true"
          >
            {code}
          </span>
        </motion.div>

        {/* Icon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-4 sm:mb-6"
        >
          <div className="p-3 sm:p-4 bg-black/50 border border-orange-500/30 rounded-xl sm:rounded-2xl">
            {errorInfo.icon}
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-white"
        >
          {displayTitle}
        </motion.h1>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-base sm:text-lg text-gray-400 mb-3 sm:mb-4 px-4"
        >
          {displayMessage}
        </motion.p>

        {/* Tip */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-gray-500 mb-6 sm:mb-8"
        >
          💡 {errorInfo.tip}
        </motion.p>

        {/* Path info for 404 - Shows the invalid URL */}
        {code === 404 && requestedPath !== '/' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mb-6 sm:mb-8 p-3 bg-black/30 border border-gray-800 rounded-lg mx-4 sm:mx-0"
          >
            <p className="text-xs text-gray-500 mb-1">We couldn't find:</p>
            <code className="text-sm sm:text-base text-orange-400 font-mono break-all">
              {requestedPath}
            </code>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0"
        >
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:border-orange-500 hover:text-orange-400 transition-all duration-200 group text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Back to Home
          </Link>

          {(code >= 500) && (
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:border-orange-500 hover:text-orange-400 transition-all duration-200 group text-sm sm:text-base"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Try Again
            </button>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 sm:mt-12 text-xs sm:text-sm text-gray-600"
        >
          <p>HP OMEN Community Documentation</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Export specific error page components for convenience
export const NotFoundPage = () => <ErrorPage code={404} />;
export const ServerErrorPage = () => <ErrorPage code={500} />;
export const BadGatewayPage = () => <ErrorPage code={502} />;
export const ServiceUnavailablePage = () => <ErrorPage code={503} />;
export const GatewayTimeoutPage = () => <ErrorPage code={504} />;

export default ErrorPage;

