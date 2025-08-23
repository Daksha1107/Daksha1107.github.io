# Chatbot Assessment App

A production-ready **Next.js 14 (App Router) + TypeScript** frontend application for AI-powered chatbot assessment. Features ultra-premium cinematic design, real-time GraphQL subscriptions, and comprehensive authentication.

## 🚀 Features

- **Next.js 14** with App Router and TypeScript
- **Ultra-Premium Design** with cinematic dark theme and Netflix-inspired accents
- **Real-time Communication** via GraphQL subscriptions
- **JWT Authentication** with secure token management
- **Apollo Client** for comprehensive GraphQL operations
- **Framer Motion** animations for smooth interactions
- **Responsive Design** optimized for all devices
- **Production Ready** with proper error handling and accessibility

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **GraphQL**: Apollo Client (HTTP + WebSocket)
- **Animation**: Framer Motion
- **Icons**: Heroicons
- **Authentication**: JWT-based with context management

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Access to Hasura GraphQL endpoint
- Access to n8n webhook (for backend integration)

## ⚙️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd chatbot-assessment-app
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your variables:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Hasura GraphQL Configuration
NEXT_PUBLIC_HASURA_HTTP="https://your-hasura-instance.hasura.app/v1/graphql"
NEXT_PUBLIC_HASURA_WS="wss://your-hasura-instance.hasura.app/v1/graphql"

# NHost Authentication (if using NHost)
NEXT_PUBLIC_NHOST_AUTH_URL="https://your-nhost-backend.nhost.run"
NEXT_PUBLIC_NHOST_ANON_KEY="your-nhost-anonymous-key"

# N8N Webhook URL (for reference - not used directly by frontend)
NEXT_PUBLIC_WEBHOOK_URL="https://your-n8n-instance.com/webhook/chatbot"

# UI Theme
NEXT_PUBLIC_CINEMATIC_ACCENT="#E50914"
```

### 3. Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build

Build for production:

```bash
npm run build
npm start
```

## 📱 Application Structure

### Pages & Routes

- **`/`** - Landing page with authentication
- **`/dashboard`** - Main dashboard with chat list
- **`/chats/[id]`** - Individual chat interface
- **`/settings`** - User profile and preferences
- **`/submit`** - Assignment submission with template generator

### Core Components

- **`Header`** - Navigation with user menu and logout
- **`Sidebar`** - Chat list and navigation
- **`MessageList`** - Virtualized message display
- **`MessageBubble`** - Individual message with animations
- **`Composer`** - Message input with auto-resize
- **`StatusBar`** - Real-time status indicators

## 🔄 Message Flow

The application follows a specific sequence for sending messages:

1. **User Input** - Validate and insert user message via GraphQL mutation
2. **Action Trigger** - Call Hasura Action `sendMessage` to trigger n8n workflow
3. **Real-time Updates** - Listen for bot responses via GraphQL subscriptions
4. **Error Handling** - Display status and handle any failures gracefully

## 🎨 Design System

### Color Palette

- **Primary Background**: `#0f0f0f` (Deep black)
- **Surface**: `#1a1a1a` (Dark gray)
- **Surface Elevated**: `#2a2a2a` (Medium gray)
- **Accent**: `#E50914` (Netflix red)
- **Text**: `#ffffff` (White)
- **Text Muted**: `#a1a1aa` (Light gray)

### Typography

- **Font**: Inter with refined weight scale
- **Sizes**: Responsive scale from 0.75rem to 3rem
- **Line Heights**: Optimized for readability

### Animation

- **Duration**: 120-220ms for micro-interactions
- **Easing**: Custom cubic-bezier curves
- **Effects**: Scale, fade, slide transitions

## 🔐 Authentication

The app includes a complete authentication system:

- **JWT Token Management** - Secure storage in localStorage
- **Auto Redirect** - Automatic routing based on auth state
- **Session Persistence** - Maintains login across browser sessions
- **Secure Logout** - Clears all stored credentials

*Note: Current implementation uses mock authentication for demo purposes.*

## 📊 GraphQL Operations

### Queries

- `GetChatsForUser` - Fetch user's chat list
- `GetMessagesForChat` - Retrieve chat message history

### Mutations

- `InsertUserMessage` - Add user message to chat
- `SendMessageAction` - Trigger bot response via Hasura Action

### Subscriptions

- `OnMessages` - Real-time message updates

## 🚦 Error Handling

- **GraphQL Errors** - Graceful error display with retry options
- **Network Issues** - Offline detection and reconnection
- **Validation** - Form validation with clear error messages
- **Fallbacks** - Loading states and empty state handling

## ♿ Accessibility

- **Keyboard Navigation** - Full keyboard accessibility
- **Focus Management** - Proper focus indicators and trapping
- **Screen Readers** - ARIA labels and semantic HTML
- **Color Contrast** - WCAG 2.1 AA compliance

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── chat/           # Chat-related components
│   ├── layout/         # Layout components
│   └── ui/             # Base UI components
├── graphql/            # GraphQL operations
├── lib/                # Utility libraries
└── types/              # TypeScript type definitions
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the Next.js documentation
- Review Apollo Client documentation
- Consult Tailwind CSS documentation

---

Built with ❤️ using Next.js 14, TypeScript, and modern web technologies.
