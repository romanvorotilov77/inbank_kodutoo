import type { LoanConstraints, SampleCode } from '../types/loan'

export const DEMO_SAMPLE_CODES: SampleCode[] = [
  { personalCode: '49002010965', label: '49002010965 (debt)' },
  { personalCode: '49002010976', label: '49002010976 (segment 1, 100)' },
  { personalCode: '49002010987', label: '49002010987 (segment 2, 300)' },
  { personalCode: '49002010998', label: '49002010998 (segment 3, 1000)' },
]

export const DEMO_LOAN_CONSTRAINTS: LoanConstraints = {
  minAmount: 2000,
  maxAmount: 10000,
  minPeriod: 12,
  maxPeriod: 60,
}
