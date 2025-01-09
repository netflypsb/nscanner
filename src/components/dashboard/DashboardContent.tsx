import React from "react"
import { FileText } from "lucide-react"
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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-steampunk-gradient min-h-screen">
      <Alert className="mb-4 border-brass bg-steampunk-light/50 text-brass-light">
        <AlertDescription>
          OCR processing: Invoice-2024-001.pdf (2/3 pages complete)
        </AlertDescription>
      </Alert>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-cinzel text-brass tracking-wide">Dashboard</h2>
          <p className="text-copper-light text-sm">Welcome to your document management center</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-cinzel text-brass-light">Documents</h3>
            {selectedDocs.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="px-4 py-2 text-sm bg-copper/20 border border-copper text-copper-light
                         hover:bg-copper/30 hover:border-copper-light hover:text-brass-light
                         transition-all duration-300 rounded-md animate-glow"
              >
                Delete Selected ({selectedDocs.length})
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="text-brass-light">Loading documents...</div>
          ) : documents?.length === 0 ? (
            <div className="text-brass-light">No documents found</div>
          ) : (
            documents?.map((doc) => (
              <Card 
                key={doc.id} 
                className="group relative border-copper/50 bg-steampunk-light/80 
                         hover:border-brass transition-all duration-300
                         hover:shadow-[0_0_15px_rgba(218,165,32,0.3)]"
              >
                <div className="absolute top-2 left-2 z-10">
                  <Checkbox
                    checked={selectedDocs.includes(doc.id)}
                    onCheckedChange={() => handleSelectDocument(doc.id)}
                    className="border-copper data-[state=checked]:border-brass 
                             data-[state=checked]:bg-brass"
                  />
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-medium text-brass-light">
                    {doc.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="aspect-[3/4] rounded-lg border border-copper/30 bg-steampunk-dark/50
                               group-hover:border-brass/30 transition-all duration-300">
                    <div className="h-full w-full flex items-center justify-center">
                      <FileText className="h-12 w-12 text-copper-light group-hover:text-brass-light
                                       transition-all duration-300" />
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-copper-light group-hover:text-brass-light
                             transition-all duration-300">
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