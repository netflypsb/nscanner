import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define MA types to match the database enum
type MAType = "SMA" | "EMA" | "WMA" | "HMA";
const MA_TYPES: MAType[] = ["SMA", "EMA", "WMA", "HMA"];

export function TradingStrategyForm() {
  const [name, setName] = useState("");
  const [shortMaType, setShortMaType] = useState<MAType>("SMA");
  const [shortMaLength, setShortMaLength] = useState("10");
  const [mediumMaType, setMediumMaType] = useState<MAType>("EMA");
  const [mediumMaLength, setMediumMaLength] = useState("20");
  const [longMaType, setLongMaType] = useState<MAType>("WMA");
  const [longMaLength, setLongMaLength] = useState("50");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No user found");

      const { error } = await supabase.from("strategies").insert({
        short_ma_type: shortMaType,
        short_ma_length: parseInt(shortMaLength),
        medium_ma_type: mediumMaType,
        medium_ma_length: parseInt(mediumMaLength),
        long_ma_type: longMaType,
        long_ma_length: parseInt(longMaLength),
        is_active: true,
        name,
        user_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Trading strategy saved successfully",
      });

      // Reset form
      setName("");
      setShortMaType("SMA");
      setShortMaLength("10");
      setMediumMaType("EMA");
      setMediumMaLength("20");
      setLongMaType("WMA");
      setLongMaLength("50");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save trading strategy",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const MATypeSelect = ({ value, onChange, label }: { value: MAType; onChange: (value: MAType) => void; label: string }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MA_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const MALengthInput = ({ value, onChange, label }: { value: string; onChange: (value: string) => void; label: string }) => (
    <div className="space-y-2">
      <Label>{label} Length</Label>
      <Input
        type="number"
        min="1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Create Trading Strategy</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Strategy Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter strategy name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MATypeSelect value={shortMaType} onChange={setShortMaType} label="Short MA Type" />
          <MALengthInput value={shortMaLength} onChange={setShortMaLength} label="Short MA" />
          
          <MATypeSelect value={mediumMaType} onChange={setMediumMaType} label="Medium MA Type" />
          <MALengthInput value={mediumMaLength} onChange={setMediumMaLength} label="Medium MA" />
          
          <MATypeSelect value={longMaType} onChange={setLongMaType} label="Long MA Type" />
          <MALengthInput value={longMaLength} onChange={setLongMaLength} label="Long MA" />
        </div>

        <Button 
          onClick={handleSave} 
          disabled={isLoading || !name}
          className="w-full"
        >
          {isLoading ? "Saving..." : "Save Strategy"}
        </Button>
      </div>
    </Card>
  );
}