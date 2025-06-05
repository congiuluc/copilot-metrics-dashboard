"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Users, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TeamFilterProps {
  availableTeams: string[];
}

export const TeamFilter = ({ availableTeams }: TeamFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const getSelectedTeam = () => {
    if (typeof window === 'undefined') {
      return '';
    }
    
    const params = new URLSearchParams(window.location.search);
    return params.get('team') || '';
  };

  const [selectedTeam, setSelectedTeam] = useState(getSelectedTeam());
  const router = useRouter();

  const applyTeamFilter = (team: string) => {
    const params = new URLSearchParams(window.location.search);
    
    if (team && team !== selectedTeam) {
      params.set('team', team);
    } else if (team === selectedTeam) {
      // If clicking the same team, remove the filter
      params.delete('team');
      team = '';
    }
    
    const queryString = params.toString();
    const url = queryString ? `?${queryString}` : '/';
    
    router.push(url, { scroll: false });
    router.refresh();
    setSelectedTeam(team);
    setIsOpen(false);
  };

  const resetTeamFilter = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete('team');
    
    const queryString = params.toString();
    const url = queryString ? `?${queryString}` : '/';
    
    router.push(url, { scroll: false });
    router.refresh();
    setSelectedTeam('');
    setIsOpen(false);
  };

  if (availableTeams.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="space-x-2 font-normal">
            <Users size={16} />
            <span>Team</span>
            {selectedTeam && (
              <span className="ml-2 rounded bg-secondary px-2 py-1 text-xs">
                {selectedTeam}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search teams..." />
            <CommandList>
              <CommandEmpty>No teams found.</CommandEmpty>
              <CommandGroup>
                {availableTeams.map((team) => (
                  <CommandItem
                    key={team}
                    onSelect={() => applyTeamFilter(team)}
                    value={team}
                  >
                    <div className={cn("mr-2 flex items-center justify-center")}>
                      {selectedTeam === team ? (
                        <Check size={16} className="text-primary" />
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                    </div>
                    <span>{team}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              {selectedTeam && (
                <>
                  <div className="px-2 py-1">
                    <div className="h-px bg-border" />
                  </div>
                  <CommandGroup>
                    <CommandItem onSelect={resetTeamFilter}>
                      <div className="mr-2 w-4 h-4" />
                      <span>Clear filter</span>
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};