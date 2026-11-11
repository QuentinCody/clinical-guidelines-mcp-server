# Clinical Guidelines MCP Server

This [Model Context Protocol](https://modelcontextprotocol.io) server serves bundled USPSTF and CDC summary subsets. These are curated local records, not a complete current provider API or executable clinical decision support. AHRQ reports that its CDS Connect Repository and Authoring tool went offline on April 28, 2025; successor links are available through `/ahrq/status`.

## Connect

Production endpoint (local changes require deployment):

```
https://clinical-guidelines-mcp-server.quentincody.workers.dev/mcp
```

Add it to your MCP client (Claude Desktop → Settings → Developer → Edit Config):

```json
{
  "mcpServers": {
    "clinical-guidelines": {
      "command": "npx",
      "args": ["mcp-remote", "https://clinical-guidelines-mcp-server.quentincody.workers.dev/mcp"]
    }
  }
}
```

For local development the server runs at `http://localhost:8831/mcp` (start it with `./scripts/dev-servers.sh clinical-guidelines`):

```json
{
  "mcpServers": {
    "clinical-guidelines-local": {
      "command": "npx",
      "args": ["mcp-remote", "http://localhost:8831/mcp"]
    }
  }
}
```

## Tools

- `guidelines_search` — discover operations, review scope and availability in the Code Mode catalog
- `guidelines_execute` — read bundled records with `api.get()` or inspect the catalog with `searchSpec()`; this adapter supports GET only
- `guidelines_query_data` — run SQL over large responses auto-staged into a per-session SQLite database
- `guidelines_get_schema` — inspect the inferred schema of a staged dataset

Large responses (>30KB) are auto-staged into a queryable SQLite database; the tools return a `data_access_id` you can query with SQL.

Every tool returns both a human-readable `content` summary and a structured `structuredContent` payload.
Each has both `guidelines_*` and `mcp_guidelines_*` names.

## Source review and dates

`GET /sources` exposes source links, the local bundle revision and the partial
review scope. Every record carries `_source` with its source URL, provider
publication date when available, review date and the specific `reviewed_fields`.
Unreviewed records have `review_status: not_reviewed` and no review date.
The local bundle revision is not a provider effective date. There is no automatic
upstream refresh and no claim that all advice is current.

The [USPSTF source review](../../docs/audits/2026-09-29-uspstf-source-review.md)
now covers core summary fields for all 27 bundled records across 25 topics.
`recommendation_status: final` and `update_notice: update_in_progress` distinguish
the observed final publication from a pending update. A different publication
date or new record does not automatically inherit review evidence. Supplemental
sex/risk-factor/taxonomy fields remain outside this review scope.

The September 29, 2026 review corrected these verified discrepancies:

- [Breast screening](https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening): removed the superseded individualized starting-age advice from the 2024 recommendation.
- [Colorectal screening](https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening): split grades A, B and C into distinct age-population records. The original ID now correctly denotes ages 50–75; new IDs end in `-45-49` and `-76-85`.
- [Osteoporosis](https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening): updated to the January 14, 2025 statement and corrected the overly broad age cutoff.
- [Hypertensive disorders of pregnancy](https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/hypertensive-disorders-pregnancy-screening): updated scope, publication date and source URL, preserving the legacy preeclampsia record ID.
- [CDC adult notes](https://www.cdc.gov/vaccines/hcp/imz-schedules/adult-notes.html): corrected pneumococcal age/risk groups and PCV21 availability, and RSV age/risk, maternal timing and repeat-dose summaries. Other fields and records still require review.

The [CDC adult follow-up](../../docs/audits/2026-09-29-cdc-adult-source-review.md)
corrects selected fields in eight more records, including recalled HepB product
guidance, vaccine timing, immunity criteria and pregnancy deferral. Each reviewed
record links its supporting sources. Contraindication lists remain non-exhaustive.

The [September 30 child/catch-up review](../../docs/audits/2026-09-30-cdc-child-source-review.md)
corrects selected Hib, PCV, HPV, Tdap, IPV, influenza and COVID fields. Hib adds
two product-alternative rows while retaining existing IDs; these are alternatives,
not five cumulative doses. PCV20 now works with the existing vaccine filter.
Each reviewed field has a dated source; earlier review dates remain unchanged.

The [October 2 child/catch-up follow-up](../../docs/audits/2026-10-02-cdc-child-followup.md)
corrects selected fields in 16 existing rows: dose timing, mixed-product series,
MMR/MMRV distinctions, verified varicella history and risk-specific boosters.
The cited schedule retains its 2025 label; the local review date does not imply
a new CDC schedule. Record review dates now correctly select the latest field
review while preserving earlier dates in `field_reviews`.

The [October 4 timing review](../../docs/audits/2026-10-04-cdc-schedule-timing-review.md)
covers seven timing/label fields across all 54 schedule rows and nine additional
notes/contraindication fields. It qualifies product-specific intervals, adult
summary ages, MMR birth-year exceptions, infant IPV timing, and COVID/flu allergy
restrictions. These reviewed values are pinned independently: edits or missing
fields remove their review evidence. `_source.field_semantics` explains summary
dose numbering, product versus summary ages, and `N/A` values. Earlier fields
keep their own review dates; the collection remains only partially reviewed.

The October 1 contraindication review updates 44 existing child, adult and
catch-up rows against the CDC [child appendix](https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-appendix.html)
and [adult appendix](https://www.cdc.gov/vaccines/hcp/imz-schedules/adult-appendix.html).
It restores prior-dose reactions, PCV and product-specific MenACWY carrier
allergies, Hib's minimum age, unexplained encephalopathy qualifiers, and the
immune-history qualification for MMR/varicella. Hepatitis component allergies
and rotavirus-specific contraindications stay associated with their vaccines.
These fields remain non-exhaustive summaries; precautions and product eligibility
require separate review.

For these records, `_source.field_reviews` retains each previously reviewed
field's date/source and the new contraindication review evidence. The record's
`reviewed_on` reports the latest review; it does not re-date all fields. The new
review is attached only when the ID and contraindication values match the
reviewed bundle. New IDs, altered values and absent fields do not inherit it.
The source appendices retain their July 2, 2025 provider dates, distinct from the
local October 1, 2026 review. Combined and vaccine-detail reads preserve this
metadata through existing Code Mode staging.

The October 1 vaccine inventory review uses CDC's July 21, 2026
[US vaccine table](https://www.cdc.gov/vaccines/hcp/vaccines-us/) for family-level
types and manufacturer examples. It adds MenABCWY discovery, PCV21, mRNA RSV,
Priorix and Hiberix manufacturer coverage, and corrects the US MenACWY list.
Disease-specific sources qualify selected RSV, pneumococcal, varicella and zoster
descriptions. This does not make the inventory a complete list of licensed products.

`/cdc/vaccines/{id}` accepts abbreviation components such as `PCV21` and `RIV`.
An ambiguous name such as `Hepatitis` returns HTTP 409 with candidate IDs. Related
`scheduleEntries` describe the resolved vaccine family: looking up PCV21 returns
PCV-family references, which are not evidence that PCV21 is a child-schedule option.
Use `/cdc/schedule/child` with `vaccine: "PCV21"` for the specific bundled match.
An empty result, including MenABCWY's currently absent schedule rows, does not
establish clinical ineligibility. Existing record IDs and Code Mode tools remain.

The [October 1 adult follow-up](../../docs/audits/2026-09-29-cdc-adult-source-review.md#october-1-follow-up)
updates selected influenza, hepatitis A and Tdap summary fields with separate
source/review dates. `/sources` links the September 1 influenza interim guidance
for the 2026–2027 season. Exact vaccine names/abbreviations now take precedence
over substring searches, so `vaccine=HepA` returns hepatitis A entries; broad
`Hepatitis` discovery still returns both A and B. IDs and response shapes remain.

The CDC child/adult schedule pages observed in this review were labeled 2025,
with a July 2, 2025 addendum. That observation does not validate this whole bundle
or establish a 2026 effective schedule. Read the linked notes, medical-indication
tables, contraindications and addenda for complete provider guidance. Combined
`/cdc/schedule/all` results now preserve full rows and review metadata; large
responses stage rather than dropping notes and contraindications. The separate
COVID page is labeled 2026–2027 and updated September 23, 2026; metadata also
records its older table-heading date rather than silently resolving the discrepancy.

## AHRQ access

`GET /ahrq/status` reports `provider_reported_offline`, the shutdown date
(`offline_since: "2025-04-28"`), and the separate review date. It cites the
[AHRQ notice](https://digital.ahrq.gov/ahrq-funded-projects/patient-centered-outcomes-research-clinical-decision-support-cds-connect),
whose page retains project publications and implementation guides and links to
[HL7 CDS Connect Community Edition](https://confluence.hl7.org/spaces/CDS/pages/358255205/CDS+Connect+Community+Edition)
and [CQL Studio](https://cqlstudio.com/). These links identify successor work;
a public replacement artifact API has not been validated. Retrieval and execution
remain disabled. The [historical Drupal API source](https://github.com/AHRQ-CDS/AHRQ-CDS-Connect-API)
is labeled separately from a current service contract.

The legacy `/ahrq/artifacts` and `/ahrq/artifacts/{id}` routes retain HTTP 503,
now with `AHRQ_REPOSITORY_OFFLINE`, `retryable: false`, and the same availability
metadata. They make no upstream request or automatic redirect. The unused HTTP
wrapper with an assumed API URL has been removed. Existing Code Mode discovery,
execution, dual aliases and staging remain available:

```javascript
return await api.get("/ahrq/status");
```

## Validation and remaining work

The October 1 HepB birth-dose correction qualifies timing by maternal HBsAg
status, birth weight and medical stability, including HBIG and additional-dose
conditions. Its two reviewed fields cite the
[July 2025 schedule notes](https://www.cdc.gov/vaccines/hcp/imz-schedules/child-adolescent-notes.html)
and [perinatal table](https://www.cdc.gov/hepatitis-b/hcp/perinatal-provider-overview/vaccine-administration.html),
as retrieved October 1. The [December 2025 announcement](https://www.cdc.gov/media/releases/2025/fact-sheet-hepatitis-b-immunization.html)
describes a different recommendation for HBsAg-negative mothers; the bundled
record explicitly identifies the linked 2025 schedule rather than claiming a
resolved current-policy determination. The October 4 review covers the other
bundled HepB timing fields within their explicitly qualified source scope.

Local behavioral tests cover grade/population distinctions, selected updates, review metadata,
AHRQ shutdown evidence and successor discovery, dual aliases and lossless staging of full schedule rows.
The October 4 work adds local Worker acceptance with canonical payload recovery
and SQL projections for combined schedules, vaccine-family relationships and
USPSTF records. Staging preserves scalar evidence, exact annotated `native_json`,
`source_path`, and full `response_context`. All aliases cite their results;
complete composed responses stage above 30 KiB, including failed partial results.
The supported `q` search alias is now documented in the catalog.
The [October 4 content review](../../docs/audits/2026-10-04-clinical-content-review.md)
closes the field inventory for the existing 100 records (870 content fields).
Every field review now requires an independently pinned value; older field dates
remain intact. A changed schedule identity or USPSTF publication URL/date cannot
inherit review evidence. New or edited fields appear in `unreviewed_fields`.
Do not regenerate review snapshots without a source review.

USPSTF detail keywords must match one record; ambiguous matches return 409 with
candidate IDs, grades and populations. Use exact IDs to select a colorectal age
group. `sex` and `topic` are local navigation labels, not clinical eligibility
rules; anatomy- and pregnancy-based records use `all`. Risk factors are selected
examples, and an empty array does not mean absence of eligibility conditions.
A public successor AHRQ artifact API remains unverified. The bundle is still a
partial, non-executable summary collection. See the implementation tracker for
final validation receipts; these local changes are not deployed.

## Development

```bash
./scripts/dev-servers.sh clinical-guidelines            # run locally (port 8831)
pnpm --filter clinical-guidelines-mcp-server run deploy   # deploy to Cloudflare Workers
```

See [`docs/adding-mcp-servers.md`](../../docs/adding-mcp-servers.md) and the root [README](../../README.md) for the full architecture (Code Mode, staging, portals).

---

*Auto-generated baseline README — refine with server-specific detail as needed.*

<!-- license-and-data-terms:start -->
## License and data terms

The code in this repository is licensed under the Apache License 2.0 (see `LICENSE`).
If you use it in your work, please cite it (see `CITATION.cff`). Citation is requested, not required.

The license covers the code only. Data that this server returns comes from USPSTF, CDC, AHRQ and stays under the terms of that source: US public domain.
You are responsible for your use of the data under those terms.
<!-- license-and-data-terms:end -->
