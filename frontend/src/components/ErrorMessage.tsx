type ErrorMessageProps = {
  message: string
}

function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) {
    return null
  }

  return <div className="error">Error: {message}</div>
}

export default ErrorMessage
