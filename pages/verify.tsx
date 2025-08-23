import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { CheckCircle, XCircle, Mail, ArrowRight, RefreshCw } from 'lucide-react'
import { authService } from '@/lib/auth'

type VerificationState = 'loading' | 'success' | 'error' | 'pending'

export default function VerifyPage() {
  const router = useRouter()
  const { token, userId, email, action } = router.query
  const [verificationState, setVerificationState] = useState<VerificationState>('loading')
  const [isResending, setIsResending] = useState(false)
  const [userEmail, setUserEmail] = useState<string>('')

  useEffect(() => {
    if (email && typeof email === 'string') {
      setUserEmail(email)
    }
  }, [email])

  useEffect(() => {
    // If this is just showing pending verification, don't attempt to verify
    if (action === 'pending') {
      setVerificationState('pending')
      return
    }

    // If we have token and userId, attempt verification
    if (token && userId && typeof token === 'string' && typeof userId === 'string') {
      handleEmailVerification(token, userId)
    } else if (!action) {
      // No token or userId and not showing pending state
      setVerificationState('error')
    }
  }, [token, userId, action])

  const handleEmailVerification = async (verificationToken: string, verificationUserId: string) => {
    try {
      setVerificationState('loading')
      
      const result = await authService.verifyEmail({
        token: verificationToken,
        userId: verificationUserId
      })

      if (result.success) {
        setVerificationState('success')
        toast.success(result.message)
        
        // Auto-redirect to dashboard after successful verification
        setTimeout(() => {
          router.push('/dashboard')
        }, 3000)
      } else {
        setVerificationState('error')
        toast.error(result.message)
      }
    } catch (error) {
      setVerificationState('error')
      toast.error('Verification failed. Please try again.')
    }
  }

  const handleResendVerification = async () => {
    if (!userEmail) {
      toast.error('Email address is required')
      return
    }

    setIsResending(true)
    try {
      const result = await authService.resendVerificationEmail(userEmail)
      
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Failed to resend verification email')
    } finally {
      setIsResending(false)
    }
  }

  const renderContent = () => {
    switch (verificationState) {
      case 'loading':
        return (
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 animate-pulse">
              <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Verifying your email...
            </h2>
            <p className="mt-2 text-gray-600">
              Please wait while we verify your email address.
            </p>
          </div>
        )

      case 'success':
        return (
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Email verified successfully!
            </h2>
            <p className="mt-2 text-gray-600">
              Your email has been verified. You can now access all features.
            </p>
            <div className="mt-6">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Continue to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              You will be automatically redirected in a few seconds.
            </p>
          </div>
        )

      case 'error':
        return (
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Verification failed
            </h2>
            <p className="mt-2 text-gray-600">
              The verification link is invalid or has expired.
            </p>
            <div className="mt-6 space-y-4">
              {userEmail && (
                <div>
                  <button
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {isResending ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="mr-2 h-4 w-4" />
                    )}
                    {isResending ? 'Sending...' : 'Resend verification email'}
                  </button>
                </div>
              )}
              <div>
                <Link
                  href="/signin"
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        )

      case 'pending':
        return (
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-yellow-100">
              <Mail className="h-6 w-6 text-yellow-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Check your email
            </h2>
            <p className="mt-2 text-gray-600">
              We've sent a verification link to:
            </p>
            {userEmail && (
              <p className="mt-1 text-sm font-medium text-gray-900 bg-gray-100 inline-block px-3 py-1 rounded">
                {userEmail}
              </p>
            )}
            <p className="mt-4 text-gray-600">
              Click the link in your email to verify your account and continue.
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <button
                  onClick={handleResendVerification}
                  disabled={isResending || !userEmail}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {isResending ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="mr-2 h-4 w-4" />
                  )}
                  {isResending ? 'Sending...' : 'Resend verification email'}
                </button>
              </div>
              <div className="text-sm text-gray-500">
                Didn't receive the email? Check your spam folder or{' '}
                <Link href="/signup" className="text-primary-600 hover:text-primary-500 font-medium">
                  sign up again
                </Link>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {renderContent()}
        
        {/* Email input for resending when not provided in URL */}
        {verificationState === 'error' && !userEmail && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your email to resend verification
            </label>
            <div className="flex space-x-2">
              <input
                type="email"
                id="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="input flex-1"
                placeholder="your@email.com"
              />
              <button
                onClick={handleResendVerification}
                disabled={isResending || !userEmail.trim()}
                className="btn-primary px-3"
              >
                {isResending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}