# Chatbot Assessment App

A premium **Next.js 14 (App Router) + TypeScript** frontend application for a Chatbot Assessment system with GraphQL integration.

## ✨ Features

- 🚀 **Next.js 14** with App Router and TypeScript
- 🎨 **Premium Cinematic UI** with Netflix-inspired design system  
- 📡 **GraphQL Integration** with Apollo Client (HTTP + WebSocket)
- 🔐 **JWT Authentication** with secure token handling
- 💬 **Real-time Messaging** via GraphQL subscriptions
- 🎭 **Smooth Animations** powered by Framer Motion
- 📱 **Responsive Design** with glass morphism effects
- ⚡ **Production Ready** with static export for GitHub Pages

## 🎨 Design System

- **Color Palette**: Deep charcoal with cinematic accents
- **Accent Color**: `#E50914` (Netflix red)
- **Typography**: Inter font with refined scale
- **Motion**: 120-220ms animation durations
- **Glass Effects**: Backdrop blur with soft glows

## 🛠️ Tech Stack

```
Frontend Framework    Next.js 14 (App Router)
Language             TypeScript
Styling              Tailwind CSS
GraphQL Client       Apollo Client
Real-time            GraphQL Subscriptions (WebSocket)
Animations           Framer Motion
Icons                Lucide React
Authentication       JWT Tokens
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication page
│   ├── dashboard/         # Main dashboard
│   ├── chats/[id]/        # Dynamic chat routes
│   ├── settings/          # User settings
│   └── submit/            # Assignment submission
├── components/            # Reusable UI components
│   ├── Header.tsx         # Navigation header
│   ├── Sidebar.tsx        # Chat list sidebar
│   ├── MessageList.tsx    # Message display
│   ├── MessageBubble.tsx  # Individual messages
│   ├── Composer.tsx       # Message input
│   └── StatusBar.tsx      # Connection status
├── lib/                   # Core utilities
│   ├── apollo.ts          # GraphQL client setup
│   ├── auth.tsx           # Authentication context
│   └── utils.ts           # Helper functions
├── graphql/               # GraphQL operations
│   └── queries.ts         # Queries, mutations, subscriptions
└── types/                 # TypeScript definitions
    └── index.ts           # Type definitions
```

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/Daksha1107/Daksha1107.github.io.git
cd Daksha1107.github.io
npm install
```

### 2. Environment Setup

Copy the example environment file and configure your endpoints:

```bash
cp .env.example .env.local
```

Update `.env.local` with your actual values:

```env
# GraphQL Endpoints
NEXT_PUBLIC_HASURA_HTTP="https://your-hasura-endpoint/v1/graphql"
NEXT_PUBLIC_HASURA_WS="wss://your-hasura-endpoint/v1/graphql"

# Authentication
NEXT_PUBLIC_NHOST_AUTH_URL="https://your-nhost-backend"
NEXT_PUBLIC_NHOST_ANON_KEY="your-nhost-anon-key"

# Webhook
NEXT_PUBLIC_WEBHOOK_URL="https://your-n8n-webhook-url"

# Theme
NEXT_PUBLIC_CINEMATIC_ACCENT="#E50914"
```

### 3. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build & Deploy

```bash
# Build for production
npm run build

# Export static files (for GitHub Pages)
npm run export
```

## 📡 GraphQL Operations

The app uses the following GraphQL operations as specified:

### Queries
- `GetChatsForUser` - Fetch user's chat list
- `GetMessagesForChat` - Get messages for a specific chat

### Subscriptions  
- `OnMessages` - Real-time message updates

### Mutations
- `InsertUserMessage` - Add user message to database
- `SendMessageAction` - Trigger Hasura Action for bot response

## 🔐 Authentication Flow

1. **Login/Register** - JWT token authentication
2. **Token Storage** - Secure localStorage with auto-refresh
3. **GraphQL Headers** - Automatic Authorization header injection
4. **Route Protection** - Client-side auth guards

## 💬 Message Flow

1. User types message and hits Send
2. `InsertUserMessage` mutation adds to database
3. `SendMessageAction` triggers Hasura Action → n8n workflow
4. `OnMessages` subscription receives bot response in real-time
5. UI updates with smooth animations

## 🎯 Pages & Routes

- `/` - Authentication landing page
- `/dashboard` - Main dashboard with chat overview
- `/chats/[id]` - Individual chat interface
- `/settings` - User profile and preferences  
- `/submit` - Assignment submission template

## 🎨 UI Components

### Core Components
- **Header** - User avatar, settings, logout
- **Sidebar** - Chat list with search and create
- **MessageList** - Virtualized message display
- **MessageBubble** - Animated message bubbles
- **Composer** - Rich text input with attachments
- **StatusBar** - Connection and action status

### Design Features
- Glass morphism panels with backdrop blur
- Smooth hover and focus animations
- Cinematic color gradients
- Premium button interactions
- Responsive grid layouts

## 🔧 Development

### Code Style
```bash
npm run lint        # ESLint checking
npm run build       # Type checking + build
```

### File Naming
- Components: PascalCase (e.g., `MessageBubble.tsx`)
- Utilities: camelCase (e.g., `utils.ts`)
- Pages: lowercase (e.g., `page.tsx`)

### Import Order
1. React/Next.js imports
2. Third-party libraries
3. Internal components
4. Types and utilities

## 📦 Deployment

### GitHub Pages (Static Export)
The app is configured for static export to GitHub Pages:

```bash
npm run build && npm run export
```

### Environment Variables
All environment variables use `NEXT_PUBLIC_` prefix for client-side access.

## 🎯 Performance

- **Code Splitting** - Automatic by Next.js App Router
- **Image Optimization** - Disabled for static export
- **Bundle Analysis** - Use `npm run build` to analyze
- **Caching** - Apollo Client with in-memory cache

## 🔒 Security

- No admin secrets in frontend code
- JWT tokens for authentication
- GraphQL-only communication (no direct API calls)
- Input validation and error handling

## 📱 Browser Support

- Chrome 90+
- Firefox 88+  
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from Netflix UI patterns
- GraphQL schema provided by Hasura backend
- Icons by Lucide React
- Animations by Framer Motion

---

**Built with ❤️ using Next.js 14 + TypeScript + GraphQL**