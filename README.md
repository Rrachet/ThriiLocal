# ThriiLocal

### End-to-end hiring operations platform · MERN · Product + Cloud

**ThriiLocal is the flagship product system in my portfolio.** It models a complete ticket-based hiring operation from **customer purchase → admin assignment → JD creation → analyst approval → recruiter execution → 72-hour SLA → analyst review → customer delivery**.

It is intentionally built as a **real full-stack product**, not just a landing page or UI prototype.

[![Product](https://img.shields.io/badge/Product-End--to--End-111111?style=flat-square)](#product-workflow) [![Stack](https://img.shields.io/badge/Stack-MERN-111111?style=flat-square)](#architecture) [![SLA](https://img.shields.io/badge/Recruiter%20SLA-72h-111111?style=flat-square)](#-72-hour-sla) [![Live](https://img.shields.io/badge/Live-thrii.io-111111?style=flat-square)](https://www.thrii.io/)

---

## Product workflow

```text
CUSTOMER
  │
  ├── Register / Login
  │
  └── Purchase Hiring Ticket
            │
            ▼
      SUPER ADMIN
            │
            └── Assign Analyst
                    │
                    ▼
                 ANALYST
                    │
                    ├── Review Ticket
                    └── Approve workflow
                            │
                            ▼
                         USER
                            │
                            └── Create + Submit JD
                                      │
                                      ▼
                                   ANALYST
                                      │
                                      ├── Approve JD
                                      └── Assign Recruiter
                                              │
                                              ▼
                                           RECRUITER
                                              │
                                              ├── Source candidates
                                              ├── Build shortlist
                                              └── Submit within 72h
                                                      │
                                                      ▼
                                                   ANALYST
                                                      │
                                                      ├── Review
                                                      ├── Approve / Revise
                                                      └── Deliver
                                                            │
                                                            ▼
                                                          USER
```

The critical idea is that **the ticket is the product's source of truth**. Every role sees the work they own, every transition is permission-controlled, and important actions are auditable.

---

## Why this is a serious product system

ThriiLocal combines four layers:

### 1. Commerce

Customer selects a hiring plan and purchases a ticket. Stripe Checkout can be enabled through environment configuration, while development mode supports local workflow testing.

### 2. Workflow orchestration

A ticket moves through explicit states rather than relying on informal communication:

```text
PAID
  ↓
ASSIGNED_ANALYST
  ↓
JD_SUBMITTED
  ↓
JD_APPROVED
  ↓
RECRUITER_ASSIGNED
  ↓
RECRUITER_WORKING
  ↓
RECRUITER_SUBMITTED
  ↓
ANALYST_REVIEW
  ↓
DELIVERED
  ↓
CLOSED
```

Revision paths are supported when work does not meet the required quality bar.

### 3. Human operations

The product creates clear ownership between **customer → super admin → analyst → recruiter → analyst → customer**.

### 4. Measurement

The workflow creates operational data that can be used to measure throughput, bottlenecks, SLA compliance and customer outcomes.

---

## 👥 Role-based product experience

| Role | Primary responsibility | Key surface |
|---|---|---|
| **User** | Buy tickets, create JDs, receive outcomes | Customer workspace |
| **Super Admin** | Assign, monitor, escalate | Operations control center |
| **Analyst** | Quality gate + recruiter orchestration | Analyst workbench |
| **Recruiter** | Candidate sourcing + delivery | Recruiter workspace |

Authorization is enforced server-side. The frontend is never treated as a security boundary.

---

## ⏱️ 72-hour recruiter SLA

The clock starts when an analyst assigns a recruiter.

```text
ASSIGNMENT
    │
    ├──────── 48h ────────┐
    │                     │
    │                 WARNING
    │                     │
    ├──────── 60h ────────┤
    │                     │
    │                   AT RISK
    │                     │
    ├──────── 72h ────────┤
    │                     │
    │                  BREACHED
    ▼
DELIVERY
```

The API stores `slaStartedAt` and `slaDueAt`, allowing the product to calculate SLA state from timestamps instead of relying on manually updated labels.

A production cloud deployment can run a scheduled worker to send warning and escalation notifications without requiring the dashboard to remain open.

---

## 🧾 Audit trail

Every important transition creates an audit event.

Example:

```text
10:02  Ticket purchased
10:04  Analyst assigned
10:21  JD submitted
11:05  JD approved
11:07  Recruiter assigned
11:07  72h SLA started
+48h   SLA warning
+67h   Recruiter submitted shortlist
+68h   Analyst approved
+69h   Results delivered
```

This gives operations and product teams a shared timeline for investigating delays and improving the workflow.

---

## 📊 Product analytics

The system is designed around measurable funnel and operational metrics:

| Area | Metric |
|---|---|
| Commerce | Ticket purchase conversion |
| Activation | Ticket → JD submission |
| Quality | JD revision / approval rate |
| Operations | Time to analyst assignment |
| Recruiting | Time to recruiter assignment |
| SLA | % recruiter submissions within 72h |
| Output | Candidates submitted per ticket |
| Delivery | Time to first shortlist |
| Customer | Repeat ticket rate |

These metrics can become the foundation for future dashboards and product prioritization.

---

## 🧠 Product decisions

### Ticket-based ownership

A purchased ticket creates a durable unit of work that can be assigned, tracked, audited and measured.

### Analyst as quality gate

The analyst separates customer requirements from recruiter execution, reducing the chance that an unclear JD reaches the recruiting workflow.

### SLA as a product primitive

Recruiter turnaround is a customer promise, so the deadline is represented as actual system data and exposed to operations.

### Explicit state machine

Making states and transitions explicit reduces ambiguity, improves reporting and makes automation possible.

### Closed-loop delivery

The recruiter does not directly become the final customer interface. The analyst reviews the output before delivery, creating a quality-control layer.

---

## 🏗️ Architecture

```text
                    THRIILOCAL
                         │
          ┌──────────────┴──────────────┐
          │                             │
      React Client                  Express API
          │                             │
      Role-based UI                JWT + RBAC
          │                             │
          └──────────────┬──────────────┘
                         │
                      MongoDB
                         │
             ┌───────────┼───────────┐
             │           │           │
           Users       Tickets    AuditLogs
             │           │           │
             └───────────┼───────────┘
                         │
                 Workflow / SLA
                         │
              ┌──────────┴──────────┐
              │                     │
           Stripe               Cloud ops
          Checkout          CI/CD · health · logs
```

### Stack

**Frontend:** React + TypeScript + Vite  
**Backend:** Node.js + Express  
**Database:** MongoDB + Mongoose  
**Authentication:** JWT + bcrypt  
**Payments:** Stripe Checkout integration  
**Product analytics:** workflow events + audit trail  
**Cloud:** environment-based deployment, health checks and CI/CD-ready structure

---

## ☁️ Cloud / operations layer

The backend exposes a health endpoint:

```text
GET /health
```

and is structured for cloud deployment with:

- environment-based secrets
- MongoDB connection configuration
- production/client origin configuration
- health checks
- deployment-safe configuration
- API logging hooks
- Stripe secret isolation
- CI validation

The goal is to demonstrate that a product continues to matter **after it has been deployed**.

---

## 🔐 Security model

- Passwords are hashed with bcrypt.
- JWTs carry role claims.
- Role-based middleware protects workflow transitions.
- Ticket ownership is checked server-side.
- Secrets belong in environment variables.
- Private Thrii systems and credentials are not committed.

---

## 📁 Repository structure

```text
client/                  React product interface
server/
  src/
    models.js            MongoDB models
    server.js            API + workflow orchestration
docs/
  product-system.md      Product lifecycle + state machine
  api-contract.md        Backend contract
.github/workflows/       CI / automation
```

---

## 🚀 Run locally

### Frontend

```bash
npm install
npm run dev
```

### API

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Default API port: `4000`.

See [`docs/product-system.md`](docs/product-system.md) for the full workflow and [`docs/api-contract.md`](docs/api-contract.md) for the API surface.

---

## Portfolio role

**FLAGSHIP — Product Management + Full-Stack + Cloud case study**

ThriiLocal demonstrates the complete product loop:

**Customer problem → commercial model → workflow design → requirements → engineering → operations → SLA → analytics → product improvement.**

This is the project I would use to discuss **product ownership, technical judgment, prioritization, customer workflows, metrics and execution** in a PM interview.

## About the builder

I currently work as a **Product Analyst at Thrii**, working across product analysis, workflows, product experience and go-to-market/product positioning. I have also worked on product listing and positioning across G2, Product Hunt and Microsoft Azure ecosystem surfaces.
