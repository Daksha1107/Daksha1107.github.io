import { useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Shield, Mail, AlertCircle } from 'lucide-react'
import { authService } from '@/lib/auth'
import type { AuthState } from '@/types/auth'

interface RouteGuardProps {
  children: ReactNode
  requireAuth?: boolean
  requireEmailVerification?: boolean
  fallbackPath?: string
}

export default function RouteGuard({
  children,
  requireAuth = true,
  requireEmailVerification = true,
  fallbackPath = '/signin'
}: RouteGuardProps) {
  const router = useRouter()
  const [authState, setAuthState] = useState<AuthState | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authService.subscribe((state) => {
      setAuthState(state)
      setIsLoading(false)
    })

    // Initialize with current state
    const currentState = authService.getAuthState()
    setAuthState(currentState)
    setIsLoading(currentState.isLoading)

    return unsubscribe
  }, [])

  useEffect(() => {
    if (isLoading || !authState) return

    // Check authentication requirement
    if (requireAuth && !authState.isAuthenticated) {
      router.push(fallbackPath)
      return
    }

    // Check email verification requirement
    if (requireEmailVerification && authState.isAuthenticated && !authState.user?.emailVerified) {
      // Don't redirect if we're already on verification-related pages
      const currentPath = router.pathname
      const allowedPaths = ['/verify', '/signin', '/signup']
      
      if (!allowedPaths.includes(currentPath)) {
        router.push(`/verify?email=${encodeURIComponent(authState.user?.email || '')}&action=pending`)
      }
      return
    }
  }, [authState, isLoading, requireAuth, requireEmailVerification, router, fallbackPath])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100 animate-pulse">
            <Shield className="h-6 w-6 text-primary-600" />
          </div>
          <h2 className="mt-4 text-lg font-medium text-gray-900">
            Loading...
          </h2>
          <p className="mt-2 text-gray-600">
            Checking authentication status
          </p>
        </div>
      </div>
    )
  }

  // Show unauthenticated state
  if (requireAuth && !authState?.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Authentication Required
          </h2>
          <p className="mt-2 text-gray-600">
            You need to be signed in to access this page.
          </p>
          <div className="mt-6 space-x-4">
            <Link
              href="/signin"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Show email verification required state
  if (requireEmailVerification && authState?.isAuthenticated && !authState.user?.emailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-yellow-100">
            <Mail className="h-6 w-6 text-yellow-600" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Email Verification Required
          </h2>
          <p className="mt-2 text-gray-600">
            Please verify your email address to access this page.
          </p>
          {authState.user?.email && (
            <p className="mt-1 text-sm text-gray-500">
              Verification email sent to: <span className="font-medium">{authState.user.email}</span>
            </p>
          )}
          <div className="mt-6">
            <Link
              href={`/verify?email=${encodeURIComponent(authState.user?.email || '')}&action=pending`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Go to Verification
            </Link>
          </div>
          <div className="mt-4">
            <button
              onClick={() => authService.signout()}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    )
  }

  // All checks passed, render children
  return <>{children}</>
}

// Higher-order component for easier use
export function withRouteGuard<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<RouteGuardProps, 'children'>
) {
  return function GuardedComponent(props: P) {
    return (
      <RouteGuard {...options}>
        <Component {...props} />
      </RouteGuard>
    )
  }
}

// Hook for checking auth status in components
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(authService.getAuthState())

  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState)
    return unsubscribe
  }, [])

  return {
    ...authState,
    isEmailVerified: authState.isAuthenticated && authState.user?.emailVerified === true,
    signout: () => authService.signout(),
    resendVerificationEmail: (email: string) => authService.resendVerificationEmail(email)
  }
}