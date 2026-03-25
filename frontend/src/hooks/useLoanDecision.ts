import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { LoanRequest, LoanResponse, SampleCode } from '../types/loan'
import { evaluateLoan, getSampleCodes, LOAN_DECISION_ENDPOINT } from '../api/loanApi'

export function useLoanDecision() {
  const [form, setForm] = useState<LoanRequest>({
    personalCode: '',
    amount: 4000,
    loanPeriod: 24,
  })
  const [sampleCodes, setSampleCodes] = useState<SampleCode[]>([])
  const [result, setResult] = useState<LoanResponse | null>(null)
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function loadSampleCodes() {
      try {
        const data = await getSampleCodes()
        setSampleCodes(data)

        if (data.length > 0) {
          setForm((prev) => ({ ...prev, personalCode: data[0].personalCode }))
        }
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load sample data')
      }
    }

    void loadSampleCodes()
  }, [])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!form.personalCode) {
      setError('Please select a personal code')
      return
    }

    setError('')
    setResult(null)
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
    result,
    error,
    isLoading,
    onSubmit,
  }
}
