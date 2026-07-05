# AVORA - Luxury Fashion E-commerce Platform

Premium African luxury fashion platform built with React, Node.js, MySQL, and Redis.

## Roles
- 👤 Guest — Browse only (navbar)
- 🛍 Customer — Full shopping experience (navbar)
- 🧵 Workshop — Production management (sidebar)
- 🚚 Delivery — Delivery management (sidebar)
- 👑 Administrator — Full control (sidebar)

## Demo Accounts (password: `Password123!`)
| Email | Role |
|---|---|
| admin@avora.rw | Administrator |
| customer@avora.rw | Customer |
| workshop@avora.rw | Workshop |
| delivery@avora.rw | Delivery |

## Quick Start

```bash
# 1. Copy environment file and edit values
cp .env.example .env

# 2. Start all services
docker compose up -d

# 3. Open the app
# Frontend:  http://localhost:5173
# Backend:   http://localhost:5000/api/health
# MySQL:     localhost:3307  (host port, avoids conflict with local MySQL)
# Redis:     localhost:6379
# Nginx:     http://localhost:8888  (optional reverse proxy)
```

## Environment Variables

Copy `.env.example` to `.env`. Key sections:

| Section | Keys | Notes |
|---|---|---|
| Database | `MYSQL_*`, `DATABASE_URL`, `DB_PORT` | MySQL on port 3307 by default |
| Auth | `JWT_SECRET`, `JWT_REFRESH_SECRET` | Change in production |
| Email | `MAIL_ENABLED`, `MAIL_HOST`, `MAIL_USER`, `MAIL_PASSWORD` | Set `MAIL_ENABLED=true` to activate |
| SMS | `SMS_ENABLED`, `TWILIO_*` | Set `SMS_ENABLED=true` to activate |
| Payments | `STRIPE_*`, `MTN_MOMO_*`, `AIRTEL_MONEY_*` | Payment gateway keys |
| AI | `GROQ_API_KEY`, `OPENAI_API_KEY` | Optional assistant features |

When `MAIL_ENABLED=false` or `SMS_ENABLED=false`, services log mock messages instead of sending.

## Tech Stack
- **Frontend:** React, Vite, TailwindCSS, Framer Motion, React Query
- **Backend:** Node.js, Express, Prisma ORM, JWT Auth, Redis
- **Database:** MySQL 8
- **Deployment:** Docker Compose (frontend, backend, mysql, redis, nginx)

## Project Structure
```
avora/
├── frontend/     # React app (navbar for guest/customer, sidebar for staff)
├── backend/      # Express API + Prisma
├── nginx/        # Reverse proxy config
├── database/     # MySQL init scripts
├── docker-compose.yml
└── .env.example
```
