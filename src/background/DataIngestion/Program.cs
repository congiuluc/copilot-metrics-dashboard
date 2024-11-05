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
        string githubBaseApiUrl = hostContext.Configuration.GetValue<string>("GITHUB_API_BASEURL") ?? "https://api.github.com/";
        string apiVersion = hostContext.Configuration.GetValue<string>("GITHUB_API_VERSION") ?? "2022-11-28";

        //Configure generic GitHub HttpClient
        services.AddHttpClient<GitHubCopilotApiService>(client =>
        {
            client.BaseAddress = new Uri(githubBaseApiUrl);
            client.DefaultRequestHeaders.Add(HeaderNames.Accept, "application/vnd.github.v3+json");
            client.DefaultRequestHeaders.Add(HeaderNames.UserAgent, "GitHubCopilotDataIngestion");
            client.DefaultRequestHeaders.Add("X-GitHub-Api-Version", apiVersion);
        });

        services.AddHttpClient<GitHubCopilotUsageClient>(client => 
        {
            var token = Environment.GetEnvironmentVariable("GITHUB_TOKEN");
            client.BaseAddress = new Uri(githubBaseApiUrl);
            client.DefaultRequestHeaders.Add(HeaderNames.Accept, "application/vnd.github.v3+json");
            client.DefaultRequestHeaders.Add(HeaderNames.Authorization, $"Bearer {token}");
            client.DefaultRequestHeaders.Add(HeaderNames.UserAgent, "GitHubCopilotDataIngestion");
            client.DefaultRequestHeaders.Add("X-GitHub-Api-Version", apiVersion);
        });
    })
    .Build();

host.Run();