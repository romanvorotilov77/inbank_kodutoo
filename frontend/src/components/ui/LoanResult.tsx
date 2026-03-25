import type { LoanResponse } from '../../types/loan'
import { ui } from '../../styles/uiClasses'

type LoanResultProps = {
  result: LoanResponse | null
}

function LoanResult({ result }: LoanResultProps) {
  if (!result) return null

  const statusClasses = result.isApproved ? ui.resultApproved : ui.resultRejected

  return (
    <div className={`${ui.resultBase} ${statusClasses}`}>
      <div>Decision: {result.isApproved ? 'Approved' : 'Rejected'}</div>
      {result.isApproved && result.approvedAmount !== null && (
        <div className={ui.resultRow}>
          Approved Amount: {result.approvedAmount} EUR
          {result.approvedPeriod !== null && (
            <span> — for a period of {result.approvedPeriod} months</span>
          )}
        </div>
      )}
    </div>
  )
}

export default LoanResult
