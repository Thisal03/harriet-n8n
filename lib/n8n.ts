const N8N_API_KEY = process.env.N8N_API_KEY
const N8N_API_BASE_URL =
  process.env.N8N_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:5678"

if (!N8N_API_KEY) {
  throw new Error("Missing N8N_API_KEY environment variable")
}

const API_KEY = N8N_API_KEY as string

async function fetchN8nApi<T>(path: string) {
  const url = `${N8N_API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`

  const response = await fetch(url, {
    headers: {
      'X-N8N-API-KEY': API_KEY,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(
      `n8n API request failed (${response.status}): ${response.statusText}`
    )
  }

  return (await response.json()) as T
}

function normalizeList<T>(data: unknown): T[] {
  if (Array.isArray(data)) {
    return data
  }

  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>
    if (Array.isArray(obj.data)) {
      return obj.data as T[]
    }
    if (Array.isArray(obj.items)) {
      return obj.items as T[]
    }
  }

  return []
}

export async function getN8nWorkflows() {
  const data = await fetchN8nApi<unknown>("/api/v1/workflows?limit=100")
  return normalizeList<Record<string, unknown>>(data)
}

export type N8nExecutionQuery = {
  includeData?: boolean
  status?: string
  workflowId?: string
  projectId?: string
  limit?: number
  cursor?: string
}

export async function getN8nExecutions(query: N8nExecutionQuery = {}) {
  const params = new URLSearchParams()
  if (query.includeData !== undefined) {
    params.set("includeData", String(query.includeData))
  }
  if (query.status) {
    params.set("status", query.status)
  }
  if (query.workflowId) {
    params.set("workflowId", query.workflowId)
  }
  if (query.projectId) {
    params.set("projectId", query.projectId)
  }
  params.set("limit", String(query.limit ?? 100))
  if (query.cursor) {
    params.set("cursor", query.cursor)
  }

  const data = await fetchN8nApi<unknown>(`/api/v1/executions?${params.toString()}`)
  return normalizeList<Record<string, unknown>>(data)
}

export async function getDashboardSummary() {
  const [workflows, executions] = await Promise.all([
    getN8nWorkflows(),
    getN8nExecutions(),
  ])

  const activeWorkflows = workflows.filter((workflow) => {
    const active = workflow.active as boolean | undefined
    return active !== false
  }).length

  const now = Date.now()
  const executions24h = executions.filter((execution) => {
    const timestamp =
      new Date(
        (execution.finishedAt ?? execution.startedAt ?? execution.startedAtAt ?? execution.createdAt ?? execution.startedAt) as string
      ).valueOf()
    return !Number.isNaN(timestamp) && now - timestamp < 24 * 60 * 60 * 1000
  }).length

  const failedRuns = executions.filter((execution) => {
    const workflowStatus =
      execution.workflow && typeof execution.workflow === "object"
        ? (execution.workflow as Record<string, unknown>).status
        : undefined
    const status = String(execution.status ?? workflowStatus ?? "").toLowerCase()
    return status.includes("fail") || status.includes("error")
  }).length

  return {
    activeWorkflows,
    executions24h,
    failedRuns,
    connectedSheets: 1,
  }
}
