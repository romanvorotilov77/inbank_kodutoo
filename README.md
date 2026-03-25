# Inbank Test Task

## Overview
This repository contains a loan decision demo with:
- Backend: ASP.NET Core Web API
- Frontend: React + TypeScript + Vite + Tailwind CSS

The backend exposes one API endpoint for the assignment requirement.

## Assignment Compliance
- Single API endpoint: `POST /api/loan/decision`
- Input: personal code, loan amount, loan period (months)
- Output: decision (`isApproved`) and approved amount (`approvedAmount`)
- Scenarios supported:
  - `49002010965` -> debt
  - `49002010976` -> segment 1 (`credit_modifier = 100`)
  - `49002010987` -> segment 2 (`credit_modifier = 300`)
  - `49002010998` -> segment 3 (`credit_modifier = 1000`)

## Decision Logic
Implementation location: `backend/Services/DecisionEngine.cs`

Rules:
- If user has debt: reject.
- Validate amount and period against constraints.
- Compute credit score using:

`credit score = (credit modifier / loan amount) * loan period`

- A sum is approvable when score >= 1.
- Engine returns the maximum approvable amount for the selected period.
- If no suitable amount is found in that period, engine tries alternative periods.

## Thought Process
- Kept the core logic in a dedicated service (`DecisionEngine`) to separate concerns and make behavior easier to reason about.
- Kept user segmentation/debt data in `UserService` as hardcoded mock data per task scope.
- Added frontend structure (`api`, `hooks`, `components/ui`, `components/layout`) so UI, state orchestration, and API calls stay separated.
- For strict assignment wording, frontend sample data and UI constraints are local demo constants, while backend remains the authoritative validator.

Frontend dev server is configured to proxy `/api` calls to backend.

## One Improvement to the Assignment
One thing I would improve is clarifying expected behavior when no amount is suitable in the selected period but suitable amounts exist in other periods.

How I would improve it:
- Add 2-3 explicit acceptance examples with concrete input/output pairs for edge cases.
- State whether the engine should prioritize:
  - highest approvable amount overall, or
  - closest amount to requested sum, or
  - shortest/longest acceptable period.

This would reduce interpretation differences and make evaluation more objective.
