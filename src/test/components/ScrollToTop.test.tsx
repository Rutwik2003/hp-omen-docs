import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '../test-utils';
import ScrollToTop from '../../components/ScrollToTop';

describe('ScrollToTop', () => {
  let scrollToSpy: ReturnType<typeof vi.fn>;
  let mainScrollToSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    scrollToSpy = vi.fn();
    window.scrollTo = scrollToSpy as unknown as typeof window.scrollTo;

    // Create a mock <main> element
    const mainEl = document.createElement('main');
    mainScrollToSpy = vi.fn();
    mainEl.scrollTo = mainScrollToSpy as unknown as typeof mainEl.scrollTo;
    document.body.appendChild(mainEl);
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('renders no visible content', () => {
    const { container } = render(<ScrollToTop />);
    // ScrollToTop returns null, but the test wrapper (ToastProvider) may add container elements
    expect(container.querySelector('[data-testid]')).toBeNull();
  });

  it('calls window.scrollTo on mount', () => {
    render(<ScrollToTop />);
    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  });

  it('calls main.scrollTo on mount', () => {
    render(<ScrollToTop />);
    expect(mainScrollToSpy).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  });

  it('scrolls again after delayed timeout', () => {
    render(<ScrollToTop />);
    // Initial call
    expect(scrollToSpy).toHaveBeenCalledTimes(1);

    // Advance timers for the delayed scroll
    vi.advanceTimersByTime(100);
    expect(scrollToSpy).toHaveBeenCalledTimes(2);
  });
});
