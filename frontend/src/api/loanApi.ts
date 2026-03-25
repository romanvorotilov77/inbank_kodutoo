import type { LoanRequest, LoanResponse } from '../types/loan'

export const LOAN_DECISION_ENDPOINT = '/api/loan/decision'

export async function evaluateLoan(request: LoanRequest): Promise<LoanResponse> {
  const response = await fetch(LOAN_DECISION_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed with status ${response.status}`)
  }

  return (await response.json()) as LoanResponse
}
