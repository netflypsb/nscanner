import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ApiCredentialsForm() {
  const [lunoApiKey, setLunoApiKey] = useState("");
  const [lunoApiSecret, setLunoApiSecret] = useState("");
  const [binanceApiKey, setBinanceApiKey] = useState("");
  const [binanceApiSecret, setBinanceApiSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSaveLuno = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          luno_api_key: lunoApiKey,
          luno_api_secret: lunoApiSecret,
          updated_at: new Date().toISOString(),
        })
        .eq("id", (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Luno API credentials saved successfully",
      });
      
      setLunoApiKey("");
      setLunoApiSecret("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save Luno API credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBinance = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          binance_api_key: binanceApiKey,
          binance_api_secret: binanceApiSecret,
          updated_at: new Date().toISOString(),
        })
        .eq("id", (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Binance API credentials saved successfully",
      });
      
      setBinanceApiKey("");
      setBinanceApiSecret("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save Binance API credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Exchange API Configuration</h2>
      <Tabs defaultValue="luno" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="luno">Luno</TabsTrigger>
          <TabsTrigger value="binance">Binance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="luno" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lunoApiKey">API Key</Label>
            <Input
              id="lunoApiKey"
              type="password"
              placeholder="Enter your Luno API key"
              value={lunoApiKey}
              onChange={(e) => setLunoApiKey(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lunoApiSecret">API Secret</Label>
            <Input
              id="lunoApiSecret"
              type="password"
              placeholder="Enter your Luno API secret"
              value={lunoApiSecret}
              onChange={(e) => setLunoApiSecret(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleSaveLuno} 
            disabled={isLoading || !lunoApiKey || !lunoApiSecret}
            className="w-full"
          >
            {isLoading ? "Saving..." : "Save Luno API Keys"}
          </Button>
        </TabsContent>

        <TabsContent value="binance" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="binanceApiKey">API Key</Label>
            <Input
              id="binanceApiKey"
              type="password"
              placeholder="Enter your Binance API key"
              value={binanceApiKey}
              onChange={(e) => setBinanceApiKey(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="binanceApiSecret">API Secret</Label>
            <Input
              id="binanceApiSecret"
              type="password"
              placeholder="Enter your Binance API secret"
              value={binanceApiSecret}
              onChange={(e) => setBinanceApiSecret(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleSaveBinance} 
            disabled={isLoading || !binanceApiKey || !binanceApiSecret}
            className="w-full"
          >
            {isLoading ? "Saving..." : "Save Binance API Keys"}
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  );
}