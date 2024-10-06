import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/Utils";
import { Button } from "@/components/Signup12/Ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Signup12/Ui/Popover";

// Define the props with explicit types for date and setDate
interface DatePickerProps {
  date: Date | null;
  setDate: (date: Date | null) => void;
}

export function DatePicker({ date }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
      </PopoverContent>
    </Popover>
  );
}
