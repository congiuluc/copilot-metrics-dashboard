import {
  formatResponseError,
  unknownResponseError,
} from "@/features/common/response-error";
import { ServerActionResponse } from "@/features/common/server-action-response";
import { ensureGitHubEnvConfig } from "./env-service";
import { CopilotSeatsData } from "../features/common/models";
import { cosmosClient } from "./cosmos-db-service";
import { format } from "date-fns";
import { SqlQuerySpec } from "@azure/cosmos";

export interface IFilter {
  date?: Date;
  enterprise: string;
  organization: string;
  team: string; 
}


export const getCopilotSeats = async (
  filter: IFilter
): Promise<
  ServerActionResponse<CopilotSeatsData>
> => {
  const env = ensureGitHubEnvConfig();

  if (env.status !== "OK") {
    return env;
  }

  const { enterprise, organization, token, version } = env.response;

  try {

    switch (process.env.GITHUB_API_SCOPE) {

      case "enterprise":
        filter.enterprise = enterprise;
        break;
      default:
        filter.organization = organization;
        break;
    }
    return getCopilotSeatsFromDatabase(filter);
  } catch (e) {
    return unknownResponseError(e);
  }
};

const getCopilotSeatsFromDatabase = async (
  filter: IFilter
): Promise<ServerActionResponse<CopilotSeatsData>> => {
  const client = cosmosClient();
  const database = client.database("platform-engineering");
  const container = database.container("seats_history");

  let date = "";
  const maxDays = 365 * 2; // maximum 2 years of data

  if (filter.date) {
    date = format(filter.date, "yyyy-MM-dd");
  }else{
    const today = new Date();
    date = format(today, "yyyy-MM-dd");
  }

  
  let querySpec: SqlQuerySpec = {
    query: `SELECT * FROM c WHERE c.day = @date`,
    parameters: [
      { name: "@date", value: date }
    ],
  };
  if (filter.enterprise) {
    querySpec.query += ` AND c.enterprise = @enterprise`;
    querySpec.parameters?.push({ name: "@enterprise", value: filter.enterprise });
  } 
  if (filter.organization) {
    querySpec.query += ` AND c.organization = @organization`;
    querySpec.parameters?.push({ name: "@organization", value: filter.organization });
  }
  if (filter.team) {
    querySpec.query += ` AND c.team = @team`;
    querySpec.parameters?.push({ name: "@team", value: filter.team });
  }

  const { resources } = await container.items
    .query<CopilotSeatsData>(querySpec, {
      maxItemCount: maxDays,
    })
    .fetchAll();

 // const dataWithTimeFrame = applyTimeFrameLabel(resources);
  return {
    status: "OK",
    response: resources[0],
  };
};