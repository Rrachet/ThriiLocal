# ThriiLocal API Contract

Base URL: `/api`

## Authentication

- `POST /auth/register`
- `POST /auth/login`
- `GET /me`

Bearer JWT is required for protected endpoints.

## Commerce

- `POST /tickets/checkout`
  - user selects `single | growth | scale`
  - Stripe Checkout is used when `STRIPE_SECRET_KEY` exists
  - development mode can create a ticket directly for local testing

## User workflow

- `GET /tickets`
- `GET /tickets/:id`
- `POST /tickets/:id/jd`

## Super Admin

- `POST /admin/tickets/:id/assign-analyst`
- `GET /admin/analytics`

## Analyst

- `POST /analyst/tickets/:id/approve-jd`
- `POST /analyst/tickets/:id/assign-recruiter`
- `POST /analyst/tickets/:id/deliver`

## Recruiter

- `POST /recruiter/tickets/:id/submit`

## Security model

The server owns role and ticket ownership checks. The frontend must never be treated as an authorization boundary.
