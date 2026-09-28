# ShortX - Product Requirements Document

## Overview
ShortX is a production-style URL shortening platform built as a learning project for system design, distributed systems, and modern full-stack engineering.

## Tech Stack
- Frontend: Next.js 14 (App Router) + TypeScript
- Backend: NestJS + TypeScript
- Primary Database: PostgreSQL
- Cache: Redis
- Message Queue: Kafka
- Reverse Proxy: Nginx
- Containerization: Docker + Docker Compose
- Monitoring: Prometheus + Grafana

## Database Schema

### users
- id UUID PK
- name VARCHAR(255)
- email VARCHAR(255) UNIQUE
- password_hash VARCHAR(255)
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

### urls
- id UUID PK
- user_id UUID FK -> users
- original_url TEXT
- short_code VARCHAR(20) UNIQUE
- custom_alias VARCHAR(100) UNIQUE
- created_at TIMESTAMPTZ
- expires_at TIMESTAMPTZ
- is_active BOOLEAN

Indexes: short_code, user_id, created_at

### url_clicks
- id UUID PK
- url_id UUID FK -> urls
- ip_address INET
- user_agent TEXT
- referrer TEXT
- country VARCHAR(10)
- created_at TIMESTAMPTZ

Indexes: url_id, created_at

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

### URLs
- POST /api/urls (auth required)
- GET /api/urls (auth required, paginated)
- GET /api/urls/:id
- PATCH /api/urls/:id
- DELETE /api/urls/:id

### Redirect
- GET /:shortCode (public, high traffic)

### Analytics
- GET /api/analytics/:urlId
- GET /api/analytics/summary

## Short Code Generation
- Random Base62 (a-z, A-Z, 0-9), 6 characters
- Collision check against DB before saving

## Authentication
- JWT-based (httpOnly cookies)
- Access token: 15min TTL
- Refresh token: 7 day TTL
- bcrypt password hashing (12 rounds)

## Frontend Pages
1. Landing page (/) - URL shortener form
2. Auth pages (/login, /register)
3. Dashboard (/dashboard) - user URLs list
4. Analytics (/dashboard/analytics/:shortCode)
5. 404 / Expired pages
