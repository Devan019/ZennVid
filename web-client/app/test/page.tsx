"use client"


import { ApiDocs } from "@/components/openapi/api-docs";
import { DocsHeader } from "@/components/openapi/docs-header";


export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DocsHeader />
      <ApiDocs />
    </div>
  )
}
