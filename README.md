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









Postman Collections
Auth Service APIs
https://authservice-4740.postman.co/workspace/Assignmnent-testing~e986c1cf-06f6-43b6-8f81-975e42cd7c1b/collection/24447805-9ec32662-2554-4b11-9833-34b0e510f19d?action=share&creator=24447805

CRM Service APIs

https://authservice-4740.postman.co/workspace/Assignmnent-testing~e986c1cf-06f6-43b6-8f81-975e42cd7c1b/collection/24447805-2e2d5ac7-189b-408d-8203-984eda982b59?action=share&creator=24447805


Features

JWT-based authentication

Refresh token rotation & logout handling

Role-based protected APIs

Auth → CRM secure webhook communication

Login history & analytics

Dockerized microservices setup



