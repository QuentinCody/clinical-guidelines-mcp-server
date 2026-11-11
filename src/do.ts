import { RestStagingDO } from "@bio-mcp/shared/staging/rest-staging-do";
import { clinicalTables, clinicalSchemaHints } from "./lib/staging";

export class GuidelinesDataDO extends RestStagingDO {
  protected getTabularData(value: unknown): unknown {
    // Scalar canonical evidence must reach RestStagingDO's raw-payload store.
    if (value === null || typeof value !== "object") return value;
    return clinicalTables(value);
  }

  protected getSchemaHints(value: unknown) {
    return clinicalSchemaHints(value);
  }
}
