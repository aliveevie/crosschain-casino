import React, { Component, ErrorInfo, ReactNode } from "react";
import { emitNexusEvent } from "../utils/nexusHelpers";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class NexusErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Nexus SDK Error:', error, errorInfo);
    
    // Emit error event for tracking
    emitNexusEvent('TRANSACTION_FAILED', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 bg-red-500/20 border border-red-500/50 rounded-lg">
          <h2 className="text-red-400 font-bold text-lg mb-2">
            ⚠️ Nexus SDK Error
          </h2>
          <p className="text-red-300 mb-4">
            An error occurred while using the Nexus SDK. Please refresh the page and try again.
          </p>
          <details className="text-sm text-gray-400">
            <summary className="cursor-pointer">Error Details</summary>
            <pre className="mt-2 p-2 bg-gray-800 rounded text-xs overflow-auto">
              {this.state.error?.message}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
