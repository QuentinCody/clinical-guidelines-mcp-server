import { buildHealthResponse, configureCitationSigning } from "@bio-mcp/shared";
import { StatelessMcpWorker } from "@bio-mcp/shared/mcp";
import { McpServer } from "@bio-mcp/shared/mcp";
import { registerQueryData } from "./tools/query-data";
import { registerGetSchema } from "./tools/get-schema";
import { registerCodeMode } from "./tools/code-mode";
import { GuidelinesDataDO } from "./do";

// Export Durable Object classes
export { GuidelinesDataDO };

interface GuidelinesEnv {
	GUIDELINES_DATA_DO: DurableObjectNamespace;
	CODE_MODE_LOADER: WorkerLoader;
}

export class MyMCP extends StatelessMcpWorker {
	server = new McpServer({
		name: "clinical-guidelines",
		version: "0.1.0",
	});

	async init() {

		configureCitationSigning(this.env);
		const env = this.env as unknown as GuidelinesEnv;
		registerQueryData(this.server, env);
		registerGetSchema(this.server, env);
		registerCodeMode(this.server, env);
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/health") {
			return buildHealthResponse("clinical-guidelines");
		}

		if (url.pathname === "/mcp") {
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};
