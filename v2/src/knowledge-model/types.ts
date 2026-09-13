export type RecordStatus = 'current' | 'superseded' | 'archived'
export type SourceKind =
  | 'assessment'
  | 'contract'
  | 'decision-log'
  | 'finance'
  | 'meeting-minutes'
  | 'procedure'
  | 'project-record'
  | 'quotation'
  | 'safety'
  | 'supplier-record'

export type RelationshipPredicate =
  | 'accessible_by'
  | 'member_of'
  | 'references'
  | 'selected_for'
  | 'supported_by'
  | 'supersedes'
  | 'works_on'

export type RetrievalStatus =
  | 'supported'
  | 'partially-supported'
  | 'insufficient-permissions'
  | 'unsupported'

export interface Department {
  readonly id: string
  readonly name: string
  readonly mandate: string
}

export interface PermissionGroup {
  readonly id: string
  readonly name: string
  readonly description: string
}

export interface Identity {
  readonly id: string
  readonly label: string
  readonly role: string
  readonly permissionGroupIds: readonly string[]
}

export interface Person {
  readonly id: string
  readonly name: string
  readonly role: string
  readonly departmentId: string
  readonly projectIds: readonly string[]
  readonly permissionGroupIds: readonly string[]
}

export interface Project {
  readonly id: string
  readonly code: string
  readonly name: string
  readonly description: string
  readonly departmentIds: readonly string[]
  readonly status: 'active' | 'complete' | 'paused'
  readonly startedAt: string
  readonly completedAt?: string
}

export interface Repository {
  readonly id: string
  readonly name: string
  readonly system: string
  readonly ownerDepartmentId: string
  readonly syncCadence: string
}

export interface Passage {
  readonly id: string
  readonly text: string
  readonly locator: string
  readonly evidenceKey?: string
}

export interface DocumentRecord {
  readonly id: string
  readonly title: string
  readonly kind: SourceKind
  readonly repositoryId: string
  readonly ownerDepartmentId: string
  readonly ownerPersonId?: string
  readonly projectIds: readonly string[]
  readonly versionFamilyId: string
  readonly version: number
  readonly versionLabel: string
  readonly status: RecordStatus
  readonly supersedesId?: string
  readonly supersededById?: string
  readonly accessGroupIds: readonly string[]
  readonly createdAt: string
  readonly lastSynchronizedAt: string
  readonly passages: readonly Passage[]
}

export interface Meeting {
  readonly id: string
  readonly title: string
  readonly date: string
  readonly projectId: string
  readonly attendeeIds: readonly string[]
  readonly documentId: string
}

export interface Decision {
  readonly id: string
  readonly title: string
  readonly madeAt: string
  readonly projectId: string
  readonly outcome: string
  readonly meetingId: string
  readonly supportingDocumentIds: readonly string[]
}

export interface Supplier {
  readonly id: string
  readonly name: string
  readonly summary: string
  readonly selectedProjectIds: readonly string[]
}

export interface Relationship {
  readonly id: string
  readonly sourceId: string
  readonly predicate: RelationshipPredicate
  readonly targetId: string
}

export interface ClaimDefinition {
  readonly id: string
  readonly text: string
  readonly evidenceKeys: readonly string[]
  readonly minimumEvidenceCount: number
}

export interface QueryDefinition {
  readonly id: string
  readonly canonicalText: string
  readonly aliases: readonly string[]
  readonly keywords: readonly string[]
  readonly claims: readonly ClaimDefinition[]
  readonly minimumSupportedClaims: number
}

export interface KnowledgeModel {
  readonly organization: {
    readonly id: string
    readonly name: string
    readonly description: string
    readonly synthetic: true
  }
  readonly departments: readonly Department[]
  readonly permissionGroups: readonly PermissionGroup[]
  readonly identities: readonly Identity[]
  readonly people: readonly Person[]
  readonly projects: readonly Project[]
  readonly repositories: readonly Repository[]
  readonly documents: readonly DocumentRecord[]
  readonly meetings: readonly Meeting[]
  readonly decisions: readonly Decision[]
  readonly suppliers: readonly Supplier[]
  readonly relationships: readonly Relationship[]
  readonly queries: readonly QueryDefinition[]
}

export interface RankedEvidence {
  readonly document: DocumentRecord
  readonly passage: Passage
  readonly rank: number
}

export interface ExcludedEvidence {
  readonly documentId: string | null
  readonly title: string | null
  readonly reason: 'restricted' | 'superseded'
  readonly versionLabel: string | null
}

export interface Citation {
  readonly id: string
  readonly claimId: string
  readonly documentId: string
  readonly passageId: string
  readonly locator: string
}

export interface SupportedClaim {
  readonly id: string
  readonly text: string
  readonly citationIds: readonly string[]
}

export interface RetrievalTrace {
  readonly queryId: string | null
  readonly candidatePassages: number
  readonly inaccessiblePassagesRemoved: number
  readonly supersededPassagesRemoved: number
  readonly rankedEvidenceCount: number
  readonly supportedClaimCount: number
  readonly operations: readonly string[]
}

export interface RetrievalResult {
  readonly status: RetrievalStatus
  readonly question: string
  readonly identityId: string
  readonly answer: string
  readonly claims: readonly SupportedClaim[]
  readonly citations: readonly Citation[]
  readonly evidence: readonly RankedEvidence[]
  readonly excludedEvidence: readonly ExcludedEvidence[]
  readonly restrictedCandidateCount: number
  readonly supersededCandidateCount: number
  readonly trace: RetrievalTrace
}
