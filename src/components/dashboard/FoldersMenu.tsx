import React, { useState } from 'react';
import { Folder, FolderPlus, Plus, ChevronRight } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Folder {
  id: string;
  name: string;
  created_at: string;
}

const FoldersMenu = () => {
  const [newFolderName, setNewFolderName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: folders, isLoading } = useQuery({
    queryKey: ["folders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("folders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Folder[];
    },
  });

  const createFolderMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("folders")
        .insert([{ name, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      setNewFolderName("");
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Folder created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive",
      });
      console.error("Error creating folder:", error);
    },
  });

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    createFolderMutation.mutate(newFolderName);
  };

  return (
    <SidebarMenu>
      <div className="flex items-center justify-between mb-2 px-2">
        <span className="text-sm font-medium">Folders</span>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateFolder} className="space-y-4">
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
              <Button type="submit" disabled={!newFolderName.trim()}>
                Create Folder
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <div className="text-sm text-muted-foreground px-2">Loading folders...</div>
      ) : folders?.length === 0 ? (
        <div className="text-sm text-muted-foreground px-2">No folders yet</div>
      ) : (
        folders?.map((folder) => (
          <SidebarMenuItem key={folder.id}>
            <SidebarMenuButton className="w-full justify-start">
              <Folder className="mr-2 h-4 w-4" />
              <span className="truncate">{folder.name}</span>
              <ChevronRight className="ml-auto h-4 w-4" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))
      )}
    </SidebarMenu>
  );
};

export default FoldersMenu;