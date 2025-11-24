'use client'

import { Component, type ReactNode } from 'react'
import { Button } from './ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: any
}

/**
 * ErrorBoundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 *
 * Or with custom fallback:
 * ```tsx
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error to console for development
    console.error('ErrorBoundary caught error:', {
      error,
      errorInfo,
      componentStack: errorInfo?.componentStack,
    })

    this.setState({ errorInfo })

    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // Example:
    // Sentry.captureException(error, {
    //   contexts: {
    //     react: {
    //       componentStack: errorInfo?.componentStack,
    //     },
    //   },
    // })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="max-w-md text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />

            <h2 className="text-2xl font-semibold mb-2">
              Something went wrong
            </h2>

            <p className="text-muted-foreground mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>

            <div className="flex gap-3 justify-center">
              <Button
                onClick={this.handleReset}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>

              <Button
                onClick={() => window.location.reload()}
                variant="default"
              >
                Reload Page
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                  Error Details (Dev Only)
                </summary>
                <pre className="mt-2 p-4 bg-muted rounded text-xs overflow-auto max-h-48">
                  {this.state.error?.stack}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * AuthErrorBoundary
 *
 * Specialized error boundary for authentication errors.
 * Redirects to login on auth errors.
 */
export class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('AuthErrorBoundary caught error:', error, errorInfo)

    // Check if it's an auth error
    if (
      error.message?.includes('session') ||
      error.message?.includes('auth') ||
      error.message?.includes('unauthorized') ||
      error.message?.includes('token')
    ) {
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = '/auth/login'
      }, 2000)
    }
  }

  render() {
    if (this.state.hasError) {
      const isAuthError =
        this.state.error?.message?.includes('session') ||
        this.state.error?.message?.includes('auth') ||
        this.state.error?.message?.includes('unauthorized') ||
        this.state.error?.message?.includes('token')

      if (isAuthError) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
            <div className="max-w-md text-center">
              <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />

              <h2 className="text-2xl font-semibold mb-2">
                Session Expired
              </h2>

              <p className="text-muted-foreground mb-6">
                Your session has expired. Redirecting to login...
              </p>

              <Button
                onClick={() => window.location.href = '/auth/login'}
                variant="default"
              >
                Go to Login
              </Button>
            </div>
          </div>
        )
      }

      return this.props.fallback || (
        <ErrorBoundary>{this.props.children}</ErrorBoundary>
      )
    }

    return this.props.children
  }
}
