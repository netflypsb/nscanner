import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { TemplateFormData } from "./TemplateForm"
import { useToast } from "@/components/ui/use-toast"

export function useTemplateCreation() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TemplateFormData) => {
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
}