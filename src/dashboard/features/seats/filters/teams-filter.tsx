"use client";

import { Check, PlusCircle } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { getAllCopilotSeatsTeams, IFilter } from "@/services/copilot-seat-service";
import { GitHubTeam } from "@/features/common/models";

interface TeamsFilterProps {
  disabled?: boolean;
}

export const TeamsFilter = ({ disabled = false }: TeamsFilterProps) => {
  const [teams, setTeams] = React.useState<GitHubTeam[]>([]);
  const [selectedTeams, setSelectedTeams] = React.useState<Set<string>>(new Set());
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  // Get initial selected teams from URL
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const teamParam = params.get('team');
      if (teamParam) {
        setSelectedTeams(new Set([teamParam]));
      }
    }
  }, []);

  // Load teams when component mounts or when popover opens
  React.useEffect(() => {
    if (isOpen && teams.length === 0 && !disabled) {
      loadTeams();
    }
  }, [isOpen, disabled]);

  const loadTeams = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const date = params.get('date') ? new Date(params.get('date')!) : undefined;
      
      const filter: IFilter = {
        date,
        enterprise: '',
        organization: '',
        team: '',
        page: 1
      };

      const result = await getAllCopilotSeatsTeams(filter);
      if (result.status === "OK" && result.response) {
        setTeams(result.response);
      }
    } catch (error) {
      console.error('Failed to load teams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams(window.location.search);
    
    if (selectedTeams.size > 0) {
      // For now, we'll support single team selection
      // You can extend this to support multiple teams if needed
      const firstTeam = Array.from(selectedTeams)[0];
      params.set('team', firstTeam);
    } else {
      params.delete('team');
    }

    const queryString = params.toString();
    const url = queryString ? `?${queryString}` : '/seats';
    
    router.push(url, { scroll: false });
    router.refresh();
    setIsOpen(false);
  };

  const resetFilters = () => {
    setSelectedTeams(new Set());
    const params = new URLSearchParams(window.location.search);
    params.delete('team');
    
    const queryString = params.toString();
    const url = queryString ? `?${queryString}` : '/seats';
    
    router.push(url, { scroll: false });
    router.refresh();
    setIsOpen(false);
  };

  return (
    <div className={cn("grid gap-2")}>
      <Popover open={isOpen && !disabled} onOpenChange={(open) => !disabled && setIsOpen(open)}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={disabled}
            className="h-8 border-dashed gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Teams
            {selectedTeams?.size > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal lg:hidden"
                >
                  {selectedTeams.size}
                </Badge>
                <div className="hidden space-x-1 lg:flex">
                  {selectedTeams.size > 2 ? (
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {selectedTeams.size} selected
                    </Badge>
                  ) : (
                    Array.from(selectedTeams).map((value) => (
                      <Badge
                        key={value}
                        variant="secondary"
                        className="rounded-sm px-1 font-normal"
                      >
                        {value}
                      </Badge>
                    ))
                  )}
                </div>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search teams..." />
            <CommandList>
              <CommandEmpty>
                {isLoading ? "Loading teams..." : "No teams found."}
              </CommandEmpty>
              <CommandGroup>
                {teams.map((team) => {
                  const teamName = team.name || team.slug || `Team ${team.id}`;
                  const isSelected = selectedTeams.has(teamName);
                  
                  return (
                    <CommandItem
                      key={team.id || teamName}
                      onSelect={() => {
                        const newSelectedTeams = new Set(selectedTeams);
                        if (isSelected) {
                          newSelectedTeams.delete(teamName);
                        } else {
                          // For single selection, clear existing and add new
                          newSelectedTeams.clear();
                          newSelectedTeams.add(teamName);
                        }
                        setSelectedTeams(newSelectedTeams);
                      }}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <Check />
                      </div>
                      <span>{teamName}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {selectedTeams.size > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => {
                        setSelectedTeams(new Set());
                      }}
                      className="justify-center text-center"
                    >
                      Clear filters
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
          <div className="flex justify-between m-2 gap-2">
            <Button onClick={resetFilters} variant="outline">
              Reset
            </Button>
            <Button onClick={applyFilters}>Apply</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
