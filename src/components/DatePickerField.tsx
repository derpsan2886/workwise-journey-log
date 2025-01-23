import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DatePickerFieldProps {
  label: string;
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: (date: Date) => boolean;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  selected,
  onSelect,
  open,
  onOpenChange,
  disabled
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm">{label}</label>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selected && "text-muted-foreground"
            )}
            type="button"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selected ? format(selected, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0" 
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          style={{ position: 'fixed', zIndex: 9999 }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            onMouseDown={(e) => e.stopPropagation()}
            style={{ position: 'relative' }}
          >
            <Calendar
              mode="single"
              selected={selected}
              onSelect={(date) => {
                onSelect(date);
                onOpenChange(false);
              }}
              disabled={disabled}
              initialFocus
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};