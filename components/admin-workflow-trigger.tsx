"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Play, Zap } from "lucide-react"

type Workflow = {
  id?: string | number
  name?: string
  title?: string
  active?: boolean
  nodes?: Array<unknown> | number
  updatedAt?: unknown
  modifiedAt?: unknown
  trigger?: Record<string, unknown>
  executionMode?: string
}

type WorkflowInputOption = {
  value: string
  label: string
}

type WorkflowInputField = {
  key: string
  label: string
  options: WorkflowInputOption[]
}

type WorkflowInputConfig = {
  match: string
  fields: WorkflowInputField[]
}

const vendorOptions: WorkflowInputOption[] = [
  { value: "392", label: "Jags" },
  { value: "536", label: "Vogue Vista" },
  { value: "125", label: "Rough Clothing" },
  { value: "445", label: "Ves Clothing" },
  { value: "519", label: "Bah Bay" },
  { value: "449", label: "XFLAIR Clothing" },
  { value: "515", label: "Beetle96" },
  { value: "516", label: "CICADA" },
  { value: "524", label: "CupidCloak" },
  { value: "426", label: "Spring and Summer" },
]

const vendorLabelsById: Record<string, string> = {
  "392": "Jags",
  "536": "Vogue Vista",
  "125": "Rough Clothing",
  "445": "Ves Clothing",
  "519": "Bah Bay",
  "449": "XFLAIR Clothing",
  "515": "Beetle96",
  "516": "CICADA",
  "524": "CupidCloak",
  "426": "Spring and Summer",
}

const workflowInputConfigs: WorkflowInputConfig[] = [
  {
    match: "remove empty price variations",
    fields: [
      {
        key: "status",
        label: "Target product status",
        options: [
          { value: "pending", label: "Pending" },
          { value: "publish", label: "Published" },
        ],
      },
      {
        key: "vendorId",
        label: "Vendor",
        options: vendorOptions,
      },
    ],
  },
  {
    match: "add categories to products",
    fields: [
      {
        key: "targetProductStatus",
        label: "Target product status",
        options: [
          { value: "pending", label: "Pending" },
          { value: "published", label: "Published" },
        ],
      },
      {
        key: "vendor",
        label: "Vendor",
        options: vendorOptions,
      },
    ],
  },
  {
    match: "review and publish pending products",
    fields: [
      {
        key: "targetProductStatus",
        label: "Target product status",
        options: [
          { value: "pending", label: "Pending" },
        ],
      },
      {
        key: "vendor",
        label: "Vendor",
        options: vendorOptions,
      },
    ],
  },
  {
    match: "add sale prices to products",
    fields: [
      {
        key: "filterByCategorySlug",
        label: "Filter By Category Slug",
        options: [
          { value: "electronics", label: "electronics" },
          { value: "apparel", label: "apparel" },
          { value: "home-goods", label: "home-goods" },
        ],
      },
      {
        key: "salesOption",
        label: "Sales Option",
        options: [
          { value: "salesPrice", label: "Sales Price" },
          { value: "salesPercentage", label: "Sales Percentage" },
        ],
      },
      {
        key: "saleValue",
        label: "Enter Sale Value",
        options: [
          { value: "10", label: "10" },
          { value: "20", label: "20" },
          { value: "30", label: "30" },
          { value: "50", label: "50" },
        ],
      },
      {
        key: "startDate",
        label: "Start Date",
        options: [
          { value: "2026-05-21", label: "2026-05-21" },
          { value: "2026-05-22", label: "2026-05-22" },
          { value: "2026-05-23", label: "2026-05-23" },
        ],
      },
      {
        key: "endDate",
        label: "End Date",
        options: [
          { value: "2026-05-24", label: "2026-05-24" },
          { value: "2026-05-25", label: "2026-05-25" },
          { value: "2026-05-26", label: "2026-05-26" },
        ],
      },
    ],
  },
]

const defaultInputConfig: WorkflowInputConfig = {
  match: "default",
  fields: [
    {
      key: "targetProductStatus",
      label: "Target product status",
      options: [
        { value: "pending", label: "Pending" },
        { value: "publish", label: "Published" },
      ],
    },
    {
      key: "vendor",
      label: "Vendor",
      options: vendorOptions,
    },
  ],
}

function formatWorkflowName(workflow: Workflow) {
  return workflow.name || workflow.title || `Workflow ${workflow.id ?? "unknown"}`
}

function formatStatus(workflow: Workflow) {
  if (workflow.active === false) return "Paused"
  return "Active"
}

function findWorkflowInputConfig(name: string) {
  const lowerName = name.toLowerCase()
  return (
    workflowInputConfigs.find((config) => lowerName.includes(config.match)) ||
    defaultInputConfig
  )
}

function WorkflowRunDialog({ workflow }: { workflow: Workflow }) {
  const workflowLabel = formatWorkflowName(workflow)
  const config = findWorkflowInputConfig(workflowLabel)
  const initialValues = React.useMemo(
    () =>
      Object.fromEntries(
        config.fields.map((field) => [field.key, field.options[0]?.value ?? ""])
      ) as Record<string, string>,
    [config.fields]
  )

  const [selectedValues, setSelectedValues] = React.useState<Record<string, string>>(initialValues)
  const [triggered, setTriggered] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null)

  const handleSelectChange = (fieldKey: string, value: string) => {
    setSelectedValues((current) => ({ ...current, [fieldKey]: value }))
    setTriggered(false)
    setErrorMessage(null)
    setSuccessMessage(null)
  }

  const isAddSalePriceWorkflow = workflow.id === "add-sale-prices-to-products"
  const isWebhookConfigured = workflow.id !== "add-sale-prices-to-products"

  const handleTrigger = async () => {
    setErrorMessage(null)
    setSuccessMessage(null)
    setIsLoading(true)

    try {
      if (!isWebhookConfigured) {
        throw new Error("Webhook trigger is not configured for this workflow yet.")
      }

      const payload = { ...selectedValues }
      const response = await fetch("/api/trigger-webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workflowId: workflow.id, payload }),
      })

      if (!response.ok) {
        const json = await response.json().catch(() => null)
        throw new Error(json?.error || "Failed to trigger webhook")
      }

      setSuccessMessage("Webhook sent successfully.")
      setTriggered(true)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to send workflow trigger."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "secondary", size: "sm" })
        )}
      >
        Run
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Run {workflowLabel}</DialogTitle>
          <DialogDescription>
            Select the input values for this workflow and press Trigger. All fields use dropdowns for quick input.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {config.fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                {field.label}
              </label>
              <Select
                value={selectedValues[field.key]}
                onValueChange={(value) => handleSelectChange(field.key, value ?? "")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Select ${field.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        {!isWebhookConfigured && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
            Webhook trigger is not configured yet for this workflow.
          </div>
        )}

        {errorMessage ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive-foreground">
            {errorMessage}
          </div>
        ) : successMessage ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            {successMessage}
          </div>
        ) : null}

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={handleTrigger}
            disabled={isLoading || !isWebhookConfigured}
          >
            {isWebhookConfigured
              ? isLoading
                ? "Triggering..."
                : "Trigger workflow"
              : "Webhook not configured"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function AdminWorkflowTriggerTable({ workflows }: { workflows: Workflow[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <CardTitle>Workflow trigger console</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workflows.length > 0 ? (
              workflows.map((workflow) => (
                <TableRow key={String(workflow.id) ?? formatWorkflowName(workflow)}>
                  <TableCell className="font-medium">
                    {formatWorkflowName(workflow)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={formatStatus(workflow) === "Active" ? "default" : "secondary"}>
                      {formatStatus(workflow)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <WorkflowRunDialog workflow={workflow} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="p-6 text-center text-sm text-muted-foreground">
                  No workflows found or unable to fetch workflow data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

