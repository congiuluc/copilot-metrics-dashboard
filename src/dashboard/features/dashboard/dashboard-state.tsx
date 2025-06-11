"use client";

import { PropsWithChildren } from "react";
import {
  Breakdown,
  CopilotUsageOutput,
  GitHubTeam,
} from "@/features/common/models";
import { formatDate } from "@/utils/helpers";

import { proxy, useSnapshot } from "valtio";

import { groupByTimeFrame } from "@/utils/data-mapper";
import { CopilotSeatsData } from "../common/models";
import { refreshMetricsData, refreshSeatsData } from "@/services/dashboard-actions";

interface IProps extends PropsWithChildren {
  copilotUsages: CopilotUsageOutput[];
  seatsData: CopilotSeatsData;
  teamsData: GitHubTeam[];
  filter?: {
    startDate?: Date;
    endDate?: Date;
    enterprise?: string;
    organization?: string;
  };
}

export interface DropdownFilterItem {
  value: string;
  isSelected: boolean;
}

export type TimeFrame = "daily" | "weekly" | "monthly";

class DashboardState {
  public filteredData: CopilotUsageOutput[] = [];
  public languages: DropdownFilterItem[] = [];
  public editors: DropdownFilterItem[] = [];
  public teams: DropdownFilterItem[] = [];
  public timeFrame: TimeFrame = "weekly";
  public hideWeekends: boolean = false;
  public isLoading: boolean = false;

  public seatsData: CopilotSeatsData = {} as CopilotSeatsData;
  public teamsData: GitHubTeam[] = [];

  private apiData: CopilotUsageOutput[] = [];
  private hasPendingTeamChanges: boolean = false;  // Track if teams have changed
  private currentFilter: {
    startDate?: Date;
    endDate?: Date;
    enterprise?: string;
    organization?: string;
  } = {};

  // Computed property for filtered seats data based on selected teams
  public get filteredSeatsData(): CopilotSeatsData {
    const selectedTeams = this.teams.filter((item) => item.isSelected);

    if (selectedTeams.length === 0) {
      return this.seatsData;
    }

    const selectedTeamNames = selectedTeams.map((team) => team.value);
    const filteredSeats =
      this.seatsData.seats?.filter(
        (seat) =>
          seat.assigning_team?.name &&
          selectedTeamNames.includes(seat.assigning_team.name)
      ) || [];

    // Calculate filtered stats
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeSeats = filteredSeats.filter((seat) => {
      if (!seat.last_activity_at) return false;
      const lastActivityDate = new Date(seat.last_activity_at);
      return lastActivityDate >= thirtyDaysAgo;
    }).length;

    return {
      ...this.seatsData,
      total_seats: filteredSeats.length,
      total_active_seats: activeSeats,
      seats: filteredSeats,
    } as CopilotSeatsData;
  }  public initData(
    data: CopilotUsageOutput[],
    seatsData: CopilotSeatsData,
    teamsData: GitHubTeam[],
    filter?: {
      startDate?: Date;
      endDate?: Date;
      enterprise?: string;
      organization?: string;
    }
  ): void {
    this.apiData = [...data];
    this.filteredData = [...data];
    this.onTimeFrameChange(this.timeFrame);
    this.languages = this.extractUniqueLanguages();
    this.editors = this.extractUniqueEditors();
    this.teams = this.extractUniqueTeams();
    this.seatsData = seatsData;
    this.teamsData = teamsData;
      // Store current filter for data refreshing
    if (filter) {
      this.currentFilter = filter;
    }
  }

  public filterLanguage(language: string): void {
    const item = this.languages.find((l) => l.value === language);
    if (item) {
      item.isSelected = !item.isSelected;
      this.applyFilters();
    }
  }
  public filterEditor(editor: string): void {
    const item = this.editors.find((l) => l.value === editor);
    if (item) {
      item.isSelected = !item.isSelected;
      this.applyFilters();
    }
  }  public filterTeam(team: string): void {
    const item = this.teams.find((t) => t.value === team);
    if (item) {
      item.isSelected = !item.isSelected;
      
      // Apply filters immediately for instant UI feedback
      this.applyFilters();
      
      // Mark that we have pending team changes (don't refresh data yet)
      this.hasPendingTeamChanges = true;
    }
  }

  public async refreshTeamDataIfNeeded(): Promise<void> {
    if (this.hasPendingTeamChanges) {
      // Get selected teams for server request
      const selectedTeams = this.teams.filter((t) => t.isSelected).map((t) => t.value);
      
      // Refresh data from server in the background
      await this.refreshDataWithTeams(selectedTeams);
      
      // Reset pending changes flag
      this.hasPendingTeamChanges = false;
    }
  }

  private async refreshDataWithTeams(selectedTeams: string[]): Promise<void> {
    this.isLoading = true;
    
    try {
      const result = await refreshMetricsData({
        ...this.currentFilter,
        teams: selectedTeams
      });
      
      if (result.success && result.data) {
        // Update the data and re-extract unique values
        this.apiData = [...result.data];
        this.languages = this.extractUniqueLanguages();
        this.editors = this.extractUniqueEditors();
        
        // Preserve team selections and reapply all filters
        const currentTeamSelections = this.teams.map(t => ({ value: t.value, isSelected: t.isSelected }));
        this.teams = this.extractUniqueTeams();
        
        // Restore team selections
        this.teams.forEach(team => {
          const previousSelection = currentTeamSelections.find(t => t.value === team.value);
          if (previousSelection) {
            team.isSelected = previousSelection.isSelected;
          }
        });
        
        this.applyFilters();
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
      // Could add error handling UI here
    } finally {
      this.isLoading = false;
    }
  }

  public toggleWeekendFilter(hide: boolean): void {
    this.hideWeekends = hide;
    this.applyFilters();
  }  public async resetAllFilters(): Promise<void> {
    this.languages.forEach((item) => (item.isSelected = false));
    this.editors.forEach((item) => (item.isSelected = false));
    this.teams.forEach((item) => (item.isSelected = false));
    this.hideWeekends = false;
    this.hasPendingTeamChanges = false;  // Reset pending changes
    this.applyFilters();
    
    // Refresh data from server (no URL changes)
    await this.refreshDataWithTeams([]);
  }

  public onTimeFrameChange(timeFrame: TimeFrame): void {
    this.timeFrame = timeFrame;
    this.applyFilters();
  }
  private applyFilters(): void {
    const data = this.aggregatedDataByTimeFrame(this.hideWeekends);

    const selectedLanguages = this.languages.filter((item) => item.isSelected);
    const selectedEditors = this.editors.filter((item) => item.isSelected);

    if (selectedLanguages.length !== 0) {
      data.forEach((item) => {
        const filtered = item.breakdown.filter((breakdown: Breakdown) =>
          selectedLanguages.some(
            (selectedLanguage) => selectedLanguage.value === breakdown.language
          )
        );
        item.breakdown = filtered;
      });
    }

    if (selectedEditors.length !== 0) {
      data.forEach((item) => {
        const filtered = item.breakdown.filter((breakdown: Breakdown) =>
          selectedEditors.some((editor) => editor.value === breakdown.editor)
        );
        item.breakdown = filtered;
      });
    }

    this.filteredData = data.filter((item) => item.breakdown.length > 0);
  }

  private extractUniqueLanguages(): DropdownFilterItem[] {
    const languages: DropdownFilterItem[] = [];

    this.apiData.forEach((item) => {
      item.breakdown.forEach((breakdown) => {
        const index = languages.findIndex(
          (language) => language.value === breakdown.language
        );

        if (index === -1) {
          languages.push({ value: breakdown.language, isSelected: false });
        }
      });
    });

    return languages.sort((a, b) => a.value.localeCompare(b.value));
  }
  private extractUniqueEditors(): DropdownFilterItem[] {
    const editors: DropdownFilterItem[] = [];
    this.apiData.forEach((item) => {
      item.breakdown.forEach((breakdown) => {
        const index = editors.findIndex(
          (editor) => editor.value === breakdown.editor
        );

        if (index === -1) {
          editors.push({ value: breakdown.editor, isSelected: false });
        }
      });
    });

    return editors.sort((a, b) => a.value.localeCompare(b.value));
  }
  private extractUniqueTeams(): DropdownFilterItem[] {
    const teams: DropdownFilterItem[] = [];

    // Use the fetched teams data instead of extracting from seats
    if (this.teamsData && this.teamsData.length > 0) {
      this.teamsData.forEach((team) => {
        if (team && team.name) {
          const teamName = team.name;
          const index = teams.findIndex((t) => t.value === teamName);

          if (index === -1) {
            teams.push({ value: teamName, isSelected: false });
          }
        }
      });
    }

    return teams.sort((a, b) => a.value.localeCompare(b.value));
  }

  private aggregatedDataByTimeFrame(hideWeekends: boolean) {
    let items = JSON.parse(
      JSON.stringify(this.apiData)
    ) as CopilotUsageOutput[];

    if (hideWeekends) {
      items = items.filter((item) => {
        const date = new Date(item.day);
        const day = date.getDay();
        return day !== 0 && day !== 6; // 0 is Sunday, 6 is Saturday
      });
    }

    if (this.timeFrame === "daily") {
      items.forEach((item) => {
        item.time_frame_display = formatDate(item.day);
      });
      return items;
    }

    const groupedByTimeFrame = items.reduce((acc, item) => {
      const timeFrameLabel =
        this.timeFrame === "weekly"
          ? item.time_frame_week
          : item.time_frame_month;

      if (!acc[timeFrameLabel]) {
        acc[timeFrameLabel] = [];
      }

      acc[timeFrameLabel].push(item);

      return acc;
    }, {} as Record<string, CopilotUsageOutput[]>);

    return groupByTimeFrame(groupedByTimeFrame);
  }
}

export const dashboardStore = proxy(new DashboardState());

export const useDashboard = () => {
  return useSnapshot(dashboardStore, { sync: true }) as DashboardState;
};

export const DataProvider = ({
  children,
  copilotUsages,
  seatsData,
  teamsData,
  filter,
}: IProps) => {
  dashboardStore.initData(copilotUsages, seatsData, teamsData, filter);
  return <>{children}</>;
};
