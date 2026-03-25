export const ui = {
  page: 'min-h-screen bg-[radial-gradient(circle_at_top,#f9fcff_0%,#e9f2fb_45%,#d6e6f5_100%)] px-4 py-10',
  card: 'mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,30,60,0.15)] sm:p-8',
  title: 'text-3xl font-bold tracking-tight text-slate-900',
  subtitle: 'mt-2 text-sm text-slate-600',
  endpoint: 'mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600',
  form: 'mt-5 grid gap-4',
  label: 'grid gap-1.5 text-sm font-semibold text-slate-800',
  control:
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100',
  buttonPrimary:
    'mt-1 w-full rounded-xl bg-blue-700 px-4 py-2.5 text-base font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60',
  resultBase: 'mt-4 rounded-xl border px-4 py-3 font-semibold',
  resultApproved: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  resultRejected: 'border-rose-300 bg-rose-50 text-rose-900',
  error: 'mt-4 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 font-medium text-rose-900',
} as const
