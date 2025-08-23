# n8n Workflow Configuration

This document outlines the n8n workflows required for the authentication system.

## Chat Message Processing Workflow

### Workflow Overview
This workflow processes incoming chat messages and validates email verification before allowing the message to be processed.

### Workflow Structure

#### 1. Webhook Trigger
- **Node Type**: Webhook
- **Path**: `/webhook/chat`
- **Method**: POST
- **Response**: JSON

**Configuration:**
```json
{
  "httpMethod": "POST",
  "path": "chat",
  "responseMode": "onReceived",
  "authentication": "none"
}
```

#### 2. Validate Email Verification
- **Node Type**: IF
- **Condition**: `{{$json.emailVerified === true}}`

**Configuration:**
```javascript
// IF condition
return $json.emailVerified === true && $json.userEmail && $json.userId;
```

#### 3a. Process Verified Message (True Branch)
- **Node Type**: HTTP Request
- **URL**: `{{$env.HASURA_GRAPHQL_ENDPOINT}}`
- **Method**: POST
- **Headers**: 
  - `Content-Type: application/json`
  - `x-hasura-admin-secret: {{$env.HASURA_ADMIN_SECRET}}`

**Request Body:**
```json
{
  "query": "mutation ProcessMessage($userId: String!, $content: String!, $timestamp: String!) { insert_chat_events_one(object: {user_id: $userId, content: $content, event_type: \"message_received\", metadata: {timestamp: $timestamp}}) { id created_at } }",
  "variables": {
    "userId": "{{$json.userId}}",
    "content": "{{$json.message}}",
    "timestamp": "{{$json.timestamp}}"
  }
}
```

#### 4a. Send Success Response
- **Node Type**: HTTP Response
- **Status Code**: 200

**Response Body:**
```json
{
  "success": true,
  "message": "Message processed successfully",
  "messageId": "{{$json.data.insert_chat_events_one.id}}",
  "timestamp": "{{$json.data.insert_chat_events_one.created_at}}"
}
```

#### 3b. Reject Unverified Message (False Branch)
- **Node Type**: HTTP Request
- **URL**: `{{$env.HASURA_GRAPHQL_ENDPOINT}}`
- **Method**: POST

**Request Body:**
```json
{
  "query": "mutation LogRejection($userId: String, $email: String!, $reason: String!) { insert_security_events_one(object: {user_id: $userId, email: $email, event_type: \"message_rejected\", reason: $reason}) { id } }",
  "variables": {
    "userId": "{{$json.userId || null}}",
    "email": "{{$json.userEmail}}",
    "reason": "Email not verified"
  }
}
```

#### 4b. Send Error Response
- **Node Type**: HTTP Response
- **Status Code**: 403

**Response Body:**
```json
{
  "success": false,
  "error": "Email verification required",
  "message": "Please verify your email address before sending messages"
}
```

## Email Verification Webhook Workflow

### Workflow Overview
This workflow handles email verification callbacks from Bolt and updates user status.

#### 1. Webhook Trigger
- **Node Type**: Webhook
- **Path**: `/webhook/email-verified`
- **Method**: POST

#### 2. Validate Bolt Signature
- **Node Type**: Function
- **Code**:
```javascript
// Validate webhook signature from Bolt
const crypto = require('crypto');
const boltSecret = $env.BOLT_WEBHOOK_SECRET;
const signature = $input.headers['bolt-signature'];
const body = JSON.stringify($input.body);

const expectedSignature = crypto
  .createHmac('sha256', boltSecret)
  .update(body)
  .digest('hex');

if (signature !== `sha256=${expectedSignature}`) {
  throw new Error('Invalid signature');
}

return $input.body;
```

#### 3. Update User Verification Status
- **Node Type**: HTTP Request
- **URL**: `{{$env.HASURA_GRAPHQL_ENDPOINT}}`
- **Method**: POST

**Request Body:**
```json
{
  "query": "mutation UpdateEmailVerification($userId: String!, $emailVerified: Boolean!) { update_users_by_pk(pk_columns: {id: $userId}, _set: {email_verified: $emailVerified}) { id email email_verified updated_at } }",
  "variables": {
    "userId": "{{$json.userId}}",
    "emailVerified": true
  }
}
```

#### 4. Log Verification Event
- **Node Type**: HTTP Request
- **URL**: `{{$env.HASURA_GRAPHQL_ENDPOINT}}`
- **Method**: POST

**Request Body:**
```json
{
  "query": "mutation LogVerification($userId: String!, $email: String!) { insert_security_events_one(object: {user_id: $userId, email: $email, event_type: \"email_verified\"}) { id } }",
  "variables": {
    "userId": "{{$json.userId}}",
    "email": "{{$json.email}}"
  }
}
```

## User Registration Workflow

### Workflow Overview
Handles new user registration and sets up initial verification.

#### 1. Webhook Trigger
- **Node Type**: Webhook
- **Path**: `/webhook/user-registered`
- **Method**: POST

#### 2. Create User in Database
- **Node Type**: HTTP Request
- **URL**: `{{$env.HASURA_GRAPHQL_ENDPOINT}}`
- **Method**: POST

**Request Body:**
```json
{
  "query": "mutation CreateUser($id: String!, $email: String!) { insert_users_one(object: {id: $id, email: $email, email_verified: false}) { id email created_at } }",
  "variables": {
    "id": "{{$json.userId}}",
    "email": "{{$json.email}}"
  }
}
```

#### 3. Send Welcome Email (Optional)
- **Node Type**: SMTP
- **To**: `{{$json.email}}`
- **Subject**: "Welcome! Please verify your email"

## Security Event Monitoring Workflow

### Workflow Overview
Monitors and responds to security events.

#### 1. Schedule Trigger
- **Node Type**: Schedule
- **Interval**: Every 5 minutes

#### 2. Check for Suspicious Activity
- **Node Type**: HTTP Request
- **URL**: `{{$env.HASURA_GRAPHQL_ENDPOINT}}`
- **Method**: POST

**Request Body:**
```json
{
  "query": "query GetRecentSecurityEvents { security_events(where: {created_at: {_gte: \"{{new Date(Date.now() - 5*60*1000).toISOString()}}\"}}, order_by: {created_at: desc}) { id user_id email event_type reason created_at } }"
}
```

#### 3. Process High-Risk Events
- **Node Type**: IF
- **Condition**: Check for multiple failed attempts

#### 4. Send Alert (If High Risk)
- **Node Type**: Slack/Email
- **Message**: Security alert notification

## Environment Variables

```bash
# n8n Environment Variables
HASURA_GRAPHQL_ENDPOINT=http://hasura:8080/v1/graphql
HASURA_ADMIN_SECRET=your_hasura_admin_secret
BOLT_WEBHOOK_SECRET=your_bolt_webhook_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SLACK_WEBHOOK_URL=your_slack_webhook_url
```

## Workflow JSON Exports

### Chat Message Processing Workflow
```json
{
  "name": "Chat Message Processing",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "chat",
        "responseMode": "onReceived"
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "conditions": {
          "boolean": [
            {
              "value1": "={{$json.emailVerified}}",
              "operation": "equal",
              "value2": true
            }
          ]
        }
      },
      "name": "Check Email Verification",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [460, 300]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "Check Email Verification",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## Security Considerations

1. **Webhook Security**: All webhooks should validate signatures and use HTTPS
2. **Rate Limiting**: Implement rate limiting on webhook endpoints
3. **Error Handling**: Proper error handling and logging for all failures
4. **Monitoring**: Set up alerts for unusual patterns or high failure rates
5. **Data Validation**: Validate all incoming data before processing
6. **Authentication**: Secure all external API calls with proper authentication