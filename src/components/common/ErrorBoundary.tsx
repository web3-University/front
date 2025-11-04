import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // TODO: send error details to logging service when it is ready
    console.error("[ErrorBoundary] captured error", error, info);
  }

  private handleReload = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-[#C7C4E8] bg-white/70 px-6 py-8 text-center text-[#2B2558]"
        >
          <h3 className="text-lg font-semibold">模块暂时不可用</h3>
          <p className="text-sm text-[#6A6D94]">
            我们已经记录了这个问题，请稍后再试。
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="rounded-full bg-[#2B2558] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3A3380]"
          >
            重新加载模块
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
