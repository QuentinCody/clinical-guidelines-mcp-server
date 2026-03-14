/**
 * Clinical Guidelines Code Mode — registers search + execute tools for full API access.
 *
 * search: In-process catalog query, returns matching endpoints with docs.
 * execute: V8 isolate with api.get + searchSpec/listCategories.
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createSearchTool } from "@bio-mcp/shared/codemode/search-tool";
import { createExecuteTool } from "@bio-mcp/shared/codemode/execute-tool";
import { guidelinesCatalog } from "../spec/catalog";
import { createGuidelinesApiFetch } from "../lib/api-adapter";

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
) {
	const apiFetch = createGuidelinesApiFetch();

	// Register the search tool (in-process, no isolate)
	const searchTool = createSearchTool({
		prefix: "guidelines",
		catalog: guidelinesCatalog,
	});
	searchTool.register(server as unknown as { tool: (...args: unknown[]) => void });

	// Register the execute tool (V8 isolate via DynamicWorkerExecutor)
	const executeTool = createExecuteTool({
		prefix: "guidelines",
		catalog: guidelinesCatalog,
		apiFetch,
		doNamespace: env.GUIDELINES_DATA_DO,
		loader: env.CODE_MODE_LOADER,
	});
	executeTool.register(server as unknown as { tool: (...args: unknown[]) => void });
}
