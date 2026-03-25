import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { LoanRequest, LoanResponse, SampleCode } from './types/loan'
import LoanForm from './components/LoanForm'
import LoanResult from './components/LoanResult'
import ErrorMessage from './components/ErrorMessage'

function App() {
  const [form, setForm] = useState<LoanRequest>({
    personalCode: '',
    amount: 4000,
    loanPeriod: 24,
  })
  const [sampleCodes, setSampleCodes] = useState<SampleCode[]>([])
  const [result, setResult] = useState<LoanResponse | null>(null)
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const endpoint = useMemo(() => '/api/loan/decision', [])
  const sampleCodesEndpoint = useMemo(() => '/api/loan/sample-codes', [])

  useEffect(() => {
    async function loadSampleCodes() {
      try {
        const response = await fetch(sampleCodesEndpoint)
        if (!response.ok) {
          throw new Error(`Failed to load sample codes (${response.status})`)
        }

        const data = (await response.json()) as SampleCode[]
        setSampleCodes(data)

        if (data.length > 0) {
          setForm((prev) => ({ ...prev, personalCode: data[0].personalCode }))
        }
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load sample data')
      }
    }

    void loadSampleCodes()
  }, [sampleCodesEndpoint])

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
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || `Request failed with status ${response.status}`)
      }

      const data = (await response.json()) as LoanResponse
      setResult(data)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unexpected error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="page">
      <section className="card">
        <h1>Loan Decision Demo</h1>
        <p className="subtitle">Simple front-end for the single API endpoint.</p>

        <LoanForm
          form={form}
          sampleCodes={sampleCodes}
          isLoading={isLoading}
          onSubmit={onSubmit}
          onFormChange={setForm}
        />

        <div className="endpoint">Endpoint: {endpoint}</div>

        <LoanResult result={result} />
        <ErrorMessage message={error} />
      </section>
    </main>
  )
}

export default App
