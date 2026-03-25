import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { LoanRequest, LoanResponse, SampleCode } from './types/loan'

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

        <form onSubmit={onSubmit} className="form">
          <label>
            Personal Code
            <select
              value={form.personalCode}
              onChange={(e) => setForm({ ...form, personalCode: e.target.value })}
            >
              <option value="" disabled>
                Select a sample code
              </option>
              {sampleCodes.map((item) => (
                <option key={item.personalCode} value={item.personalCode}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Loan Amount (EUR)
            <input
              type="number"
              min={2000}
              max={10000}
              step={100}
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            />
          </label>

          <label>
            Loan Period (months)
            <input
              type="number"
              min={12}
              max={60}
              value={form.loanPeriod}
              onChange={(e) => setForm({ ...form, loanPeriod: Number(e.target.value) })}
            />
          </label>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Checking...' : 'Get Decision'}
          </button>
        </form>

        <div className="endpoint">Endpoint: {endpoint}</div>

        {result && (
          <div className={`result ${result.isApproved ? 'approved' : 'rejected'}`}>
            <div>Decision: {result.isApproved ? 'Approved' : 'Rejected'}</div>
            <div>Approved Amount: {result.approvedAmount} EUR</div>
          </div>
        )}

        {error && <div className="error">Error: {error}</div>}
      </section>
    </main>
  )
}

export default App
