/**
 * Clinical Guidelines Code Mode — registers search + execute tools for full API access.
 *
 * search: In-process catalog query, returns matching endpoints with docs.
 * execute: V8 isolate with api.get + searchSpec/listCategories.
 */

import type { McpServer } from "@bio-mcp/shared/mcp";
import { createSearchTool } from "@bio-mcp/shared/codemode/search-tool";
import { createExecuteTool } from "@bio-mcp/shared/codemode/execute-tool";
import { guidelinesCatalog } from "../spec/catalog";
import { createGuidelinesApiFetch } from "../lib/api-adapter";
import { guidelinesResponse } from "../lib/tool-result";

interface CodeModeEnv {
	GUIDELINES_DATA_DO: DurableObjectNamespace;
	CODE_MODE_LOADER: WorkerLoader;
}

/**
 * Register guidelines_search and guidelines_execute tools.
 */
export function registerCodeMode(
	server: McpServer,
	env: CodeModeEnv,
): void {
	const apiFetch = createGuidelinesApiFetch();
	const registrar = { tool: (...args: unknown[]) => {
		const [name, description, schema, callback] = args;
		// SAFETY: shared factories provide SDK arguments; only the alias changes.
		const register = server.tool.bind(server) as (...values: unknown[]) => void;
		for (const alias of [String(name), `mcp_${String(name)}`]) register(alias, description, schema,
			(input: unknown, extra: unknown) => guidelinesResponse(() => (callback as (...values: unknown[]) => Promise<Awaited<ReturnType<typeof guidelinesResponse>>>)(input, extra), env, alias, extra, input));
	} };

	// Register the search tool (in-process, no isolate)
	const searchTool = createSearchTool({
		prefix: "guidelines",
		catalog: guidelinesCatalog,
	});
	searchTool.register(registrar);

	// Register the execute tool (V8 isolate via DynamicWorkerExecutor)
	const executeTool = createExecuteTool({
		prefix: "guidelines",
		// Verifiable provenance: guidelines_execute results carry a _meta.citation.
		source: { id: "guidelines", name: "Curated clinical guideline summaries; partial source review" },
		catalog: guidelinesCatalog,
		apiFetch,
		preserveApiErrors: true,
		doNamespace: env.GUIDELINES_DATA_DO,
		loader: env.CODE_MODE_LOADER,
		maxInlineBytes: 30 * 1024,
		stagingThreshold: 30 * 1024,
		timeout: 60000,
	});
	executeTool.register(registrar);
}
