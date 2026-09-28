# ShortX - Product Roadmap

**Status:** 0/45 tasks complete
**Current Phase:** Phase 1 - Foundation

---

## Phase 1: Project Foundation & Backend Scaffolding
**Goal:** NestJS API running with DB connected, basic URL CRUD working, redirect endpoint live.

- [ ] Scaffold NestJS project in shortx-api/
- [ ] Set up PostgreSQL with Docker Compose (postgres + pgadmin)
- [ ] Create TypeORM entities: User, Url, UrlClick
- [ ] Run initial database migrations
- [ ] Implement URL module: POST /api/urls (create short URL, Base62 generation)
- [ ] Implement redirect: GET /:shortCode (302 redirect)
- [ ] Add basic validation with class-validator
- [ ] Add global error handling and exception filters
- [ ] Write unit tests for URL generation and redirect logic

---

## Phase 2: Authentication
**Goal:** Users can register, login, and their URLs are owned by them.

- [ ] Implement User entity and UsersModule
- [ ] Implement AuthModule: register, login, logout, /me endpoints
- [ ] Hash passwords with bcrypt
- [ ] Issue JWT access tokens + refresh tokens (httpOnly cookies)
- [ ] Add AuthGuard to protect /api/urls and /api/analytics
- [ ] Implement optional auth on POST /api/urls (anon users get short URLs too)
- [ ] Write auth unit tests

---

## Phase 3: Full URL Management
**Goal:** Users can view, search, paginate, delete and disable their URLs.

- [ ] GET /api/urls - paginated list with search and sort
- [ ] PATCH /api/urls/:id - toggle active, update custom alias
- [ ] DELETE /api/urls/:id - soft delete
- [ ] Add custom alias support on POST /api/urls
- [ ] Add expiration date support (expires_at field)
- [ ] Redirect checks: is_active and expires_at before redirecting

---

## Phase 4: Click Tracking & Analytics
**Goal:** Every redirect is tracked; analytics API returns click stats.

- [ ] Capture click data on redirect (url_id, ip, user_agent, referrer, country)
- [ ] GET /api/analytics/:urlId - total clicks, unique visitors, clicks today
- [ ] GET /api/analytics/:urlId/timeseries - clicks per day (last 30 days)
- [ ] GET /api/analytics/:urlId/breakdown - by country, device, browser, referrer

---

## Phase 5: Frontend (Next.js)
**Goal:** Beautiful, fully functional UI connecting to the API.

- [ ] Scaffold Next.js 14 project in shortx-ui/
- [ ] Implement design system (global CSS, color tokens, typography, components)
- [ ] Landing page: URL input form, hero, result display with copy button
- [ ] Auth pages: login and register forms with validation
- [ ] Dashboard: URL list table with search, sort, pagination, copy, delete actions
- [ ] Analytics page: total clicks, unique visitors, charts (Recharts)
- [ ] Dark/light mode toggle
- [ ] Fully responsive design

---

## Phase 6: Redis Caching
**Goal:** Redirect endpoint uses Redis cache to avoid DB on every request.

- [ ] Add Redis to Docker Compose
- [ ] Implement cache-aside on GET /:shortCode (cache hit -> redirect, miss -> DB + cache)
- [ ] Set TTL on cache entries (1 hour default)
- [ ] Cache invalidation on URL update/delete
- [ ] Add Redis metrics to logs (hit/miss ratio)

---

## Phase 7: Kafka & Async Analytics
**Goal:** Click tracking is decoupled from redirect via Kafka.

- [ ] Add Kafka (+ Zookeeper) to Docker Compose
- [ ] On redirect, emit click event to Kafka topic 'click-events' (fire and forget)
- [ ] Implement Kafka consumer (analytics worker) to persist click events to DB
- [ ] Make analytics processing idempotent using event_id UNIQUE constraint
- [ ] Handle consumer failures with retry and dead-letter topic

---

## Phase 8: Rate Limiting
**Goal:** API is protected against abuse.

- [ ] Add rate limiting middleware using Redis (sliding window)
- [ ] 100 req/min/user for POST /api/urls (authenticated)
- [ ] 10 req/min/IP for POST /api/urls (unauthenticated)
- [ ] 1000 req/min/IP for GET /:shortCode
- [ ] Return 429 Too Many Requests with Retry-After header

---

## Phase 9: Docker & Infrastructure
**Goal:** Entire stack runs with a single docker-compose up.

- [ ] Dockerfile for shortx-api (multi-stage build)
- [ ] Dockerfile for shortx-ui (multi-stage build)
- [ ] docker-compose.yml with all services: ui, api, postgres, redis, kafka, nginx
- [ ] Nginx config as reverse proxy (/ -> ui, /api -> api, /:shortCode -> api)
- [ ] Environment variable management (.env.example files)
- [ ] Health checks for all services

---

## Phase 10: Observability & Load Testing
**Goal:** System is observable and proven to handle load.

- [ ] Add Prometheus metrics endpoint (/metrics) to NestJS
- [ ] Add Grafana + Prometheus to Docker Compose
- [ ] Track: requests/sec, error rate, P95/P99 latency, Redis hit ratio, Kafka lag, DB connections
- [ ] Load test with k6: GET /:shortCode at 100/1k/10k req/sec
- [ ] Document bottlenecks found and solutions applied
