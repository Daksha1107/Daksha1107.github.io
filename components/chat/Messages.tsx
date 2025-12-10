import { useState, useEffect } from 'react'
import { User, Clock } from 'lucide-react'
import { hasuraClient, GRAPHQL_QUERIES } from '@/lib/hasura'
import type { GetChatMessagesResponse, HasuraChatMessage } from '@/lib/hasura'

interface ChatMessagesProps {
  refreshTrigger?: number
}

export default function ChatMessages({ refreshTrigger }: ChatMessagesProps) {
  const [messages, setMessages] = useState<HasuraChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMessages()
  }, [refreshTrigger])

  const loadMessages = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await hasuraClient.request<GetChatMessagesResponse>(
        GRAPHQL_QUERIES.GET_CHAT_MESSAGES,
        { limit: 50, offset: 0 }
      )

      setMessages(response.chat_messages.reverse()) // Reverse to show oldest first
    } catch (error: any) {
      console.error('Failed to load messages:', error)
      setError('Failed to load messages')
    } finally {
      setIsLoading(false)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-24 mx-auto"></div>
          </div>
          <p className="mt-2 text-sm text-gray-500">Loading messages...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <button
            onClick={loadMessages}
            className="text-sm text-primary-600 hover:text-primary-500"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
            <User className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No messages yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start a conversation by sending your first message.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="h-4 w-4 text-primary-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-gray-900">
                {message.user.email}
              </p>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{formatTimestamp(message.created_at)}</span>
              </div>
            </div>
            <div className="mt-1">
              <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                {message.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}