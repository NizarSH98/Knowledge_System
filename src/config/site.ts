/**
 * ─── DEPLOYMENT CONFIGURATION ─────────────────────────────────────────────
 * Public production identity used by contact actions and metadata.
 */

export const CONTACT_EMAIL = 'jabernizar98@gmail.com'

/** GitHub Pages project URL. */
export const SITE_URL = 'https://nizarsh98.github.io/Knowledge_System/'

/* ─────────────────────────────────────────────────────────────────────────── */

export const MAIL_SUBJECT = 'Knowledge Systems Assessment Enquiry'

export const MAIL_BODY = [
  'Hello,',
  '',
  'We would like to arrange a Knowledge Assessment.',
  '',
  'Organization:',
  'Approximate team size:',
  'Main knowledge repositories (e.g. shared drives, wikis, project tools):',
  'The workflow where better retrieval would matter most:',
  '',
  'Regards,',
].join('\n')

export const assessmentMailto = (): string =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(MAIL_SUBJECT)}&body=${encodeURIComponent(MAIL_BODY)}`

export const contactMailto = (): string =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(MAIL_SUBJECT)}`
