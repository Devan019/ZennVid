import { CreditNote } from "@/components/openapi/credit-note"
import { LayoutShell } from "@/components/openapi/layout-shell"
import { SampleBlock } from "@/components/openapi/sample-block"


export default function CaptionPage() {
  const request = { text: "A cozy coffee shop with people chatting" }
  const response = {
    ok: true,
    data: { caption: 'Generated caption for text: "A cozy coffee shop with people chatt..."' },
  }
  return (
    <LayoutShell>
      <div className="space-y-4 max-w-2xl">
        <div>
          <h2 className="text-lg font-semibold">Caption Generator</h2>
          <CreditNote />
        </div>
        <p className="text-sm text-muted-foreground">
          Generate captions for text or videos. Authenticate using your X-API-Key header.
        </p>
        <SampleBlock title="Create caption" endpoint="/api/caption" request={request} response={response} />
      </div>
    </LayoutShell>
  )
}
