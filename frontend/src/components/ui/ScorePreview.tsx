import { ui } from '../../styles/uiClasses'

type ScorePreviewProps = {
  score: number | null
}

function ScorePreview({ score }: ScorePreviewProps) {
  if (score === null) return null

  const isViable = score >= 1.0

  return (
    <div className={ui.scorePreview}>
      Live credit score: {score.toFixed(3)} {isViable ? '✅' : '❌'}
    </div>
  )
}

export default ScorePreview
