import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { WorkItemForm } from './WorkItemForm';
import type { WorkItem } from './WorkItem';

interface AddWorkItemDialogProps {
  onAdd: (item: Omit<WorkItem, 'id' | 'progress'>) => void;
}

export const AddWorkItemDialog: React.FC<AddWorkItemDialogProps> = ({ onAdd }) => {
  const [open, setOpen] = React.useState(false);

  const handleAdd = (item: Omit<WorkItem, 'id' | 'progress'>) => {
    onAdd(item);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-8 right-8">
          <Plus className="mr-2 h-4 w-4" /> Add Work Item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Work Item</DialogTitle>
          <DialogDescription>Fill in the details to create a new work item.</DialogDescription>
        </DialogHeader>
        <WorkItemForm onSubmit={handleAdd} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};