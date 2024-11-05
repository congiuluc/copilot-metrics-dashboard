using System;
using Microsoft.Azure.Functions.Worker;
using Microsoft.CopilotDashboard.DataIngestion.Domain;
using Microsoft.CopilotDashboard.DataIngestion.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Microsoft.CopilotDashboard.DataIngestion.Functions;

public class GitHubCopilotSeatsDataIngestion
{
    private readonly ILogger _logger;
    private readonly IConfiguration _configuration;
    private readonly GitHubCopilotApiService _gitHubCopilotApiService;
    
    public GitHubCopilotSeatsDataIngestion(GitHubCopilotApiService gitHubCopilotApiService, IConfiguration configuration, ILogger<GitHubCopilotSeatsDataIngestion> logger)
    {
        _gitHubCopilotApiService = gitHubCopilotApiService;
        _configuration = configuration;
        _logger = logger;
    }

    [Function(nameof(GitHubCopilotSeatsDataIngestion))]
    [CosmosDBOutput(databaseName: "platform-engineering", containerName: "seats_history", Connection = "AZURE_COSMOSDB_ENDPOINT", CreateIfNotExists = true)]
    public async Task<GitHubCopilotAssignedSeats> Run([TimerTrigger("0 0 * * * *")] TimerInfo myTimer)
    {
        _logger.LogInformation($"GitHubCopilotDataIngestion timer trigger function executed at: {DateTime.Now}");

        GitHubCopilotAssignedSeats seats;

        var token = Environment.GetEnvironmentVariable("GITHUB_TOKEN")!;
        var scope = Environment.GetEnvironmentVariable("GITHUB_API_SCOPE")!;
        if (!string.IsNullOrWhiteSpace(scope) && scope == "enterprise")
        {
            var enterprise = Environment.GetEnvironmentVariable("GITHUB_ENTERPRISE")!;
            _logger.LogInformation("Fetching GitHub Copilot seats for enterprise");
            seats = await _gitHubCopilotApiService.GetEnterpriseAssignedSeatsAsync(enterprise, token);
        }
        else
        {
            var organization = Environment.GetEnvironmentVariable("GITHUB_ORGANIZATION")!;
            _logger.LogInformation("Fetching GitHub Copilot seats for organization");
            seats = await _gitHubCopilotApiService.GetOrganizationAssignedSeatsAsync(organization, token);
        }

        if (myTimer.ScheduleStatus is not null)
        {
            _logger.LogInformation($"Finished ingestion. Next timer schedule at: {myTimer.ScheduleStatus.Next}");
        }

        return seats;
    }
}
