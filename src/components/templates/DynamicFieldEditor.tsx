import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DynamicField {
  id?: string;
  name: string;
  type: string;
  required: boolean;
  default_value: string | null;
  template_id: string;
}

interface DynamicFieldEditorProps {
  templateId: string;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'select', label: 'Select' },
];

export function DynamicFieldEditor({ templateId }: DynamicFieldEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: fields, isLoading } = useQuery({
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

  const addFieldMutation = useMutation({
    mutationFn: async (field: Omit<DynamicField, 'id'>) => {
      const { data, error } = await supabase
        .from('dynamic_fields')
        .insert([field])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dynamicFields', templateId] });
      toast({
        title: "Success",
        description: "Field added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add field",
        variant: "destructive",
      });
      console.error('Error adding field:', error);
    },
  });

  const deleteFieldMutation = useMutation({
    mutationFn: async (fieldId: string) => {
      const { error } = await supabase
        .from('dynamic_fields')
        .delete()
        .eq('id', fieldId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dynamicFields', templateId] });
      toast({
        title: "Success",
        description: "Field deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete field",
        variant: "destructive",
      });
      console.error('Error deleting field:', error);
    },
  });

  const handleAddField = () => {
    addFieldMutation.mutate({
      name: '',
      type: 'text',
      required: false,
      default_value: null,
      template_id: templateId,
    });
  };

  if (isLoading) {
    return <div>Loading fields...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Dynamic Fields</h3>
        <Button onClick={handleAddField}>Add Field</Button>
      </div>

      <div className="space-y-4">
        {fields?.map((field) => (
          <div key={field.id} className="flex items-start gap-4 p-4 border rounded-lg">
            <div className="flex-1 space-y-4">
              <div>
                <Label>Field Name</Label>
                <Input
                  value={field.name}
                  onChange={async (e) => {
                    const { error } = await supabase
                      .from('dynamic_fields')
                      .update({ name: e.target.value })
                      .eq('id', field.id);

                    if (error) {
                      toast({
                        title: "Error",
                        description: "Failed to update field name",
                        variant: "destructive",
                      });
                    }
                  }}
                  placeholder="Enter field name"
                />
              </div>

              <div>
                <Label>Field Type</Label>
                <Select
                  value={field.type}
                  onValueChange={async (value) => {
                    const { error } = await supabase
                      .from('dynamic_fields')
                      .update({ type: value })
                      .eq('id', field.id);

                    if (error) {
                      toast({
                        title: "Error",
                        description: "Failed to update field type",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELD_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={field.required}
                  onCheckedChange={async (checked) => {
                    const { error } = await supabase
                      .from('dynamic_fields')
                      .update({ required: checked })
                      .eq('id', field.id);

                    if (error) {
                      toast({
                        title: "Error",
                        description: "Failed to update field requirement",
                        variant: "destructive",
                      });
                    }
                  }}
                />
                <Label>Required</Label>
              </div>

              <div>
                <Label>Default Value</Label>
                <Input
                  value={field.default_value || ''}
                  onChange={async (e) => {
                    const { error } = await supabase
                      .from('dynamic_fields')
                      .update({ default_value: e.target.value })
                      .eq('id', field.id);

                    if (error) {
                      toast({
                        title: "Error",
                        description: "Failed to update default value",
                        variant: "destructive",
                      });
                    }
                  }}
                  placeholder="Enter default value"
                />
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => field.id && deleteFieldMutation.mutate(field.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}