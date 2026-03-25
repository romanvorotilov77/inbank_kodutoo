import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import type { LoanConstraints, LoanRequest, LoanResponse, SampleCode } from '../types/loan'
import { evaluateLoan, getConstraints, getPreviewScore } from '../api/loanApi'
import { DEMO_SAMPLE_CODES } from '../config/demoData'

const sampleCodes: SampleCode[] = DEMO_SAMPLE_CODES

const FALLBACK_CONSTRAINTS: LoanConstraints = {
  minAmount: 2000,
  maxAmount: 10000,
  minPeriod: 12,
  maxPeriod: 60,
}

export function useLoanDecision() {
  const [form, setForm] = useState<LoanRequest>({
    personalCode: DEMO_SAMPLE_CODES[0].personalCode,
    amount: 4000,
    loanPeriod: 24,
  })
  const [constraints, setConstraints] = useState<LoanConstraints>(FALLBACK_CONSTRAINTS)
  const [constraintsLoading, setConstraintsLoading] = useState(true)
  const [result, setResult] = useState<LoanResponse | null>(null)
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [liveScore, setLiveScore] = useState<number | null>(null)

  // Fetch constraints from API on mount
  useEffect(() => {
    let cancelled = false
    getConstraints()
      .then((data) => {
        if (!cancelled) {
          setConstraints(data)
          setConstraintsLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setConstraintsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Debounced live credit score preview
  useEffect(() => {
    if (!form.personalCode || form.amount <= 0 || form.loanPeriod <= 0) {
      setLiveScore(null)
      return
    }
    const timer = setTimeout(() => {
      getPreviewScore(form.personalCode, form.amount, form.loanPeriod)
        .then((data) => setLiveScore(data.creditScore))
        .catch(() => setLiveScore(null))
    }, 300)
    return () => clearTimeout(timer)
  }, [form.personalCode, form.amount, form.loanPeriod])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

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
      setError(
        `Loan period must be between ${constraints.minPeriod} and ${constraints.maxPeriod} months`,
      )
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
    form,
    setForm,
    sampleCodes,
    constraints,
    constraintsLoading,
    result,
    error,
    isLoading,
    liveScore,
    onSubmit,
  }
}
