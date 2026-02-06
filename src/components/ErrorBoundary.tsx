import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { captureError } from '../utils/errorReporting';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({ errorInfo });
        
        // Log to console in development
        if (import.meta.env.DEV) {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }

        // Capture error with structured logging
        captureError(error, {
            componentStack: errorInfo.componentStack ?? undefined,
            pathname: window.location.pathname,
        });
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-black flex items-center justify-center p-4">
                    <div className="max-w-lg w-full">
                        {/* Error Card */}
                        <div className="bg-zinc-900/80 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8 shadow-2xl">
                            {/* Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-8 h-8 text-red-500" />
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl font-bold text-white text-center mb-2">
                                Something went wrong
                            </h1>
                            
                            <p className="text-zinc-400 text-center mb-6">
                                We encountered an unexpected error. Don't worry, your draft data is saved locally.
                            </p>

                            {/* Error Details (Dev only) */}
                            {import.meta.env.DEV && this.state.error && (
                                <div className="mb-6 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                                    <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-2">
                                        <Bug className="w-4 h-4" />
                                        <span>Error Details (Dev Mode)</span>
                                    </div>
                                    <code className="text-xs text-zinc-300 break-all block">
                                        {this.state.error.message}
                                    </code>
                                    {this.state.errorInfo?.componentStack && (
                                        <pre className="mt-2 text-xs text-zinc-500 overflow-auto max-h-32">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    )}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={this.handleRetry}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-medium rounded-lg transition-all duration-200"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Try Again
                                </button>
                                
                                <button
                                    onClick={this.handleGoHome}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg border border-zinc-700 transition-all duration-200"
                                >
                                    <Home className="w-4 h-4" />
                                    Go Home
                                </button>
                            </div>

                            {/* Reload Option */}
                            <button
                                onClick={this.handleReload}
                                className="w-full mt-3 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                                Or reload the page
                            </button>
                        </div>

                        {/* Help Text */}
                        <p className="text-center text-zinc-600 text-sm mt-4">
                            If this problem persists, please report it on{' '}
                            <a 
                                href="https://github.com/your-repo/issues" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-teal-500 hover:text-teal-400 underline"
                            >
                                GitHub
                            </a>
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
