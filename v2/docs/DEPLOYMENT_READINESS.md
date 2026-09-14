# Deployment readiness — customer-message revision

Review date: 14 September 2026

## Clarity gaps identified and resolved

| Previous gap | Resolution |
|---|---|
| The homepage led with three design directions instead of the company promise. | The hero now states what Knowledge Systems does and who benefits before showing any demonstration. |
| “Three complementary interaction languages” required interpretation. | The demonstrations now have plain jobs: understand relationships, work with knowledge, and preserve institutional context. |
| The product was difficult to explain in ten seconds. | A supplier-decision example near the top connects one question to five recognizable company records. |
| The information-to-agent progression was only implicit. | A five-step diagram now shows company sources → knowledge layer → AI interface → verified work → controlled agents. |
| Trust mechanisms carried too much of the headline message. | Permissions, citations, versioning, refusal, privacy, logging, and control now appear in the trust section after the value is clear. |
| The commercial engagement was vague. | Discovery → assessment → pilot → production → controlled agents is now visible, with “Assess a Knowledge Workflow” as the primary CTA. |
| Visitors could not tell what information environments were in scope. | A cautious integration-target section names common systems while explicitly avoiding unverified connector claims. |
| Theme choice interrupted the product story. | All 14 themes remain available in a display-preferences section at the end of the page. |

## Deliberately not fabricated

- No customer logos, testimonials, case-study outcomes, or performance numbers are claimed.
- No integration is described as production-tested without supporting implementation evidence.
- No agent is presented as having unrestricted organizational control.

## Final human decisions before public promotion

These are business approvals rather than implementation blockers:

1. Confirm the public contact email and whether “Assess a Knowledge Workflow” is the preferred sales terminology.
2. Confirm whether the company should use “Institutional Workspace” publicly while retaining the internal route and component name “Institutional OS.”
3. Approve the supplier-selection example as the primary demonstration narrative.
4. Add real proof—customer evidence, a named case study, or measured pilot outcomes—when it genuinely exists. The current site intentionally does not manufacture social proof.

## Technical release checks

Run from `v2/`:

```text
npm run validate:model
npm run validate:themes
npm run typecheck
npm run build
npm test
npm run verify:pages
```

Deployment remains manual and must not be triggered until the content decisions above are approved.
