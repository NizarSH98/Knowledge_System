# Synthetic knowledge model

## Scope

Asteria Infrastructure Group is a fictional 84-person infrastructure consultancy. Its names, records, projects, suppliers, and evidence are synthetic and must always be labelled as such in the future UI.

| Entity | Count | Purpose |
|---|---:|---|
| Departments | 7 | Organizational clustering and ownership |
| People | 84 | Work/project and permission relationships |
| Projects | 15 | Active, complete, and paused contexts |
| Repositories | 9 | Source identity and synchronization metadata |
| Documents | 128 | Concise metadata records and passages |
| Permission groups | 10 | Source-access filtering |
| Demonstration identities | 3 | General, operational, and procurement views |
| Suppliers | 5 | Procurement relationships |
| Meetings | 3 | Decision provenance |
| Decisions | 2 | Supported organizational outcomes |

Counts are generated and verified, not used as fabricated customer or product metrics.

## Canonical scenario

Question: **“Why was Nova Industrial selected for Project Atlas?”**

The current answer can be assembled from the final supplier evaluation, comparison, delivery requirement, Gate 3 minutes, and revised quotation. A confidential finance breakdown exists but is not required for the answer.

| Identity | Expected result | Observable reason |
|---|---|---|
| General Employee | Insufficient permissions / refusal | Can see the delivery requirement and decision minute, but not the evaluation, comparison, or quotation needed for a complete rationale. |
| Operations Manager | Partially supported | Can see the Atlas evaluation and operational evidence, but not Procurement-only commercial comparison and quotation. |
| Procurement Officer | Supported | Can see all evidence required for all four claims. |

The Atlas supplier evaluation has a deliberate three-record lineage: v2 superseded → v3 superseded → v4 current. The v2 passage misleadingly recommends a different supplier because it predates revised offers and delivery confirmation. Superseded evidence is retrievable for history but excluded from a current answer.

Unsupported question: **“What will Project Atlas cost to operate in 2030?”** The model has no approved forecast evidence, so it refuses rather than extrapolating.

## Retrieval contract

```text
question
  → known demonstration query match
  → candidate passages
  → identity permission filter
  → current-version filter
  → deterministic ranking
  → per-claim evidence thresholds
  → supported / partial / permission refusal / unsupported refusal
```

This is a transparent simulation, not an LLM. Candidate selection follows fixed keyword and evidence rules. The result exposes ordinal source rank, never a fabricated confidence percentage or hidden reasoning. The future UI may show the observable system trace but must never label it chain-of-thought.

## Provenance contract

Each citation resolves through:

```text
answer → claim → passage → document → repository + owner department + version
```

Relationships additionally represent people working on projects, projects referencing documents, decisions supported by meetings/documents, document supersession, supplier selection, group membership, and document access.
