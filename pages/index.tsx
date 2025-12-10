import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Shield, Mail, Lock, Users, ArrowRight, CheckCircle } from 'lucide-react'
import { useAuth } from '@/components/auth/RouteGuard'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, isEmailVerified } = useAuth()

  useEffect(() => {
    // Redirect authenticated and verified users to dashboard
    if (isAuthenticated && isEmailVerified) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isEmailVerified, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <header className="relative px-4 sm:px-6 lg:px-8 pt-6">
              <nav className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-8 w-8 text-primary-600" />
                  <span className="text-xl font-bold text-gray-900">SecureChat</span>
                </div>
                <div className="flex items-center space-x-4">
                  {isAuthenticated ? (
                    <Link
                      href="/dashboard"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/signin"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/signup"
                        className="btn-primary"
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </header>

            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Secure chat with</span>
                  <span className="block text-primary-600">email verification</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Experience a chat application built with enterprise-grade security. 
                  Every user must verify their email before participating in conversations.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      href="/signup"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      href="/signin"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10"
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
              Security Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Built with security in mind
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Every aspect of this application includes multiple layers of security and verification.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Mail className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  Email Verification Required
                </p>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  All users must verify their email address before accessing chat features. 
                  Unverified users are automatically blocked from messaging.
                </dd>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Lock className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  JWT with Hasura Claims
                </p>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Secure JWT tokens include Hasura claims with email verification status, 
                  enabling database-level permission controls.
                </dd>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Shield className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  Route Guards & Permissions
                </p>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Client-side route guards and server-side permissions ensure only 
                  verified users can access protected resources.
                </dd>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Users className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  n8n Workflow Validation
                </p>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Message processing workflows validate email verification status 
                  before handling any chat operations.
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
              How it works
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Simple, secure authentication flow
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600 font-semibold text-sm">
                  1
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Sign up with email</h3>
                  <p className="text-gray-500">Create your account using a valid email address and secure password.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600 font-semibold text-sm">
                  2
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Verify your email</h3>
                  <p className="text-gray-500">Check your inbox and click the verification link to activate your account.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600 font-semibold text-sm">
                  3
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Start chatting securely</h3>
                  <p className="text-gray-500">Once verified, access the chat room and participate in secure conversations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Create your secure account today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-200">
            Join a community that values security and privacy.
          </p>
          <Link
            href="/signup"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 sm:w-auto"
          >
            Sign up now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400 text-sm">
            <p>© 2024 SecureChat. Built with Bolt, Hasura, and n8n integration.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}