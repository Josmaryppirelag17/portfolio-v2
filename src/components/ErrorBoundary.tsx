import React, { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class PortfolioErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  declare props: ErrorBoundaryProps;
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", error, errorInfo.componentStack);
    }
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="min-h-screen flex flex-col items-center justify-center gap-4 bg-brand-bg text-brand-pale px-6 font-sans"
        >
          <h2 className="font-display text-lg uppercase text-brand-pink">
            Oops — algo salió mal
          </h2>
          <p className="font-mono text-sm text-brand-pale/80 text-center max-w-md">
            Esta sección encontró un error inesperado. Puedes recargar la página
            para intentarlo de nuevo.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <pre className="font-mono text-[10px] text-brand-cyan/70 max-w-lg overflow-auto p-3 border border-brand-pale/10 rounded">
              {this.state.error.message}
            </pre>
          )}
          <button
            type="button"
            onClick={this.handleReload}
            className="font-mono text-xs px-4 py-2 bg-brand-pink text-white rounded border-2 border-[#111232] cursor-pointer hover:bg-brand-cyan transition-colors"
          >
            Recargar la página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
