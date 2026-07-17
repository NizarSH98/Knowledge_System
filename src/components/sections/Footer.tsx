import { footer, nav } from '../../content/copy'
import { CONTACT_EMAIL, contactMailto } from '../../config/site'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <a href="#top" className="wordmark">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2 L22 12 L12 22 L2 12 Z" stroke="currentColor" strokeWidth="1.4" />
              <path d="M12 7 L17 12 L12 17 L7 12 Z" stroke="currentColor" strokeWidth="1.1" />
              <circle cx="12" cy="12" r="1.4" fill="currentColor" />
            </svg>
            <span>
              <b>Knowledge</b> <span>Systems</span>
            </span>
          </a>
          <p className="footer-statement">{footer.statement}</p>
        </div>
        <nav aria-label="Footer">
          <h3>Navigate</h3>
          <ul>
            {nav.links.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
            <li>
              <a href="#assessment">Request Assessment</a>
            </li>
          </ul>
        </nav>
        <div>
          <h3>{footer.contactLabel}</h3>
          <ul>
            <li>
              <a href={contactMailto()}>{CONTACT_EMAIL}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Knowledge Systems</span>
        <span className="footer-tagline">{footer.positioning}</span>
        <span>{footer.demoDisclaimer}</span>
      </div>
    </footer>
  )
}
