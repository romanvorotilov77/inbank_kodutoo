import AppShell from './components/layout/AppShell'
import LoanForm from './components/ui/LoanForm'
import LoanResult from './components/ui/LoanResult'
import ErrorMessage from './components/ui/ErrorMessage'
import { useLoanDecision } from './hooks/useLoanDecision'
import { ui } from './styles/uiClasses'

function App() {
  const { endpoint, form, setForm, sampleCodes, constraints, result, error, isLoading, onSubmit } =
    useLoanDecision()

  return (
    <AppShell title="Loan Decision Demo" subtitle="Simple front-end for the single API endpoint.">

      <LoanForm
        form={form}
        sampleCodes={sampleCodes}
        constraints={constraints}
        isLoading={isLoading}
        onSubmit={onSubmit}
        onFormChange={setForm}
      />

      <div className={ui.endpoint}>Endpoint: {endpoint}</div>

      <LoanResult result={result} />
      <ErrorMessage message={error} />
    </AppShell>
  )
}

export default App
