import { afterEach, expect, it, vi } from "vitest";
import { McpServer } from "@bio-mcp/shared/mcp";
import type { ExecuteToolOptions } from "@bio-mcp/shared/codemode/execute-tool";
import { createApiProxyTool } from "@bio-mcp/shared/tools/api-proxy";
import { registerCodeMode } from "./code-mode";
import { registerQueryData } from "./query-data";
import { registerGetSchema } from "./get-schema";

const captured = vi.hoisted(() => ({ options: [] as ExecuteToolOptions[] }));
vi.mock("@bio-mcp/shared/codemode/execute-tool", async importOriginal => {
	const actual = await importOriginal<typeof import("@bio-mcp/shared/codemode/execute-tool")>();
	return { ...actual, createExecuteTool: (options: ExecuteToolOptions) => { captured.options.push(options); return actual.createExecuteTool(options); } };
});
afterEach(() => { captured.options.length = 0; vi.unstubAllGlobals(); });

function registered() {
	const server = new McpServer({ name: "fixture", version: "1" });
	// SAFETY: invalid-code tests never invoke the Worker loader.
	registerCodeMode(server, { CODE_MODE_LOADER: { get: () => ({}) } } as unknown as Parameters<typeof registerCodeMode>[1]);
	registerQueryData(server, {}); registerGetSchema(server, {});
	// SAFETY: inspect the SDK registry to call the actual registered callbacks.
	return (server as unknown as { _registeredTools: Record<string, { handler: (args: unknown, extra: unknown) => Promise<unknown> }> })._registeredTools;
}

it("registers all eight aliases with both response fields on search success and tool errors", async () => {
	const tools = registered();
	expect(Object.keys(tools)).toHaveLength(8);
	for (const prefix of ["", "mcp_"]) {
		expect(await tools[prefix + "guidelines_search"].handler({ query: "source", max_results: 5 }, {})).toMatchObject({ content: expect.any(Array), structuredContent: { success: true, _meta: { citation: { result_hash: expect.any(String) } } } });
		for (const [name, args] of [["guidelines_execute", { code: "" }], ["guidelines_query_data", { data_access_id: "fixture", sql: "SELECT 1" }], ["guidelines_get_schema", { data_access_id: "fixture" }]] as const) {
			expect(await tools[prefix + name].handler(args, {})).toMatchObject({ content: expect.any(Array), structuredContent: { _meta: { citation: { result_hash: expect.any(String) } } }, isError: true });
		}
	}
});

it("stages full combined schedules with source-review context and clinical notes", async () => {
	registered(); const options = captured.options[0];
	expect(options).toMatchObject({ maxInlineBytes: 30 * 1024, stagingThreshold: 30 * 1024, preserveApiErrors: true });
	const stored: unknown[] = [];
	const namespace = { idFromName: (name: string) => name, get: () => ({ fetch: async (request: Request) => {
		if (new URL(request.url).pathname === "/process") {
			// SAFETY: the shared staging protocol sends this data envelope.
			const payload = await request.json() as { data: unknown }; stored.push(payload.data);
			return Response.json({ success: true, tables_created: ["schedule"], total_rows: 1 });
		}
		return Response.json({ success: true, schema: { tables: { schedule: { columns: [{ name: "notes" }] } } } });
	} }) };
	const original = await options.apiFetch({ method: "GET", path: "/cdc/schedule/all" });
	const proxy = createApiProxyTool({ apiFetch: options.apiFetch, catalog: options.catalog, doNamespace: namespace, stagingPrefix: "guidelines", maxInlineBytes: options.maxInlineBytes });
	const result = await proxy.handler({ method: "GET", path: "/cdc/schedule/all" }, { sql: () => [] });
	expect(result).toMatchObject({ __staged: true, data_access_id: expect.any(String), _staging: expect.any(Object) });
	expect(stored.map(value => typeof value === "string" ? JSON.parse(value) : value)).toContainEqual(original.data);
	expect(new TextEncoder().encode(JSON.stringify(result)).byteLength).toBeLessThan(100000);
});

it.each(["", "mcp_"])("discovers AHRQ successor status through %sguidelines_search", async prefix => {
	const tools = registered();
	const result = await tools[prefix + "guidelines_search"].handler({ query: "CQL Studio", category: "ahrq", max_results: 5 }, {});
	expect(result).toMatchObject({ content: expect.any(Array), structuredContent: { success: true } });
	expect(JSON.stringify(result)).toContain("/ahrq/status");
	expect(JSON.stringify(result)).toContain("2025-04-28");
});

it("retains offline evidence and retry advice through the Code Mode proxy without network calls", async () => {
	registered();
	const fetcher = vi.fn(); vi.stubGlobal("fetch", fetcher);
	const options = captured.options[0];
	const proxy = createApiProxyTool({ apiFetch: options.apiFetch, catalog: options.catalog });
	const status = await proxy.handler({ method: "GET", path: "/ahrq/status" }, { sql: () => [] });
	expect(status).toMatchObject({ status: "provider_reported_offline", successor: { public_api_status: "unverified" } });
	for (const path of ["/ahrq/artifacts", "/ahrq/artifacts/123"]) {
		expect(await proxy.handler({ method: "GET", path }, { sql: () => [] })).toMatchObject({ __api_error: true, status: 503,
			data: { error: "AHRQ_REPOSITORY_OFFLINE", retryable: false, availability: status } });
	}
	expect(fetcher).not.toHaveBeenCalled();
});
