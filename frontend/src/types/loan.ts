export type LoanRequest = {
  personalCode: string
  amount: number
  loanPeriod: number
}

export type LoanResponse = {
  isApproved: boolean
  approvedAmount: number | null
  approvedPeriod: number | null
  approvedCreditScore: number | null
}

export type SampleCode = {
  personalCode: string
  label: string
}

export type LoanConstraints = {
  minAmount: number
  maxAmount: number
  minPeriod: number
  maxPeriod: number
}

export type PreviewResponse = {
  creditScore: number | null
}
