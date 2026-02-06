import { describe, it, expect } from 'vitest';
import { render, screen } from '../test-utils';
import LoadingSpinner from '../../components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render without crashing', () => {
    render(<LoadingSpinner />);
    // The spinner should be in the document with role="status"
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should be accessible with proper aria attributes', () => {
    render(<LoadingSpinner />);
    
    // Check for loading indicator role or aria-label
    const spinner = document.querySelector('[role="status"]') || 
                    document.querySelector('[aria-label]') ||
                    document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});
