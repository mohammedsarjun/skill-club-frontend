"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import ErrorPlaceholder from "./ErrorPlaceholder";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  title?: string;
  message?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4 border border-red-100 rounded-lg bg-red-50/30">
          <ErrorPlaceholder
            title={this.props.title || "Component Error"}
            message={this.props.message || "This specific part of the page failed to load."}
            onRetry={this.handleReset}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
