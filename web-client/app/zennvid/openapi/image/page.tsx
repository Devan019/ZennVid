import { CreditNote } from "@/components/openapi/credit-note"
import { LayoutShell } from "@/components/openapi/layout-shell"
import { SampleBlock } from "@/components/openapi/sample-block"

export default function ImagePage() {
  const request = { prompt: "A futuristic city at sunset, wide angle" }
  const response = { ok: true, data: { imageUrl: "/generated-image-for-prompt-a-futuristic-city-at-su.jpg" } }
  return (
    <LayoutShell>
      <div className="space-y-4 max-w-2xl">
        <div>
          <h2 className="text-lg font-semibold">Image Generate</h2>
          <CreditNote />
        </div>
        <p className="text-sm text-muted-foreground">Generate an image from a prompt. Returns a URL.</p>
        <SampleBlock title="Generate image" endpoint="/api/image" request={request} response={response} />
      </div>
    </LayoutShell>
  )
}
