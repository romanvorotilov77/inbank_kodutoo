import type { FormEvent } from 'react'
import type { LoanRequest, SampleCode } from '../types/loan'

type LoanFormProps = {
  form: LoanRequest
  sampleCodes: SampleCode[]
  isLoading: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onFormChange: (nextForm: LoanRequest) => void
}

function LoanForm({ form, sampleCodes, isLoading, onSubmit, onFormChange }: LoanFormProps) {
  return (
    <form onSubmit={onSubmit} className="form">
      <label>
        Personal Code
        <select
          value={form.personalCode}
          onChange={(e) => onFormChange({ ...form, personalCode: e.target.value })}
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
          onChange={(e) => onFormChange({ ...form, amount: Number(e.target.value) })}
        />
      </label>

      <label>
        Loan Period (months)
        <input
          type="number"
          min={12}
          max={60}
          value={form.loanPeriod}
          onChange={(e) => onFormChange({ ...form, loanPeriod: Number(e.target.value) })}
        />
      </label>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Checking...' : 'Get Decision'}
      </button>
    </form>
  )
}

export default LoanForm
