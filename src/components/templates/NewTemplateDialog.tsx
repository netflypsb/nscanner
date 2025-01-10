import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { Plus } from "lucide-react"
import { TemplateForm, TemplateFormData } from "./TemplateForm"
import { useTemplateCreation } from "./useTemplateCreation"

export function NewTemplateDialog() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<TemplateFormData>({
    name: "",
    description: "",
    content: "",
  })

  const createTemplateMutation = useTemplateCreation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createTemplateMutation.mutate(formData, {
      onSuccess: () => {
        setOpen(false)
        setFormData({ name: "", description: "", content: "" })
      },
    })
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
        <TemplateForm
          formData={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          isSubmitting={createTemplateMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  )
}