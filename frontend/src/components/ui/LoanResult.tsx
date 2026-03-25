import type { LoanResponse } from '../../types/loan'
import { ui } from '../../styles/uiClasses'

type LoanResultProps = {
  result: LoanResponse | null
}

function LoanResult({ result }: LoanResultProps) {
  if (!result) {
    return null
  }

  const statusClasses = result.isApproved ? ui.resultApproved : ui.resultRejected

  return (
    <div className={`${ui.resultBase} ${statusClasses}`}>
      <div>Decision: {result.isApproved ? 'Approved' : 'Rejected'}</div>
      <div className="mt-1">Approved Amount: {result.approvedAmount} EUR</div>
    </div>
  )
}

export default LoanResult
