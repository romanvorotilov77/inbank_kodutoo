import { useState } from 'react'
import type { FormEvent } from 'react'
import type { LoanConstraints, LoanRequest, LoanResponse, SampleCode } from '../types/loan'
import { evaluateLoan, LOAN_DECISION_ENDPOINT } from '../api/loanApi'
import { DEMO_LOAN_CONSTRAINTS, DEMO_SAMPLE_CODES } from '../config/demoData'

export function useLoanDecision() {
  const [form, setForm] = useState<LoanRequest>({
    personalCode: DEMO_SAMPLE_CODES[0].personalCode,
    amount: 4000,
    loanPeriod: 24,
  })
  const [sampleCodes] = useState<SampleCode[]>(DEMO_SAMPLE_CODES)
  const [constraints] = useState<LoanConstraints>(DEMO_LOAN_CONSTRAINTS)
  const [result, setResult] = useState<LoanResponse | null>(null)
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Always start a new submission cycle with a clean message state.
    setError('')
    setResult(null)

    if (!form.personalCode) {
      setError('Please select a personal code')
      return
    }

    if (!Number.isInteger(form.amount)) {
      setError('Loan amount must be a whole number in EUR')
      return
    }

    if (!Number.isInteger(form.loanPeriod)) {
      setError('Loan period must be a whole number of months')
      return
    }

    if (form.amount < constraints.minAmount || form.amount > constraints.maxAmount) {
      setError(`Loan amount must be between ${constraints.minAmount} and ${constraints.maxAmount}`)
      return
    }

    if (form.loanPeriod < constraints.minPeriod || form.loanPeriod > constraints.maxPeriod) {
      setError(`Loan period must be between ${constraints.minPeriod} and ${constraints.maxPeriod} months`)
      return
    }

    setIsLoading(true)

    try {
      const data = await evaluateLoan(form)
      setResult(data)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unexpected error')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    endpoint: LOAN_DECISION_ENDPOINT,
    form,
    setForm,
    sampleCodes,
    constraints,
    result,
    error,
    isLoading,
    onSubmit,
  }
}
