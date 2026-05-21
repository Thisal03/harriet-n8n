import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AdminWorkflowTriggerTable } from "@/components/admin-workflow-trigger"

const workflows = [
  {
    id: "remove-empty-price-variations",
    name: "Remove Empty Price Variations",
    active: true,
    nodes: 8,
    updatedAt: "—",
    executionMode: "Manual",
  },
  {
    id: "add-categories-to-products",
    name: "Add Categories to Products",
    active: true,
    nodes: 6,
    updatedAt: "—",
    executionMode: "Manual",
  },
  {
    id: "review-and-publish-pending-products",
    name: "Review and Publish Pending Products",
    active: true,
    nodes: 10,
    updatedAt: "—",
    executionMode: "Manual",
  },
//   {
//     id: "add-sale-prices-to-products",
//     name: "Add Sale Prices to Products",
//     active: true,
//     nodes: 9,
//     updatedAt: "—",
//     executionMode: "Manual",
//   },
]

export default function WorkflowsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Workflows</h1>
        <p className="mt-2 text-muted-foreground">
          These are triggerable workflows. Select input values and run the workflow directly from the frontend.
        </p>
      </div>

      <AdminWorkflowTriggerTable workflows={workflows} />
    </div>
  )
}
