# Auth + CRM Microservices

## Overview
This project is a microservices-based system consisting of an **Auth Service** and a **CRM Service**.
The Auth Service handles authentication and authorization, while the CRM Service stores login events
and provides analytics.

---

## Tech Stack
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- Redis
- Docker & Docker Compose

---

## Services
- **Auth Service**
  - JWT Authentication
  - Refresh Token Rotation
  - Role-Based Access Control (RBAC)
  - Redis caching

- **CRM Service**
  - Webhook-based login event ingestion
  - Login history storage
  - Analytics & statistics APIs

- **Admin Frontend**
  - React-based dashboard for viewing logs and stats

---

## Run Project (Docker)
```bash
docker-compose up --build
