import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Plus } from "lucide-react"

interface FormData {
  name: string
  description: string
  content: string
}

export function NewTemplateDialog() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    content: "",
  })
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const createTemplateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      const { error } = await supabase
        .from("templates")
        .insert({
          name: data.name,
          description: data.description,
          content: data.content,
          user_id: userData.user.id,
        })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] })
      toast({
        title: "Success",
        description: "Template created successfully",
      })
      setOpen(false)
      setFormData({ name: "", description: "", content: "" })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive",
      })
      console.error("Error creating template:", error)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createTemplateMutation.mutate(formData)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2" />
          New Template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
          <DialogDescription>
            Create a new template for your documents. Add a name, description, and content.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter template name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter template description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Template Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Add your template content with {placeholders}"
              className="h-32"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createTemplateMutation.isPending}>
              {createTemplateMutation.isPending ? "Creating..." : "Create Template"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}