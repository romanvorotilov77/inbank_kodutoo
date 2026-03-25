export type LoanRequest = {
  personalCode: string
  amount: number
  loanPeriod: number
}

export type LoanResponse = {
  isApproved: boolean
  approvedAmount: number
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
