import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      // Find the main scrollable container
      const mainElement = document.querySelector('main');
      
      if (mainElement) {
        // Smooth scroll the main container to top
        mainElement.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }
      
      // Also smooth scroll the window/document (backup)
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    };

    // Execute immediately
    scrollToTop();
    
    // Also execute with a small delay to handle any route changes
    const timeoutId = setTimeout(scrollToTop, 100);
    
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
