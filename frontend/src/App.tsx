import LoanForm from './components/LoanForm'
import LoanResult from './components/LoanResult'
import ErrorMessage from './components/ErrorMessage'
import { useLoanDecision } from './hooks/useLoanDecision'

function App() {
  const { endpoint, form, setForm, sampleCodes, result, error, isLoading, onSubmit } =
    useLoanDecision()

  return (
    <main className="page">
      <section className="card">
        <h1>Loan Decision Demo</h1>
        <p className="subtitle">Simple front-end for the single API endpoint.</p>

        <LoanForm
          form={form}
          sampleCodes={sampleCodes}
          isLoading={isLoading}
          onSubmit={onSubmit}
          onFormChange={setForm}
        />

        <div className="endpoint">Endpoint: {endpoint}</div>

        <LoanResult result={result} />
        <ErrorMessage message={error} />
      </section>
    </main>
  )
}

export default App
