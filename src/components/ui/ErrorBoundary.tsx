import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8 font-mono">
          <div className="max-w-2xl w-full bg-slate-900 border border-red-500/30 rounded-xl p-8 shadow-2xl">
            <h1 className="text-2xl font-bold text-red-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">⚠️</span> System Failure
            </h1>
            <p className="text-slate-300 mb-6">ZenType encountered an unexpected anomaly. The error has been contained.</p>
            
            <div className="bg-black/50 p-4 rounded-lg overflow-x-auto text-xs text-red-300/80 mb-8 border border-white/5">
              <code>{this.state.error?.message || 'Unknown Error'}</code>
            </div>

            <button 
              onClick={() => {
                // Hard reset
                localStorage.removeItem('zentype_settings_v5');
                window.location.reload();
              }}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors w-full"
            >
              Reset Settings & Reload System
            </button>
            <p className="text-center text-xs opacity-50 mt-4">Note: Your typing stats are safe. Only session settings will reset.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
