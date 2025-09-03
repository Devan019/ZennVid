import { CreditNote } from "@/components/openapi/credit-note"
import { LayoutShell } from "@/components/openapi/layout-shell"
import { SampleBlock } from "@/components/openapi/sample-block"


export default function TranslatePage() {
  const request = { text: "Hello world", targetLang: "es" }
  const response = { ok: true, data: { translated: "[es] Hello world", targetLang: "es" } }
  return (
    <LayoutShell>
      <div className="space-y-4 max-w-2xl">
        <div>
          <h2 className="text-lg font-semibold">Text Translate</h2>
          <CreditNote />
        </div>
        <p className="text-sm text-muted-foreground">Translate to target language code (e.g., en, es, fr, hi).</p>
        <SampleBlock title="Translate text" endpoint="/api/translate" request={request} response={response} />
      </div>
    </LayoutShell>
  )
}
