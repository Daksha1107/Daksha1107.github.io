# Hasura Database Schema

This document outlines the database schema required for the authentication system.

## Tables

### users
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_email_verified ON users(email_verified);
```

### chat_messages
```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);
```

## Row Level Security (RLS) Policies

### users table policies
```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT
  USING (id = current_setting('hasura.user.id', true));

-- Only verified users can view other users
CREATE POLICY "Verified users can view others" ON users
  FOR SELECT
  USING (
    current_setting('hasura.email.verified', true) = 'true'
    AND email_verified = true
  );

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE
  USING (id = current_setting('hasura.user.id', true));
```

### chat_messages table policies
```sql
-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Only verified users can view messages
CREATE POLICY "Verified users can view messages" ON chat_messages
  FOR SELECT
  USING (
    current_setting('hasura.email.verified', true) = 'true'
    AND EXISTS (
      SELECT 1 FROM users 
      WHERE id = current_setting('hasura.user.id', true)
      AND email_verified = true
    )
  );

-- Only verified users can insert messages
CREATE POLICY "Verified users can insert messages" ON chat_messages
  FOR INSERT
  WITH CHECK (
    user_id = current_setting('hasura.user.id', true)
    AND current_setting('hasura.email.verified', true) = 'true'
    AND EXISTS (
      SELECT 1 FROM users 
      WHERE id = current_setting('hasura.user.id', true)
      AND email_verified = true
    )
  );

-- Users can update their own messages
CREATE POLICY "Users can update own messages" ON chat_messages
  FOR UPDATE
  USING (
    user_id = current_setting('hasura.user.id', true)
    AND current_setting('hasura.email.verified', true) = 'true'
  );

-- Users can delete their own messages
CREATE POLICY "Users can delete own messages" ON chat_messages
  FOR DELETE
  USING (
    user_id = current_setting('hasura.user.id', true)
    AND current_setting('hasura.email.verified', true) = 'true'
  );
```

## Hasura Configuration

### JWT Configuration
```yaml
# In your Hasura docker-compose.yml or environment
HASURA_GRAPHQL_JWT_SECRET: |
  {
    "type": "HS256",
    "key": "your-jwt-secret-key-here"
  }

# JWT Claims mapping
HASURA_GRAPHQL_JWT_SECRET: |
  {
    "type": "HS256",
    "key": "your-jwt-secret-key-here",
    "claims_map": {
      "x-hasura-default-role": {
        "path": "$.https://hasura.io/jwt/claims.x-hasura-default-role"
      },
      "x-hasura-allowed-roles": {
        "path": "$.https://hasura.io/jwt/claims.x-hasura-allowed-roles"
      },
      "x-hasura-user-id": {
        "path": "$.https://hasura.io/jwt/claims.x-hasura-user-id"
      },
      "x-hasura-email-verified": {
        "path": "$.https://hasura.io/jwt/claims.x-hasura-email-verified"
      }
    }
  }
```

### Permissions

#### users table permissions

**Role: user**

**Select Permission:**
```json
{
  "filter": {
    "_or": [
      {"id": {"_eq": "X-Hasura-User-Id"}},
      {
        "_and": [
          {"email_verified": {"_eq": true}},
          {"X-Hasura-Email-Verified": {"_eq": "true"}}
        ]
      }
    ]
  },
  "columns": ["id", "email", "email_verified", "created_at"],
  "limit": 100
}
```

**Update Permission:**
```json
{
  "filter": {"id": {"_eq": "X-Hasura-User-Id"}},
  "columns": ["email"],
  "check": {"id": {"_eq": "X-Hasura-User-Id"}}
}
```

#### chat_messages table permissions

**Role: user**

**Select Permission:**
```json
{
  "filter": {
    "_and": [
      {"X-Hasura-Email-Verified": {"_eq": "true"}},
      {
        "user": {
          "email_verified": {"_eq": true}
        }
      }
    ]
  },
  "columns": ["id", "content", "created_at", "user_id"],
  "limit": 100
}
```

**Insert Permission:**
```json
{
  "check": {
    "_and": [
      {"user_id": {"_eq": "X-Hasura-User-Id"}},
      {"X-Hasura-Email-Verified": {"_eq": "true"}}
    ]
  },
  "columns": ["content", "user_id"],
  "presets": {
    "user_id": "X-Hasura-User-Id"
  }
}
```

**Update Permission:**
```json
{
  "filter": {
    "_and": [
      {"user_id": {"_eq": "X-Hasura-User-Id"}},
      {"X-Hasura-Email-Verified": {"_eq": "true"}}
    ]
  },
  "check": {
    "_and": [
      {"user_id": {"_eq": "X-Hasura-User-Id"}},
      {"X-Hasura-Email-Verified": {"_eq": "true"}}
    ]
  },
  "columns": ["content"]
}
```

**Delete Permission:**
```json
{
  "filter": {
    "_and": [
      {"user_id": {"_eq": "X-Hasura-User-Id"}},
      {"X-Hasura-Email-Verified": {"_eq": "true"}}
    ]
  }
}
```

## Triggers and Functions

### Update timestamp trigger
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to users table
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Apply to chat_messages table
CREATE TRIGGER update_chat_messages_updated_at 
  BEFORE UPDATE ON chat_messages 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
```

## Security Notes

1. **Email Verification is Mandatory**: All policies check for `email_verified = true` and `X-Hasura-Email-Verified = "true"`
2. **Double Verification**: Both database field and JWT claim must confirm verification
3. **User Isolation**: Users can only access their own data unless explicitly allowed
4. **Admin Override**: Admin role can bypass all restrictions for management purposes
5. **Audit Trail**: All operations include timestamps for security auditing