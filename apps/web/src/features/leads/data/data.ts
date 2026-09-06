import type { LeadStatus } from '@/@types'

export const leadStatusClasses = new Map<LeadStatus, string>([
  ['NEW', 'bg-sky-100/50 text-sky-900 border-sky-200'],
  ['ASSIGNED', 'bg-violet-100/50 text-violet-900 border-violet-200'],
  ['CONTACT_ATTEMPTED', 'bg-amber-100/50 text-amber-900 border-amber-200'],
  ['CONTACTED', 'bg-blue-100/50 text-blue-900 border-blue-200'],
  ['ENGAGED', 'bg-cyan-100/50 text-cyan-900 border-cyan-200'],
  ['QUALIFIED', 'bg-teal-100/50 text-teal-900 border-teal-200'],
  ['NURTURING', 'bg-indigo-100/50 text-indigo-900 border-indigo-200'],
  ['ON_HOLD', 'bg-neutral-200/60 text-neutral-900 border-neutral-300'],
  ['UNQUALIFIED', 'bg-orange-100/50 text-orange-900 border-orange-200'],
  ['DISQUALIFIED', 'bg-red-100/50 text-red-900 border-red-200'],
  ['CONVERTED', 'bg-emerald-100/50 text-emerald-900 border-emerald-200'],
  ['LOST', 'bg-stone-200/60 text-stone-900 border-stone-300'],
  ['DUPLICATE', 'bg-yellow-100/50 text-yellow-900 border-yellow-200'],
  ['INVALID', 'bg-destructive/10 text-destructive border-destructive/20'],
  ['DO_NOT_CONTACT', 'bg-rose-100/50 text-rose-900 border-rose-200'],
])
