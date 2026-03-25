import type { ReactNode } from 'react'
import { ui } from '../../styles/uiClasses'

type AppShellProps = {
  title: string
  subtitle: string
  children: ReactNode
}

function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <main className={ui.page}>
      <section className={ui.card}>
        <h1 className={ui.title}>{title}</h1>
        <p className={ui.subtitle}>{subtitle}</p>
        {children}
      </section>
    </main>
  )
}

export default AppShell
