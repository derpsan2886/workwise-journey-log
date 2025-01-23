import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DatePickerField } from "./DatePickerField";
import type { WorkItem } from './WorkItem';
import { useToast } from "@/components/ui/use-toast";

interface WorkItemFormProps {
  onSubmit: (item: Omit<WorkItem, 'id' | 'progress'>) => void;
  onClose: () => void;
}

export const WorkItemForm: React.FC<WorkItemFormProps> = ({ onSubmit, onClose }) => {
  const { toast } = useToast();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [assignee, setAssignee] = React.useState('');
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const [startDateOpen, setStartDateOpen] = React.useState(false);
  const [endDateOpen, setEndDateOpen] = React.useState(false);

  const handleStartDateSelect = (date: Date | undefined) => {
    console.log('Start date selected:', date);
    setStartDate(date);
    if (date && endDate && date > endDate) {
      setEndDate(undefined);
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    console.log('End date selected:', date);
    if (date && startDate && date < startDate) {
      toast({
        title: "Invalid Date Selection",
        description: "End date cannot be before start date",
        variant: "destructive",
      });
      return;
    }
    setEndDate(date);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !assignee || !startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      title,
      description,
      assignee,
      status: 'not-started',
      startDate,
      endDate,
    });

    toast({
      title: "Success",
      description: "Work item added successfully",
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <Input
          placeholder="Assignee"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <DatePickerField
          label="Start Date"
          selected={startDate}
          onSelect={handleStartDateSelect}
          open={startDateOpen}
          onOpenChange={setStartDateOpen}
        />
        <DatePickerField
          label="End Date"
          selected={endDate}
          onSelect={handleEndDateSelect}
          open={endDateOpen}
          onOpenChange={setEndDateOpen}
          disabled={(date) => startDate ? date < startDate : false}
        />
      </div>
      <Button type="submit" className="w-full">
        Add Item
      </Button>
    </form>
  );
};