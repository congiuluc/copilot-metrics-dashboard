"use client";

import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import * as React from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export const DateFilter = () => {
  const today = new Date();
  // last 31 days
  const lastThirtyOneDays = new Date(today);
  lastThirtyOneDays.setDate(today.getDate() - 31);

  const [date, setDate] = React.useState<DateRange>({
    from: today,
    to: today,
  });

  const [isOpen, setIsOpen] = React.useState(false);

  const router = useRouter();

  const applyFilters = () => {
    if (date.from && date.to) {
      const formatEndDate = format(date?.to, "yyyy-MM-dd");
      const formatStartDate = format(date?.from, "yyyy-MM-dd");

      router.push(`?startDate=${formatStartDate}&endDate=${formatEndDate}`, {
        scroll: false,
      });
      router.refresh();
      setIsOpen(false);
    }
  };

  return (
    <div className={cn("grid gap-2")}>
      <Popover open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[170px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              format(date.from, "LLL dd, y")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 flex gap-2 flex-col"
          align="start"
        >
          <Calendar
            initialFocus
            mode="single"
            defaultMonth={date?.from}
            selected={date?.from}
            onSelect={(date) => {
              if (date) {
                setDate({ from: date, to: date });
              }
            }}
            numberOfMonths={1}
          />
          <Button onClick={applyFilters} className="self-end m-2">
            Apply
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};
