import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter } from "@/components/ui/dialog"

export interface TemplateFormData {
  name: string
  description: string
  content: string
}

interface TemplateFormProps {
  formData: TemplateFormData
  onChange: (data: TemplateFormData) => void
  onSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
}

export function TemplateForm({ formData, onChange, onSubmit, isSubmitting }: TemplateFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Template Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onChange({ ...formData, name: e.target.value })}
          placeholder="Enter template name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => onChange({ ...formData, description: e.target.value })}
          placeholder="Enter template description"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Template Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => onChange({ ...formData, content: e.target.value })}
          placeholder="Add your template content with {placeholders}"
          className="h-32"
          required
        />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Template"}
        </Button>
      </DialogFooter>
    </form>
  )
}