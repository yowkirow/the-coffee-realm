import React from 'react'
import Button from './Button'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo)
        this.setState({ errorInfo })
    }

    handleReload = () => {
        // Clear local storage if it's likely a bad auth state causing the crash
        if (confirm("Do you want to clear cache and reload? (Recommended)")) {
            localStorage.clear()
        }
        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-4 text-center">
                    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full border border-red-100">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong 😵</h1>
                        <p className="text-gray-600 mb-6">
                            The Coffee Realm encountered an unexpected error.
                        </p>

                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-left text-xs font-mono overflow-auto max-h-48 mb-6">
                            {this.state.error && this.state.error.toString()}
                            <br />
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </div>

                        <Button
                            onClick={this.handleReload}
                            className="w-full bg-red-600 hover:bg-red-700 text-white"
                        >
                            Reload Application
                        </Button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
