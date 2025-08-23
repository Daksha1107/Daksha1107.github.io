import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { hasuraClient, requireEmailVerification, GRAPHQL_QUERIES } from '@/lib/hasura'
import { useAuth } from '@/components/auth/RouteGuard'
import type { CreateChatMessageResponse } from '@/lib/hasura'

interface ChatComposerProps {
  onMessageSent?: (message: any) => void
  placeholder?: string
  disabled?: boolean
}

export default function ChatComposer({
  onMessageSent,
  placeholder = "Type your message...",
  disabled = false
}: ChatComposerProps) {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { isAuthenticated, isEmailVerified, user } = useAuth()

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [message])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim() || isLoading || disabled) return

    // Check authentication and email verification
    if (!isAuthenticated || !isEmailVerified) {
      toast.error('Email verification required to send messages')
      return
    }

    try {
      setIsLoading(true)
      
      // Verify email status before sending (additional security check)
      requireEmailVerification()

      // Send message to Hasura
      const response = await hasuraClient.request<CreateChatMessageResponse>(
        GRAPHQL_QUERIES.CREATE_CHAT_MESSAGE,
        { content: message.trim() }
      )

      // Send to n8n webhook if configured
      await sendToN8nWebhook(message.trim(), user?.id, user?.email)

      // Clear message and notify parent
      setMessage('')
      onMessageSent?.(response.insert_chat_messages_one)
      toast.success('Message sent!')

    } catch (error: any) {
      console.error('Failed to send message:', error)
      
      if (error.message === 'Email verification required') {
        toast.error('Email verification required to send messages')
      } else if (error.response?.errors?.[0]?.message?.includes('permission')) {
        toast.error('You don\'t have permission to send messages. Please verify your email.')
      } else {
        toast.error('Failed to send message. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const sendToN8nWebhook = async (content: string, userId?: string, userEmail?: string) => {
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL
    if (!webhookUrl) return

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          userId,
          userEmail,
          emailVerified: isEmailVerified,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        console.warn('n8n webhook failed:', response.statusText)
      }
    } catch (error) {
      console.warn('n8n webhook error:', error)
      // Don't throw error - webhook failure shouldn't prevent message sending
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  // Show verification warning if not verified
  if (isAuthenticated && !isEmailVerified) {
    return (
      <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
        <div className="flex items-center space-x-2 text-yellow-800">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">Email verification required</span>
        </div>
        <p className="mt-1 text-sm text-yellow-700">
          You need to verify your email address before you can send messages.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading || disabled || !isEmailVerified}
          className={`
            w-full resize-none border rounded-lg px-4 py-3 pr-12 
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            min-h-[44px] max-h-[200px]
            ${isLoading || disabled || !isEmailVerified 
              ? 'bg-gray-100 cursor-not-allowed' 
              : 'bg-white'
            }
            ${!isEmailVerified ? 'border-yellow-300' : 'border-gray-300'}
          `}
          rows={1}
        />
        
        {/* Send button */}
        <button
          type="submit"
          disabled={!message.trim() || isLoading || disabled || !isEmailVerified}
          className={`
            absolute right-2 top-1/2 transform -translate-y-1/2
            p-2 rounded-md transition-colors
            ${message.trim() && !isLoading && !disabled && isEmailVerified
              ? 'text-primary-600 hover:bg-primary-50 cursor-pointer'
              : 'text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Character count and status */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          {isEmailVerified ? (
            <span className="text-green-600">✓ Verified</span>
          ) : (
            <span className="text-yellow-600">⚠ Email verification required</span>
          )}
        </div>
        <div>
          {message.length > 0 && (
            <span className={message.length > 1000 ? 'text-red-500' : ''}>
              {message.length}/1000
            </span>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="text-xs text-gray-400">
        Press Enter to send, Shift+Enter for new line
      </div>
    </form>
  )
}