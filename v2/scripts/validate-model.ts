import { asteriaKnowledgeModel } from '../src/data/asteria.ts'
import { CANONICAL_QUESTION, UNSUPPORTED_QUESTION } from '../src/data/queries.ts'
import { validateKnowledgeModel } from '../src/knowledge-model/validate.ts'

const report = validateKnowledgeModel(
  asteriaKnowledgeModel,
  CANONICAL_QUESTION,
  UNSUPPORTED_QUESTION,
)

if (report.errors.length > 0) {
  throw new Error(`Knowledge model validation failed:\n${report.errors.join('\n')}`)
}

console.log(JSON.stringify(report, null, 2))
