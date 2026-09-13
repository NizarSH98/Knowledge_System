import type { DirectionId } from '../../directions/registry.ts'

export function ConceptPreview({ directionId }: { readonly directionId: DirectionId }) {
  if (directionId === 'observatory') {
    return (
      <svg viewBox="0 0 320 160" role="img" aria-label="Spatial clusters connected across semantic scales">
        <circle className="preview-line" cx="160" cy="80" r="52" />
        <circle className="preview-line preview-line--faint" cx="160" cy="80" r="27" />
        <path className="preview-line" d="M45 112 C92 74 115 91 160 80 S235 40 278 58" />
        <circle className="preview-fill" cx="45" cy="112" r="6" />
        <circle className="preview-fill" cx="160" cy="80" r="10" />
        <circle className="preview-fill" cx="278" cy="58" r="6" />
        <circle className="preview-fill preview-fill--muted" cx="204" cy="113" r="4" />
      </svg>
    )
  }

  if (directionId === 'institutional-os') {
    return (
      <svg viewBox="0 0 320 160" role="img" aria-label="A structured answer workspace with navigation, claims, and provenance">
        <rect className="preview-line" x="34" y="28" width="252" height="104" rx="2" />
        <path className="preview-line" d="M94 28v104M228 28v104M34 52h252" />
        <path className="preview-line preview-line--faint" d="M107 69h92M107 82h107M107 95h83M241 70h29M241 83h22M48 68h29M48 81h36M48 94h25" />
        <rect className="preview-fill" x="107" y="108" width="60" height="7" rx="2" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 320 160" role="img" aria-label="Layered institutional records gathering into an evidence dossier">
      <path className="preview-line preview-line--faint" d="M65 35h120v88H65z" />
      <path className="preview-line" d="M99 24h128v96H99z" />
      <path className="preview-line" d="M133 40h122v92H133z" />
      <path className="preview-line preview-line--faint" d="M148 61h66M148 76h91M148 91h74" />
      <circle className="preview-fill" cx="238" cy="112" r="8" />
    </svg>
  )
}
