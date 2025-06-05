"use client";

import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";
import { dashboardStore, useDashboard } from "../dashboard-state";
import { DropdownFilter } from "./dropdown-filter";
import { TeamFilter } from "./team-filter";

export function Filters() {
  const { editors: allEditors } = useDashboard();
  const { languages: allLanguages } = useDashboard();
  const { teams: allTeams } = useDashboard();

  return (
    <div className="flex gap-2 flex-1">
      <DropdownFilter
        name={"Language"}
        allItems={allLanguages}
        onSelect={(e) => dashboardStore.filterLanguage(e)}
      />
      <DropdownFilter
        name={"Editor"}
        allItems={allEditors}
        onSelect={(e) => dashboardStore.filterEditor(e)}
      />
      <TeamFilter availableTeams={allTeams} />
      <Button
        variant={"secondary"}
        size={"icon"}
        onClick={() => dashboardStore.resetAllFilters()}
      >
        <Eraser size={18} />
      </Button>
    </div>
  );
}
