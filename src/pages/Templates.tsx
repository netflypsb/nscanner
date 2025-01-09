import { useToast } from "@/components/ui/use-toast"
import { TemplateCard } from "@/components/templates/TemplateCard"
import { NewTemplateDialog } from "@/components/templates/NewTemplateDialog"

// Temporary mock data
const mockTemplates = [
  {
    id: "1",
    name: "Invoice Template",
    thumbnail: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Contract Template",
    thumbnail: "/placeholder.svg",
  },
]

export default function Templates() {
  const { toast } = useToast()

  const handleEdit = (id: string) => {
    console.log("Editing template:", id)
    toast({
      title: "Editing template",
      description: `Opening template ${id} for editing`,
    })
  }

  const handleDelete = (id: string) => {
    console.log("Deleting template:", id)
    toast({
      title: "Delete template",
      description: `Template ${id} has been deleted`,
      variant: "destructive",
    })
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Templates</h1>
        <NewTemplateDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            {...template}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}