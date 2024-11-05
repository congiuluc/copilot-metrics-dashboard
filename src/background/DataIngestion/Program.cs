using Microsoft.CopilotDashboard.DataIngestion.Functions;
using Microsoft.CopilotDashboard.DataIngestion.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Net.Http.Headers;
using System.Net.Http;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices((hostContext, services) =>
    {
        //Configure generic GitHub HttpClient
        services.AddHttpClient<GitHubCopilotApiService>(httpClient =>
        {
            string githubBaseApiUrl = hostContext.Configuration.GetValue<string>("GITHUB_API_BASEURL") ?? "https://api.github.com/";
            string apiVersion = hostContext.Configuration.GetValue<string>("GITHUB_API_VERSION") ?? "2022-11-28";

            httpClient.BaseAddress = new Uri(githubBaseApiUrl);
            // The GitHub API requires two headers.
            httpClient.DefaultRequestHeaders.Add(HeaderNames.Accept, "application/vnd.github.v3+json");
            httpClient.DefaultRequestHeaders.Add(HeaderNames.UserAgent, "GitHubCoPilotIngestion");
            // API Version
            httpClient.DefaultRequestHeaders.Add("X-GitHub-Api-Version", apiVersion);
        });

        services.AddHttpClient<GitHubCopilotUsageClient>(client => 
        {
            var apiVersion = Environment.GetEnvironmentVariable("GITHUB_API_VERSION");
            var token = Environment.GetEnvironmentVariable("GITHUB_TOKEN");

            client.BaseAddress = new Uri("https://api.github.com/");
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/vnd.github+json"));
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            client.DefaultRequestHeaders.Add("X-GitHub-Api-Version", apiVersion);
            client.DefaultRequestHeaders.Add("User-Agent", "GitHubCopilotDataIngestion");
        });
    })
    .Build();

host.Run();
