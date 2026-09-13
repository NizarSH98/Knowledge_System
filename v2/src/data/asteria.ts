import type { KnowledgeModel } from '../knowledge-model/types.ts'
import { decisions } from './decisions.ts'
import { documents } from './documents.ts'
import { meetings } from './meetings.ts'
import { departments, organization, repositories } from './organization.ts'
import { people } from './people.ts'
import { identities, permissionGroups } from './permissions.ts'
import { projects } from './projects.ts'
import { queries } from './queries.ts'
import { relationships } from './relationships.ts'
import { suppliers } from './suppliers.ts'

export const asteriaKnowledgeModel: KnowledgeModel = {
  organization,
  departments,
  permissionGroups,
  identities,
  people,
  projects,
  repositories,
  documents,
  meetings,
  decisions,
  suppliers,
  relationships,
  queries,
}
