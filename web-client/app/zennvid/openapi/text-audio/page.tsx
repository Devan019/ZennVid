import { CreditNote } from "@/components/openapi/credit-note"
import { LayoutShell } from "@/components/openapi/layout-shell"
import { SampleBlock } from "@/components/openapi/sample-block"


export default function TextAudioPage() {
  const request = { text: "Welcome to Zennvid!", voice: "alloy" }
  const response = { ok: true, data: { audioUrl: "/api/mock-audio?query=Welcome%20to%20Zennvid%21" } }
  return (
    <LayoutShell>
      <div className="space-y-4 max-w-2xl">
        <div>
          <h2 className="text-lg font-semibold">Text → Audio</h2>
          <CreditNote />
        </div>
        <p className="text-sm text-muted-foreground">Convert text to speech. Returns an audio URL.</p>
        <SampleBlock title="Generate audio" endpoint="/api/text-audio" request={request} response={response} />
      </div>
    </LayoutShell>
  )
}
