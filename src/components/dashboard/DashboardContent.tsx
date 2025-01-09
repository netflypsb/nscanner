import React from "react"
import { Camera, Upload, Layout } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface Document {
  id: string
  name: string
  thumbnail: string
  modifiedDate: string
  folder_id: string | null
}

export function DashboardContent() {
  const [selectedDocs, setSelectedDocs] = React.useState<string[]>([])
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: documents, isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data.map((doc) => ({
        id: doc.id,
        name: doc.name,
        thumbnail: "/placeholder.svg",
        modifiedDate: new Date(doc.created_at).toLocaleDateString(),
        folder_id: doc.folder_id,
      })) as Document[]
    },
  })

  const deleteDocumentsMutation = useMutation({
    mutationFn: async (documentIds: string[]) => {
      const { error } = await supabase
        .from("documents")
        .delete()
        .in("id", documentIds)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] })
      setSelectedDocs([])
      toast({
        title: "Success",
        description: "Documents deleted successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete documents",
        variant: "destructive",
      })
      console.error("Error deleting documents:", error)
    },
  })

  const handleSelectDocument = (docId: string) => {
    setSelectedDocs((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    )
  }

  const handleDeleteSelected = () => {
    if (selectedDocs.length === 0) return
    deleteDocumentsMutation.mutate(selectedDocs)
  }

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
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-semibold">Documents</h3>
            {selectedDocs.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
              >
                Delete Selected ({selectedDocs.length})
              </Button>
            )}
          </div>
          <Button variant="link">View All Documents</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div>Loading documents...</div>
          ) : documents?.length === 0 ? (
            <div>No documents found</div>
          ) : (
            documents?.map((doc) => (
              <Card key={doc.id} className="group relative">
                <div className="absolute top-2 left-2 z-10">
                  <Checkbox
                    checked={selectedDocs.includes(doc.id)}
                    onCheckedChange={() => handleSelectDocument(doc.id)}
                  />
                </div>
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
            ))
          )}
        </div>
      </div>
    </div>
  )
}