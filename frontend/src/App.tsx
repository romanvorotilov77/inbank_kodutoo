import AppShell from './components/layout/AppShell'
import LoanForm from './components/ui/LoanForm'
import LoanResult from './components/ui/LoanResult'
import ErrorMessage from './components/ui/ErrorMessage'
import { useLoanDecision } from './hooks/useLoanDecision'
import ScorePreview from './components/ui/ScorePreview'

function App() {
  const {
    form,
    setForm,
    sampleCodes,
    constraints,
    constraintsLoading,
    result,
    error,
    isLoading,
    liveScore,
    onSubmit,
  } = useLoanDecision()

  return (
    <AppShell title="Loan Decision Demo" subtitle="Simple front-end for the single API endpoint.">
      <LoanForm
        form={form}
        sampleCodes={sampleCodes}
        constraints={constraints}
        isLoading={isLoading}
        constraintsLoading={constraintsLoading}
        onSubmit={onSubmit}
        onFormChange={setForm}
      />
      <ScorePreview score={liveScore} />
      <LoanResult result={result} />
      <ErrorMessage message={error} />
    </AppShell>
  )
}

export default App

