import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, beforeEach, vi } from 'vitest'
import { useLoanDecision } from './useLoanDecision'
import { evaluateLoan, getConstraints, getPreviewScore } from '../api/loanApi'

vi.mock('../api/loanApi', () => ({
  evaluateLoan: vi.fn(),
  getConstraints: vi.fn(),
  getPreviewScore: vi.fn(),
}))

const mockedEvaluateLoan = vi.mocked(evaluateLoan)
const mockedGetConstraints = vi.mocked(getConstraints)
const mockedGetPreviewScore = vi.mocked(getPreviewScore)

describe('useLoanDecision', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockedGetConstraints.mockResolvedValue({
      minAmount: 2000,
      maxAmount: 10000,
      minPeriod: 12,
      maxPeriod: 60,
    })
    mockedGetPreviewScore.mockResolvedValue({ creditScore: 1.1 })
    mockedEvaluateLoan.mockResolvedValue({
      isApproved: true,
      approvedAmount: 4000,
      approvedPeriod: null,
      approvedCreditScore: 2.4,
    })
  })

  it('loads constraints on mount', async () => {
    const { result } = renderHook(() => useLoanDecision())

    await waitFor(() => {
      expect(result.current.constraintsLoading).toBe(false)
    })

    expect(mockedGetConstraints).toHaveBeenCalledTimes(1)
    expect(result.current.constraints).toEqual({
      minAmount: 2000,
      maxAmount: 10000,
      minPeriod: 12,
      maxPeriod: 60,
    })
  })

  it('shows validation error for non-integer amount and does not call API', async () => {
    const { result } = renderHook(() => useLoanDecision())

    await waitFor(() => {
      expect(result.current.constraintsLoading).toBe(false)
    })

    act(() => {
      result.current.setForm((prev) => ({ ...prev, amount: 2500.5 }))
    })

    await act(async () => {
      await result.current.onSubmit({ preventDefault: vi.fn() } as never)
    })

    expect(result.current.error).toBe('Loan amount must be a whole number in EUR')
    expect(mockedEvaluateLoan).not.toHaveBeenCalled()
  })
})
