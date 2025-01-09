import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react"

interface TemplateCardProps {
  id: string
  name: string
  thumbnail: string
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function TemplateCard({ id, name, thumbnail, onEdit, onDelete }: TemplateCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <img 
          src={thumbnail} 
          alt={name} 
          className="w-full h-48 object-cover"
        />
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <h3 className="font-medium">{name}</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}