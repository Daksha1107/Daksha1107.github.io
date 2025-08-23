# Deployment Guide

This guide covers deploying the authentication system to production environments.

## Production Environment Setup

### 1. Environment Variables

Create a production `.env.production` file with the following variables:

```bash
# Bolt Authentication (Production)
NEXT_PUBLIC_BOLT_PUBLIC_KEY=pk_live_your_production_bolt_public_key
BOLT_API_KEY=sk_live_your_production_bolt_api_key

# Hasura GraphQL (Production)
NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT=https://your-hasura-endpoint.hasura.app/v1/graphql
HASURA_GRAPHQL_ADMIN_SECRET=your_secure_admin_secret_minimum_32_chars

# JWT Configuration (Production)
JWT_SECRET=your_super_secure_jwt_secret_minimum_256_bits_recommended

# n8n Webhook (Production)
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chat

# Application URL (Production)
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Additional Security
NODE_ENV=production
NEXT_PUBLIC_VERCEL_ENV=production
```

### 2. Vercel Deployment

#### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Or connect your GitHub repository to Vercel for automatic deployments
```

#### Vercel Configuration (`vercel.json`)
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "pages/api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  },
  "env": {
    "NEXT_PUBLIC_BOLT_PUBLIC_KEY": "@bolt-public-key",
    "BOLT_API_KEY": "@bolt-api-key",
    "NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT": "@hasura-endpoint",
    "HASURA_GRAPHQL_ADMIN_SECRET": "@hasura-admin-secret",
    "JWT_SECRET": "@jwt-secret",
    "NEXT_PUBLIC_N8N_WEBHOOK_URL": "@n8n-webhook-url",
    "NEXT_PUBLIC_APP_URL": "@app-url"
  }
}
```

### 3. Hasura Cloud Setup

#### Create Hasura Cloud Instance
1. Go to [Hasura Cloud](https://cloud.hasura.io/)
2. Create a new project
3. Connect your PostgreSQL database
4. Set environment variables:

```bash
HASURA_GRAPHQL_DATABASE_URL=postgresql://username:password@hostname:port/database
HASURA_GRAPHQL_ENABLE_CONSOLE=true
HASURA_GRAPHQL_DEV_MODE=false
HASURA_GRAPHQL_ENABLED_LOG_TYPES=startup,http-log,webhook-log,websocket-log,query-log
HASURA_GRAPHQL_ADMIN_SECRET=your_secure_admin_secret
HASURA_GRAPHQL_JWT_SECRET={"type":"HS256","key":"your_jwt_secret"}
HASURA_GRAPHQL_CORS_DOMAIN=https://your-domain.com
```

#### Apply Database Schema
```bash
# Install Hasura CLI
npm install -g hasura-cli

# Initialize Hasura project
hasura init hasura-project

# Apply migrations
hasura migrate apply --endpoint https://your-hasura-endpoint.hasura.app

# Apply metadata
hasura metadata apply --endpoint https://your-hasura-endpoint.hasura.app
```

### 4. n8n Cloud Setup

#### Self-hosted n8n
```bash
# Docker Compose for n8n
version: '3.8'
services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD=n8n
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=secure_password
      - WEBHOOK_URL=https://your-n8n-domain.com
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - postgres

  postgres:
    image: postgres:13
    environment:
      - POSTGRES_DB=n8n
      - POSTGRES_USER=n8n
      - POSTGRES_PASSWORD=n8n
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  n8n_data:
  postgres_data:
```

### 5. Bolt Configuration

#### Production Settings
1. Log into Bolt Dashboard
2. Configure webhook endpoints:
   - User Registration: `https://your-n8n-domain.com/webhook/user-registered`
   - Email Verification: `https://your-n8n-domain.com/webhook/email-verified`
3. Set up email templates
4. Configure allowed domains for CORS

## Security Checklist

### Application Security
- [ ] Use HTTPS everywhere (enforce with redirects)
- [ ] Set secure HTTP headers (CSP, HSTS, etc.)
- [ ] Enable rate limiting on authentication endpoints
- [ ] Implement proper error handling (don't leak sensitive info)
- [ ] Use environment variables for all secrets
- [ ] Enable audit logging for authentication events

### Database Security
- [ ] Enable SSL/TLS for database connections
- [ ] Use strong passwords for database users
- [ ] Implement proper backup and recovery procedures
- [ ] Enable query logging for security monitoring
- [ ] Regular security updates for database software

### JWT Security
- [ ] Use strong, random JWT secrets (minimum 256 bits)
- [ ] Implement proper token expiration (24 hours recommended)
- [ ] Store tokens securely (httpOnly cookies for SSR if needed)
- [ ] Implement token refresh mechanism
- [ ] Add rate limiting for token refresh requests

### Infrastructure Security
- [ ] Enable firewall rules (allow only necessary ports)
- [ ] Regular security updates for all systems
- [ ] Implement monitoring and alerting
- [ ] Use secrets management service (AWS Secrets Manager, etc.)
- [ ] Enable backup and disaster recovery procedures

## Monitoring and Alerting

### Application Monitoring
```bash
# Example with Sentry for error tracking
npm install @sentry/nextjs

# sentry.client.config.js
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
```

### Security Monitoring
- Set up alerts for failed authentication attempts
- Monitor for unusual user registration patterns
- Track email verification completion rates
- Alert on database connection failures
- Monitor for JWT token manipulation attempts

## Performance Optimization

### Frontend Optimization
- [ ] Enable Next.js Image Optimization
- [ ] Implement proper caching headers
- [ ] Use CDN for static assets
- [ ] Enable compression (gzip/brotli)
- [ ] Implement proper code splitting

### Database Optimization
- [ ] Add proper database indexes
- [ ] Implement connection pooling
- [ ] Monitor query performance
- [ ] Set up read replicas if needed
- [ ] Implement database caching (Redis)

## Backup and Recovery

### Database Backups
```bash
# PostgreSQL backup script
#!/bin/bash
BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="your_database"

pg_dump -h localhost -U username $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 30 days of backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
```

### Application Backups
- Backup environment configurations
- Store deployment scripts in version control
- Document recovery procedures
- Test recovery process regularly

## SSL/TLS Configuration

### Let's Encrypt (for self-hosted)
```bash
# Install certbot
sudo apt install certbot

# Generate certificates
sudo certbot certonly --standalone -d your-domain.com

# Auto-renewal
0 12 * * * /usr/bin/certbot renew --quiet
```

### CloudFlare (Recommended)
- Use CloudFlare for DNS and SSL termination
- Enable "Full (strict)" SSL mode
- Configure Page Rules for security headers
- Enable DDoS protection

## Troubleshooting

### Common Issues
1. **JWT Token Issues**: Check secret consistency across services
2. **CORS Errors**: Verify allowed origins in all services
3. **Database Connection**: Check network connectivity and credentials
4. **Email Delivery**: Verify SMTP settings and domain reputation
5. **Webhook Failures**: Check endpoint availability and authentication

### Debug Commands
```bash
# Check service health
curl -f https://your-domain.com/api/health

# Test database connection
psql -h hostname -U username -d database -c "SELECT 1"

# Check n8n webhooks
curl -X POST https://your-n8n-domain.com/webhook/test

# Verify JWT tokens
echo "token_here" | base64 -d | jq
```