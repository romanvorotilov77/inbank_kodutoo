# Inbank Test Task

## Overview
This repository contains a loan decision demo with:
- Backend: ASP.NET Core Web API (.NET 9)
- Frontend: React + TypeScript + Vite + Tailwind CSS

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/loan/decision` | Evaluate a loan application |
| `GET` | `/api/loan/constraints` | Return min/max amount and period |
| `GET` | `/api/loan/preview?personalCode=&amount=&period=` | Return live credit score for current inputs |

### POST /api/loan/decision

**Input**
```json
{ "personalCode": "49002010987", "amount": 5000, "loanPeriod": 24 }
```

**Output**
```json
{
  "isApproved": true,
  "approvedAmount": 7200,
  "approvedPeriod": null,
  "approvedCreditScore": 1.0
}
```

- `approvedAmount` — null when rejected, otherwise the maximum approvable amount
- `approvedPeriod` — null when the requested period was used; set to the shortest alternative period when the engine had to extend it
- `approvedCreditScore` — null when rejected

## Scenarios Supported
- `49002010965` → debt (always rejected)
- `49002010976` → segment 1 (`credit_modifier = 100`)
- `49002010987` → segment 2 (`credit_modifier = 300`)
- `49002010998` → segment 3 (`credit_modifier = 1000`)

## Decision Logic
Implementation: `backend/Services/DecisionEngine.cs`

Rules:
- If user has debt: reject
- Validate amount (2000–10000 €) and period (12–60 months)
- Maximum approvable amount is computed directly: `max = min(creditModifier × period, 10000)`
- A sum is approvable when `credit_score = (creditModifier / amount) × period ≥ 1`
- If no amount is approvable for the requested period, the engine tries increasing periods until it finds the shortest one that works

## Running

```bash
# Backend (http://localhost:5180)
dotnet run --project backend

# Frontend (http://localhost:5173)
cd frontend && npm install && npm run dev

# Tests
dotnet test

# Frontend tests (Vitest)
cd frontend && npm run test
```

Frontend dev server proxies `/api` calls to the backend on port 5180.

## Thought Process
- `DecisionEngine` holds all business logic; `UserService` holds mock user data — separated so each has one reason to change
- Algorithm uses direct math (`amount ≤ creditModifier × period`) instead of iterating — O(1) per evaluation
- `approvedPeriod` is returned so the frontend can communicate clearly when the engine extended the period
- Loan constraints are served from `GET /api/loan/constraints` so the frontend has a single source of truth and doesn't duplicate business rules
- `GET /api/loan/preview` powers real-time credit score feedback as the user adjusts sliders, using a 300 ms debounce
- Services are registered as singletons — both are stateless (no per-request state, no DB)

## One Improvement to the Assignment
One thing I would improve is clarifying expected behavior when no amount is suitable in the selected period but suitable amounts exist in other periods.

How I would improve it:
- Add 2–3 explicit acceptance examples with concrete input/output pairs for edge cases
- State whether the engine should prioritise the highest approvable amount overall, the closest amount to the requested sum, or the shortest/longest acceptable period

This would reduce interpretation differences and make evaluation more objective.
