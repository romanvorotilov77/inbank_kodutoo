import type { LoanConstraints, LoanRequest, LoanResponse, PreviewResponse } from '../types/loan'

const DECISION_ENDPOINT = '/api/loan/decision'
const CONSTRAINTS_ENDPOINT = '/api/loan/constraints'
const PREVIEW_ENDPOINT = '/api/loan/preview'

export async function evaluateLoan(request: LoanRequest): Promise<LoanResponse> {
  const response = await fetch(DECISION_ENDPOINT, {
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

export async function getConstraints(): Promise<LoanConstraints> {
  const response = await fetch(CONSTRAINTS_ENDPOINT)

  if (!response.ok) {
    throw new Error(`Failed to load constraints: ${response.status}`)
  }

  return (await response.json()) as LoanConstraints
}

export async function getPreviewScore(
  personalCode: string,
  amount: number,
  period: number,
): Promise<PreviewResponse> {
  const params = new URLSearchParams({
    personalCode,
    amount: String(amount),
    period: String(period),
  })
  const response = await fetch(`${PREVIEW_ENDPOINT}?${params}`)

  if (!response.ok) {
    throw new Error(`Preview failed: ${response.status}`)
  }

  return (await response.json()) as PreviewResponse
}
