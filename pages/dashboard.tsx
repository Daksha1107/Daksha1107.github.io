import { useState } from 'react'
import { LogOut, MessageSquare, User, Shield, Mail } from 'lucide-react'
import RouteGuard, { useAuth } from '@/components/auth/RouteGuard'
import ChatMessages from '@/components/chat/Messages'
import ChatComposer from '@/components/chat/Composer'

function DashboardContent() {
  const { user, signout } = useAuth()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleMessageSent = () => {
    // Trigger refresh of messages
    setRefreshTrigger(prev => prev + 1)
  }

  const handleSignout = async () => {
    await signout()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-primary-600" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Secure Chat
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-green-500" />
                <span>Verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">{user?.email}</span>
              </div>
              <button
                onClick={handleSignout}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border h-[calc(100vh-200px)] flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-primary-600" />
              <h2 className="text-lg font-medium text-gray-900">Chat Room</h2>
            </div>
            <div className="text-sm text-gray-500">
              Email verified users only
            </div>
          </div>

          {/* Messages Area */}
          <ChatMessages refreshTrigger={refreshTrigger} />

          {/* Composer */}
          <div className="border-t p-4">
            <ChatComposer onMessageSent={handleMessageSent} />
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">
                Security Features Active
              </h3>
              <div className="mt-1 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Email verification required for all messaging</li>
                  <li>JWT tokens with Hasura claims for secure authentication</li>
                  <li>Server-side permission checks on all operations</li>
                  <li>n8n workflow validation for message processing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <RouteGuard requireAuth={true} requireEmailVerification={true}>
      <DashboardContent />
    </RouteGuard>
  )
}