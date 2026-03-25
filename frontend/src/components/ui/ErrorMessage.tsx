import { ui } from '../../styles/uiClasses'

type ErrorMessageProps = {
  message: string
}

function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) {
    return null
  }

  return <div className={ui.error}>Error: {message}</div>
}

export default ErrorMessage
