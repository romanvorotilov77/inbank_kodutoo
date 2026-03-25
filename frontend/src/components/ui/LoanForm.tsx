import type { FormEvent } from 'react'
import type { LoanConstraints, LoanRequest, SampleCode } from '../../types/loan'
import { ui } from '../../styles/uiClasses'

type LoanFormProps = {
  form: LoanRequest
  sampleCodes: SampleCode[]
  constraints: LoanConstraints
  isLoading: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onFormChange: (nextForm: LoanRequest) => void
}

function LoanForm({ form, sampleCodes, constraints, isLoading, onSubmit, onFormChange }: LoanFormProps) {
  return (
    <form onSubmit={onSubmit} noValidate className={ui.form}>
      <label className={ui.label}>
        Personal Code
        <select
          className={ui.control}
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

      <label className={ui.label}>
        Loan Amount (EUR)
        <input
          className={ui.control}
          type="number"
          min={constraints.minAmount}
          max={constraints.maxAmount}
          step={1}
          value={form.amount}
          onChange={(e) => onFormChange({ ...form, amount: Number(e.target.value) })}
        />
      </label>

      <label className={ui.label}>
        Loan Period (months)
        <input
          className={ui.control}
          type="number"
          min={constraints.minPeriod}
          max={constraints.maxPeriod}
          value={form.loanPeriod}
          onChange={(e) => onFormChange({ ...form, loanPeriod: Number(e.target.value) })}
        />
      </label>

      <button type="submit" disabled={isLoading} className={ui.buttonPrimary}>
        {isLoading ? 'Checking...' : 'Get Decision'}
      </button>
    </form>
  )
}

export default LoanForm
