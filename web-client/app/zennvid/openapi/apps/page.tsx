"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { LayoutShell } from "@/components/openapi/layout-shell"
import { CreditNote } from "@/components/openapi/credit-note"

type CreateResp = { ok: true; data: { appId: string; apiKey: string } } | { ok: false; error: string }
type EmailResp = { ok: true; data: { sent: true } } | { ok: false; error: string }

export default function AppsPage() {
  const [title, setTitle] = useState("")
  const [creating, setCreating] = useState(false)
  const [appId, setAppId] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState<string | null>(null)

  const [email, setEmail] = useState("")
  const [emailing, setEmailing] = useState(false)
  const [emailResult, setEmailResult] = useState<string | null>(null)

  const onCreate = async () => {
    setCreating(true)
    setApiKey(null)
    setAppId(null)
    try {
      const res = await fetch("/api/apps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      })
      const json: CreateResp = await res.json()
      if (json.ok) {
        setAppId(json.data.appId)
        setApiKey(json.data.apiKey)
      } else {
        alert(json.error)
      }
    } finally {
      setCreating(false)
    }
  }

  const onEmail = async () => {
    if (!appId || !email) {
      setEmailResult("Need appId and email")
      return
    }
    setEmailing(true)
    setEmailResult(null)
    try {
      const res = await fetch("/api/apps/email-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId, email }),
      })
      const json: EmailResp = await res.json()
      if (json.ok) setEmailResult("Sent! Check your inbox.")
      else setEmailResult(json.error)
    } finally {
      setEmailing(false)
    }
  }

  return (
    <LayoutShell>
      <div className="max-w-lg space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Create App</h2>
          <CreditNote />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">App Title</Label>
          <Input
            id="title"
            placeholder="e.g., Zennvid Studio"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button onClick={onCreate} disabled={creating || title.trim().length < 2}>
            {creating ? "Generating..." : "Generate API Key"}
          </Button>
        </div>

        {apiKey && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border rounded-md p-3 bg-muted/40"
          >
            <p className="text-sm font-medium">Your API Key (shown once):</p>
            <pre className="text-xs overflow-auto">{apiKey}</pre>
            <p className="text-xs text-muted-foreground mt-2">
              Save this now. To see it again later, request via email below.
            </p>
          </motion.div>
        )}

        <div className="space-y-2">
          <Label htmlFor="appid">App ID</Label>
          <Input
            id="appid"
            placeholder="appId after creation"
            value={appId ?? ""}
            onChange={(e) => setAppId(e.target.value)}
          />
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="you@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button variant="secondary" onClick={onEmail} disabled={emailing || !appId || !email}>
            {emailing ? "Sending..." : "Email me the API key"}
          </Button>
          {emailResult && <p className="text-xs text-muted-foreground">{emailResult}</p>}
        </div>
      </div>
    </LayoutShell>
  )
}
