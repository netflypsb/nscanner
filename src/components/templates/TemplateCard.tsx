import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash, FileText } from "lucide-react"

interface TemplateCardProps {
  id: string
  name: string
  description: string
  thumbnail: string
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function TemplateCard({
  id,
  name,
  description,
  thumbnail,
  onEdit,
  onDelete,
}: TemplateCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-0">
        <div className="aspect-[3/2] relative bg-muted">
          <div className="absolute inset-0 flex items-center justify-center">
            <FileText className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold truncate">{name}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(id)}
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit template</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(id)}
        >
          <Trash className="h-4 w-4" />
          <span className="sr-only">Delete template</span>
        </Button>
      </CardFooter>
    </Card>
  )
}