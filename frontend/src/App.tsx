import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'

type LoanRequest = {
  personalCode: string
  amount: number
  loanPeriod: number
}

type LoanResponse = {
  isApproved: boolean
  approvedAmount: number
}

const EXAMPLE_CODES = [
  { value: '49002010965', label: '49002010965 (debt)' },
  { value: '49002010976', label: '49002010976 (segment 1, 100)' },
  { value: '49002010987', label: '49002010987 (segment 2, 300)' },
  { value: '49002010998', label: '49002010998 (segment 3, 1000)' },
]

function App() {
  const [form, setForm] = useState<LoanRequest>({
    personalCode: '49002010987',
    amount: 4000,
    loanPeriod: 24,
  })
  const [result, setResult] = useState<LoanResponse | null>(null)
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const endpoint = useMemo(() => '/api/loan/decision', [])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
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
              {EXAMPLE_CODES.map((item) => (
                <option key={item.value} value={item.value}>
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
