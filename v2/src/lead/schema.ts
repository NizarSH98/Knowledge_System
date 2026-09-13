export const INTEREST_OPTIONS = [
  'Using Knowledge Systems in my organization',
  'Offering Knowledge Systems to clients',
  'Referral / partnership',
  'Exploring the technology',
  'Other',
] as const

export type LeadInterest = (typeof INTEREST_OPTIONS)[number]

export interface LeadSubmission {
  readonly fullName: string
  readonly workEmail: string
  readonly company: string
  readonly role: string
  readonly interest: LeadInterest
  readonly problem: string
  readonly websiteOrLinkedIn: string
  readonly source: string | null
}

export interface LeadValidationResult {
  readonly valid: boolean
  readonly errors: Readonly<Partial<Record<keyof LeadSubmission, string>>>
}
