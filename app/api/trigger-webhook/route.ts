import { NextResponse } from "next/server"

const WEBHOOK_URLS: Record<string, string | undefined> = {
  "remove-empty-price-variations":
    process.env.N8N_WEBHOOK_REMOVE_EMPTY_PRICE_VARIATIONS ??
    process.env.N8N_WEBHOOK_URL,
  "add-categories-to-products":
    process.env.N8N_WEBHOOK_ADD_CATEGORIES_TO_PRODUCTS,
  "review-and-publish-pending-products":
    process.env.N8N_WEBHOOK_REVIEW_AND_PUBLISH_PENDING_PRODUCTS,
}

export async function POST(req: Request) {
  try {
    const { workflowId, payload } = (await req.json()) as {
      workflowId?: string
      payload?: Record<string, unknown>
    }

    if (!workflowId) {
      return NextResponse.json({ error: "Missing workflowId." }, { status: 400 })
    }

    const webhookUrl = WEBHOOK_URLS[String(workflowId)]
    if (!webhookUrl) {
      return NextResponse.json(
        { error: "Unsupported workflow or webhook not configured." },
        { status: 400 }
      )
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload ?? {}),
    })

    const text = await response.text()

    if (!response.ok) {
      return NextResponse.json(
        { error: text || `Webhook request failed with status ${response.status}` },
        { status: response.status }
      )
    }

    return NextResponse.json({ status: "ok", result: text })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
