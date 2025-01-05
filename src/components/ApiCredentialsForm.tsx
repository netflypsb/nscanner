import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function ApiCredentialsForm() {
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          luno_api_key: apiKey,
          luno_api_secret: apiSecret,
          updated_at: new Date().toISOString(),
        })
        .eq("id", (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "API credentials saved successfully",
      });
      
      setApiKey("");
      setApiSecret("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save API credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Luno API Configuration</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key</Label>
          <Input
            id="apiKey"
            type="password"
            placeholder="Enter your Luno API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apiSecret">API Secret</Label>
          <Input
            id="apiSecret"
            type="password"
            placeholder="Enter your Luno API secret"
            value={apiSecret}
            onChange={(e) => setApiSecret(e.target.value)}
          />
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isLoading || !apiKey || !apiSecret}
          className="w-full"
        >
          {isLoading ? "Saving..." : "Save API Keys"}
        </Button>
      </div>
    </Card>
  );
}