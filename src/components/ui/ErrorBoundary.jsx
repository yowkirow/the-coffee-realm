import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-6 text-center font-sans">
                    <h1 className="text-3xl font-bold text-red-600 mb-2">Something went wrong</h1>
                    <p className="text-gray-600 mb-6">The Coffee Realm encountered an unexpected error.</p>

                    <div className="bg-white p-4 rounded-xl shadow-lg border border-red-100 max-w-2xl w-full text-left overflow-auto max-h-[60vh]">
                        <p className="font-mono text-sm text-red-500 font-bold mb-2">{this.state.error && this.state.error.toString()}</p>
                        <pre className="font-mono text-xs text-gray-500 whitespace-pre-wrap">
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-8 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
                    >
                        Reload Application
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
