import type { LoanResponse } from '../types/loan'

type LoanResultProps = {
  result: LoanResponse | null
}

function LoanResult({ result }: LoanResultProps) {
  if (!result) {
    return null
  }

  return (
    <div className={`result ${result.isApproved ? 'approved' : 'rejected'}`}>
      <div>Decision: {result.isApproved ? 'Approved' : 'Rejected'}</div>
      <div>Approved Amount: {result.approvedAmount} EUR</div>
    </div>
  )
}

export default LoanResult
