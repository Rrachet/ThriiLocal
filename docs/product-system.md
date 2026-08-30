# ThriiLocal — End-to-End Product System

## Product promise

ThriiLocal turns a purchased hiring ticket into a managed hiring workflow with clear ownership, approval gates, recruiter execution and a 72-hour delivery SLA.

## Core lifecycle

```text
1. USER
   Register / Login

2. COMMERCE
   Select plan → Checkout → Ticket created

3. SUPER ADMIN
   Validate payment → Assign Analyst

4. USER
   Create Job Description → Submit

5. ANALYST
   Review JD → Approve / Revision

6. ANALYST
   Assign Recruiter
   → 72-hour SLA begins

7. RECRUITER
   Source → qualify → shortlist → submit

8. ANALYST
   Review recruiter output → approve / revision

9. USER
   Receive shortlist and outcome

10. SYSTEM
    Audit event → analytics → learning
```

## State machine

```text
PAID
  ↓
ASSIGNED_ANALYST
  ↓
JD_SUBMITTED ←→ REVISION
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

Every meaningful transition should be permission-checked and written to the audit trail.

## Roles

### User
Owns purchased tickets, submits JDs and consumes the final recruiter output.

### Super Admin
Owns operational control: users, tickets, assignments, escalations, SLA visibility and system analytics.

### Analyst
Owns JD quality, recruiter assignment, recruiter-output review and final delivery.

### Recruiter
Owns candidate sourcing and submission against an approved JD and SLA.

## 72-hour SLA

The SLA starts **when the analyst assigns the recruiter**, not when the ticket is purchased.

- 0–48h: on track
- 48–60h: watch
- 60–72h: at risk
- >72h: breached

A production implementation should run a scheduled worker that emits warning/escalation notifications without requiring a user to open the dashboard.

## Product analytics

Track at minimum:

- ticket purchase conversion
- JD completion rate
- JD revision rate
- analyst approval time
- recruiter assignment time
- recruiter SLA compliance
- candidate submission count
- analyst review time
- time to first shortlist
- delivery completion rate
- repeat ticket rate

## Product-quality principles

1. **One source of truth:** ticket state is server-owned.
2. **Least privilege:** every transition is role-gated.
3. **Traceability:** every important state change creates an audit event.
4. **SLA is operational data:** deadlines are timestamps, not labels.
5. **Failure is designed:** payment, auth, assignment, submission and delivery failures have explicit states.
6. **Metrics drive prioritization:** recurring workflow friction becomes a product input.
