import { useState } from "react";
import { useForm } from "react-hook-form";
import { Sidebar } from "@/components/Sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ApiKeyFormValues {
  lunoApiKey: string;
  lunoApiSecret: string;
}

const Settings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ApiKeyFormValues>({
    defaultValues: {
      lunoApiKey: "",
      lunoApiSecret: "",
    },
  });

  const onSubmit = async (data: ApiKeyFormValues) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.from("profiles").update({
        luno_api_key: data.lunoApiKey,
        luno_api_secret: data.lunoApiSecret,
        updated_at: new Date().toISOString(),
      }).eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "API keys updated successfully",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update API keys",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Luno API Configuration</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="lunoApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter your Luno API key" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lunoApiSecret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Secret</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter your Luno API secret" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save API Keys"}
                  </Button>
                </form>
              </Form>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Settings;