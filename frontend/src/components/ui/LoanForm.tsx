import type { FormEvent } from 'react'
import type { LoanConstraints, LoanRequest, SampleCode } from '../../types/loan'
import { ui } from '../../styles/uiClasses'

type LoanFormProps = {
  form: LoanRequest
  sampleCodes: SampleCode[]
  constraints: LoanConstraints
  isLoading: boolean
  constraintsLoading: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onFormChange: (nextForm: LoanRequest) => void
}

function LoanForm({
  form,
  sampleCodes,
  constraints,
  isLoading,
  constraintsLoading,
  onSubmit,
  onFormChange,
}: LoanFormProps) {
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
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={constraints.minAmount}
            max={constraints.maxAmount}
            step={100}
            value={form.amount}
            onChange={(e) => onFormChange({ ...form, amount: Number(e.target.value) })}
            className="flex-1"
          />
          <input
            type="number"
            min={constraints.minAmount}
            max={constraints.maxAmount}
            step={1}
            value={form.amount}
            onChange={(e) => onFormChange({ ...form, amount: Number(e.target.value) })}
            className="w-28 rounded-xl border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          />
        </div>
      </label>

      <label className={ui.label}>
        Loan Period (months)
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={constraints.minPeriod}
            max={constraints.maxPeriod}
            step={1}
            value={form.loanPeriod}
            onChange={(e) => onFormChange({ ...form, loanPeriod: Number(e.target.value) })}
            className="flex-1"
          />
          <input
            type="number"
            min={constraints.minPeriod}
            max={constraints.maxPeriod}
            step={1}
            value={form.loanPeriod}
            onChange={(e) => onFormChange({ ...form, loanPeriod: Number(e.target.value) })}
            className="w-28 rounded-xl border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          />
        </div>
      </label>

      <button
        type="submit"
        disabled={isLoading || constraintsLoading}
        className={ui.buttonPrimary}
      >
        {isLoading ? 'Checking...' : 'Get Decision'}
      </button>
    </form>
  )
}

export default LoanForm