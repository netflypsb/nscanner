import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Strategy {
  id: string;
  name: string;
  short_ma_type: string;
  short_ma_length: number;
  medium_ma_type: string;
  medium_ma_length: number;
  long_ma_type: string;
  long_ma_length: number;
  is_active: boolean;
}

export function StrategiesList() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchStrategies = async () => {
    try {
      const { data, error } = await supabase
        .from("strategies")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStrategies(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch strategies",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();

    const subscription = supabase
      .channel("strategies_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "strategies" }, () => {
        fetchStrategies();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const toggleStrategy = async (id: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from("strategies")
        .update({ is_active: !currentState })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update strategy status",
        variant: "destructive",
      });
    }
  };

  const deleteStrategy = async (id: string) => {
    try {
      const { error } = await supabase
        .from("strategies")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Strategy deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete strategy",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Your Trading Strategies</h2>
      <div className="space-y-4">
        {strategies.length === 0 ? (
          <p className="text-muted-foreground text-center">No strategies found</p>
        ) : (
          strategies.map((strategy) => (
            <div
              key={strategy.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="space-y-1">
                <h3 className="font-medium">{strategy.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Short: {strategy.short_ma_type}-{strategy.short_ma_length}, 
                  Medium: {strategy.medium_ma_type}-{strategy.medium_ma_length}, 
                  Long: {strategy.long_ma_type}-{strategy.long_ma_length}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={strategy.is_active}
                    onCheckedChange={() => toggleStrategy(strategy.id, strategy.is_active)}
                  />
                  <span className="text-sm text-muted-foreground">
                    {strategy.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteStrategy(strategy.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}