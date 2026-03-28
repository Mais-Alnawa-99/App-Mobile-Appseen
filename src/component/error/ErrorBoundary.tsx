import React from 'react';
import Error from './Error';

interface ErrorBoundaryProps {
  appHasError: boolean; // Assuming 'appHasError' is a boolean
  children: React.ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error: string;
}
class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {hasError: false, error: ''};
  }
  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return {hasError: true};
  }

  componentDidCatch(error: any, info: any) {
    // Display fallback UI
    this.setState({hasError: true});
    // You can also log the error to an error reporting service
    //   logErrorToMyService(error, info);
  }

  render() {
    const {appHasError}: any = this.props;
    if (this.state.hasError || appHasError) {
      // You can render any custom fallback UI
      return <Error error_connection={false} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
