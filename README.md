# Authentication System Implementation

This repository implements a complete authentication system with email verification using Bolt, Hasura, and n8n integration.

## Features

- **Secure Authentication**: Email and password authentication with Bolt integration
- **Email Verification**: Required email verification before accessing application features
- **JWT with Hasura Claims**: JWT tokens include Hasura claims with email verification status
- **Route Guards**: Client-side and server-side protection for unverified users
- **Chat System**: Secure messaging system requiring verified email status
- **n8n Integration**: Workflow validation for message processing

## Architecture

### Frontend (Next.js/React)
- TypeScript for type safety
- Tailwind CSS for styling
- React Hook Form for form handling
- React Hot Toast for notifications

### Authentication (Bolt + JWT)
- Bolt for user management and email verification
- Custom JWT tokens with Hasura claims
- Email verification status in JWT payload

### Database (Hasura GraphQL)
- Row-level security based on email verification
- GraphQL API with authentication middleware
- Real-time subscriptions for chat

### Workflow (n8n)
- Message processing validation
- Email verification status checks
- Webhook integration for chat events

## JWT Claims Structure

```json
{
  "sub": "bolt-user-id-1234",
  "email": "user@example.com",
  "email_verified": true,
  "https://hasura.io/jwt/claims": {
    "x-hasura-default-role": "user",
    "x-hasura-allowed-roles": ["user"],
    "x-hasura-user-id": "bolt-user-id-1234",
    "x-hasura-email-verified": "true"
  }
}
```

## User Flow

1. **Signup**: User creates account → Bolt sends verification email → Pending verification state
2. **Email Verification**: User clicks email link → Token validated → Account activated
3. **Signin**: Verified users can sign in → Unverified users blocked with resend option
4. **Protected Access**: All chat and dashboard routes require verified email status
5. **Message Processing**: n8n workflows validate email verification before processing

## Security Measures

### Multi-Layer Verification
- **Client-side route guards** for immediate UX feedback
- **JWT token validation** with email verification claims
- **Hasura RLS permissions** requiring verified email status
- **n8n workflow validation** before message processing

### Token Security
- Short-lived JWT tokens (24 hours)
- Secure token storage in localStorage
- Automatic token refresh handling
- Server-side token verification

### Database Security
- Row-level security (RLS) on all tables
- Email verification required for all operations
- Admin-only user management operations
- Audit trails for security events

## Environment Variables

```bash
# Bolt Authentication
NEXT_PUBLIC_BOLT_PUBLIC_KEY=your_bolt_public_key
BOLT_API_KEY=your_bolt_api_key

# Hasura GraphQL
NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT=http://localhost:8080/v1/graphql
HASURA_GRAPHQL_ADMIN_SECRET=your_hasura_admin_secret

# JWT Configuration
JWT_SECRET=your_jwt_secret_strong_random_string

# n8n Webhook
NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook/chat

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## Pages

- `/` - Landing page with features overview
- `/signup` - User registration with email verification
- `/signin` - User authentication with verification check
- `/verify` - Email verification handler and status page
- `/dashboard` - Protected chat application (requires verified email)

## Components

### Authentication
- `RouteGuard` - Higher-order component for route protection
- `useAuth` - Hook for accessing authentication state

### Chat
- `ChatComposer` - Message input with verification checks
- `ChatMessages` - Message display with verified users only

## API Integration

### Bolt Authentication
- User signup and email verification
- Signin with verification status check
- Resend verification email functionality

### Hasura GraphQL
- User profile management
- Chat message CRUD operations
- Real-time subscriptions with auth

### n8n Webhooks
- Message processing workflows
- Email verification validation
- Event-driven automation

## Security Considerations

1. **Email Verification is Mandatory**: All application features require verified email
2. **JWT Token Security**: Tokens include verification status and expire regularly
3. **Database Permissions**: RLS ensures only verified users can access data
4. **Workflow Validation**: n8n workflows double-check verification status
5. **Client-Side Guards**: Immediate feedback and protection for better UX

## Production Deployment

1. Configure environment variables for production
2. Set up Bolt authentication service
3. Deploy Hasura with proper permissions
4. Configure n8n workflows
5. Deploy Next.js application

## License

MIT License - see LICENSE file for details.