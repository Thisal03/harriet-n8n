import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Key, Layers, Play } from "lucide-react"
import { getDashboardSummary } from "@/lib/n8n"

export default async function AdminDashboard() {
  const summary = await getDashboardSummary().catch(() => ({
    activeWorkflows: 0,
    executions24h: 0,
    failedRuns: 0,
    connectedSheets: 1,
  }))

  const stats = [
    {
      title: "Active Workflows",
      value: summary.activeWorkflows.toString(),
      icon: Layers,
      change: "+6%",
    },
    {
      title: "Executions (24h)",
      value: summary.executions24h.toString(),
      icon: Play,
      change: "+12%",
    },
    {
      title: "Failed Runs",
      value: summary.failedRuns.toString(),
      icon: AlertTriangle,
      change: summary.failedRuns > 0 ? "-8%" : "+0%",
    },
    {
      title: "Connected Sheets",
      value: summary.connectedSheets.toString(),
      icon: Key,
      change: "+1",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Workflow Overview</h1>
        <p className="mt-2 max-w-2xl text-base text-muted-foreground">
          See high-level n8n workflow activity and execution trends.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> vs last
                  period
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded border border-border p-4">
              <p className="text-sm text-muted-foreground">Average Runtime</p>
              <p className="mt-2 text-2xl font-bold">2m 14s</p>
            </div>
            <div className="rounded border border-border p-4">
              <p className="text-sm text-muted-foreground">Active Triggers</p>
              <p className="mt-2 text-2xl font-bold">23</p>
            </div>
            <div className="rounded border border-border p-4">
              <p className="text-sm text-muted-foreground">Errors Last 24h</p>
              <p className="mt-2 text-2xl font-bold">{summary.failedRuns}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
