import React from "react"
import { Camera, Upload, Layout } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

const recentDocuments = [
  {
    id: 1,
    name: "Invoice-2024-001.pdf",
    thumbnail: "/placeholder.svg",
    modifiedDate: "2024-02-20",
  },
  {
    id: 2,
    name: "Contract-2024-002.pdf",
    thumbnail: "/placeholder.svg",
    modifiedDate: "2024-02-19",
  },
  {
    id: 3,
    name: "Report-2024-003.pdf",
    thumbnail: "/placeholder.svg",
    modifiedDate: "2024-02-18",
  },
]

export function DashboardContent() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Alert className="mb-4">
        <AlertDescription>
          OCR processing: Invoice-2024-001.pdf (2/3 pages complete)
        </AlertDescription>
      </Alert>

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button>
            <Camera className="mr-2 h-4 w-4" />
            New Scan
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </Button>
          <Button variant="outline">
            <Layout className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Recent Documents</h3>
          <Button variant="link">View All Documents</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentDocuments.map((doc) => (
            <Card key={doc.id}>
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">
                  {doc.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="aspect-[3/4] rounded-lg border bg-muted">
                  <img
                    src={doc.thumbnail}
                    alt={doc.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Last modified: {doc.modifiedDate}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}