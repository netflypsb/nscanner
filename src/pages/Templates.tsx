import { useToast } from "@/components/ui/use-toast"
import { TemplateCard } from "@/components/templates/TemplateCard"
import { NewTemplateDialog } from "@/components/templates/NewTemplateDialog"
import { DynamicFieldEditor } from "@/components/templates/DynamicFieldEditor"
import { DocumentGenerator } from "@/components/templates/DocumentGenerator"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Template {
  id: string
  name: string
  description: string | null
  content: string
  version: number
  created_at: string
}

export default function Templates() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: templates, isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .eq("is_current", true)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as Template[]
    },
  })

  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("templates")
        .delete()
        .eq("id", id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] })
      toast({
        title: "Success",
        description: "Template deleted successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      })
      console.error("Error deleting template:", error)
    },
  })

  const handleEdit = (id: string) => {
    console.log("Editing template:", id)
    toast({
      title: "Editing template",
      description: `Opening template ${id} for editing`,
    })
  }

  const handleDelete = (id: string) => {
    deleteTemplateMutation.mutate(id)
  }

  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your document templates
          </p>
        </div>
        <NewTemplateDialog />
      </div>

      {templates?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No templates found. Create your first template to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates?.map((template) => (
            <Dialog key={template.id}>
              <DialogTrigger asChild>
                <div>
                  <TemplateCard
                    id={template.id}
                    name={template.name}
                    description={template.description || ""}
                    thumbnail="/placeholder.svg"
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>{template.name}</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="fields" className="w-full">
                  <TabsList>
                    <TabsTrigger value="fields">Dynamic Fields</TabsTrigger>
                    <TabsTrigger value="generate">Generate Document</TabsTrigger>
                  </TabsList>
                  <TabsContent value="fields">
                    <DynamicFieldEditor templateId={template.id} />
                  </TabsContent>
                  <TabsContent value="generate">
                    <DocumentGenerator templateId={template.id} />
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </div>
  )
}