import { Client as WorkflowClient } from "@upstash/workflow";
import config from "@/lib/config";

const {
  env: {
    upstash: { qstashUrl, qstashToken },
  },
} = config;

export const workflowClient = new WorkflowClient({
  baseUrl: qstashUrl,
  token: qstashToken,
});
