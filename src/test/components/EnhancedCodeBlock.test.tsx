import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '../test-utils';
import EnhancedCodeBlock from '../../components/common/EnhancedCodeBlock';

describe('EnhancedCodeBlock', () => {
  beforeEach(() => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders code content', () => {
    render(<EnhancedCodeBlock code="echo hello" />);
    expect(screen.getByText('echo hello')).toBeInTheDocument();
  });

  it('displays default language label when no language provided', () => {
    render(<EnhancedCodeBlock code="test" />);
    expect(screen.getByText('Command')).toBeInTheDocument();
  });

  it('displays provided language label', () => {
    render(<EnhancedCodeBlock code="print('hi')" language="Python" />);
    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  it('copies code to clipboard on button click', async () => {
    render(<EnhancedCodeBlock code="copy this" />);
    
    const copyButton = screen.getByRole('button');
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('copy this');
  });

  it('shows "Copied!" feedback after clicking copy', async () => {
    render(<EnhancedCodeBlock code="test" />);
    
    const copyButton = screen.getByRole('button');
    fireEvent.click(copyButton);

    // State updates synchronously after click — "Copied!" should appear
    expect(await screen.findByText('Copied!')).toBeInTheDocument();
  });
});
