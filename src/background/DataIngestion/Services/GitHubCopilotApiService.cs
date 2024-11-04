﻿using Microsoft.DevOpsDashboard.DataIngestion.Domain;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Microsoft.DevOpsDashboard.DataIngestion.Services
{
    public class GitHubCopilotApiService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger _logger;
        public GitHubCopilotApiService(HttpClient httpClient, ILogger<GitHubCopilotApiService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<GitHubCopilotAssignedSeats> GetEnterpriseAssignedSeatsAsync(string enterprise)
        {
            var token = Environment.GetEnvironmentVariable("GITHUB_TOKEN")!;
            return await GetEnterpriseAssignedSeatsAsync(enterprise, token);

        }

        public async Task<GitHubCopilotAssignedSeats> GetEnterpriseAssignedSeatsAsync(string enterprise, string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                _logger.LogError("Token is null or empty");
                throw new ArgumentNullException(nameof(token));
            }
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

            var url = $"/enterprises/{enterprise}/copilot/billing/seats";
            var response = await _httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError($"Error fetching data: {response.StatusCode}", response.Content);
                throw new HttpRequestException($"Error fetching data: {response.StatusCode}");
            }
            var content = await response.Content.ReadAsStringAsync();
            var data = JsonSerializer.Deserialize<GitHubCopilotAssignedSeats>(content)!;
            data.Enterprise = enterprise;
            data.LastUpdate = DateTime.UtcNow;
            data.Day = data.LastUpdate.ToString("yyyy-MM-dd");
            return data;
        }

        public async Task<GitHubCopilotAssignedSeats> GetOrganizationAssignedSeatsAsync(string organization)
        {
            var token = Environment.GetEnvironmentVariable("GITHUB_TOKEN")!;
            return await GetOrganizationAssignedSeatsAsync(organization, token);

        }

        public async Task<GitHubCopilotAssignedSeats> GetOrganizationAssignedSeatsAsync(string organization, string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                _logger.LogError("Token is null or empty");
                throw new ArgumentNullException(nameof(token));
            }
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

            var url = $"/orgs/{organization}/copilot/billing/seats";
            _logger.LogInformation($"Fetching data from {url}");
            var response = await _httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError($"Error fetching data: {response.StatusCode}", response.Content);
                throw new HttpRequestException($"Error fetching data: {response.StatusCode}");
            }
            var content = await response.Content.ReadAsStringAsync();
            _logger.LogTrace(content);
            var data = JsonSerializer.Deserialize<GitHubCopilotAssignedSeats>(content)!;
            data.Organization = organization;
            data.LastUpdate = DateTime.UtcNow;
            data.Day = data.LastUpdate.ToString("yyyy-MM-dd");
            _logger.LogTrace($"Data fetched: {data}");
            return data;
        }
    }
}
