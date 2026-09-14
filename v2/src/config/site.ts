export const CONTACT_EMAIL = 'jabernizar98@gmail.com'

const assessmentBody = [
  'Hello,',
  '',
  'We would like to assess a knowledge workflow.',
  '',
  'Organization:',
  'Workflow or recurring problem:',
  'Where the relevant information currently lives:',
  'Who needs to use it:',
  '',
  'Regards,',
].join('\n')

export function assessmentMailto(): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Knowledge Workflow Assessment')}&body=${encodeURIComponent(assessmentBody)}`
}
