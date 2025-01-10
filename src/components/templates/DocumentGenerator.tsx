import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DocumentGeneratorProps {
  templateId: string;
}

interface DynamicField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  default_value: string | null;
}

export function DocumentGenerator({ templateId }: DocumentGeneratorProps) {
  const { toast } = useToast();
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  const { data: template } = useQuery({
    queryKey: ['template', templateId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: fields } = useQuery({
    queryKey: ['dynamicFields', templateId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dynamic_fields')
        .select('*')
        .eq('template_id', templateId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as DynamicField[];
    },
  });

  const generateDocumentMutation = useMutation({
    mutationFn: async (values: Record<string, string>) => {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('generated_documents')
        .insert({
          template_id: templateId,
          user_id: user.id,
          data: values as unknown as Json,
          file_path: `generated/${templateId}/${Date.now()}.txt`, // You might want to generate a proper file path
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Document generated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate document",
        variant: "destructive",
      });
      console.error('Error generating document:', error);
    },
  });

  const handleGenerate = () => {
    // Validate required fields
    const missingFields = fields?.filter(
      field => field.required && !fieldValues[field.id]
    );

    if (missingFields?.length) {
      toast({
        title: "Error",
        description: `Please fill in all required fields: ${missingFields.map(f => f.name).join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    generateDocumentMutation.mutate(fieldValues);
  };

  if (!template || !fields) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{template.name}</h2>
        {template.description && (
          <p className="text-muted-foreground mt-1">{template.description}</p>
        )}
      </div>

      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.id}>
            <Label>
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              type={field.type === 'number' ? 'number' : 'text'}
              value={fieldValues[field.id] || field.default_value || ''}
              onChange={(e) => setFieldValues(prev => ({
                ...prev,
                [field.id]: e.target.value,
              }))}
              placeholder={`Enter ${field.name.toLowerCase()}`}
            />
          </div>
        ))}
      </div>

      <Button
        onClick={handleGenerate}
        disabled={generateDocumentMutation.isPending}
      >
        {generateDocumentMutation.isPending ? "Generating..." : "Generate Document"}
      </Button>
    </div>
  );
}