"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useState } from "react"

type Props = {
  title: string
  endpoint: string
  method?: string
  request: any
  response: any
}

export function SampleBlock({ title, endpoint, method = "POST", request, response }: Props) {
  const [copied, setCopied] = useState(false)
  const reqStr = JSON.stringify(request, null, 2)
  const resStr = JSON.stringify(response, null, 2)
  const curl = `curl -X ${method} ${endpoint} \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -d '${reqStr.replace(/'/g, "'\\''")}'`

  const copy = async () => {
    await navigator.clipboard.writeText(curl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="border rounded-lg p-4 bg-background">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">
            {method} {endpoint}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={copy}>
          {copied ? "Copied" : "Copy cURL"}
        </Button>
      </div>
      <Tabs defaultValue="request" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="request">Request</TabsTrigger>
          <TabsTrigger value="response">Response</TabsTrigger>
        </TabsList>
        <TabsContent value="request">
          <pre className="mt-2 text-xs overflow-auto p-3 rounded-md bg-muted">{reqStr}</pre>
        </TabsContent>
        <TabsContent value="response">
          <pre className="mt-2 text-xs overflow-auto p-3 rounded-md bg-muted">{resStr}</pre>
        </TabsContent>
      </Tabs>
    </div>
  )
}
