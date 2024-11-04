using Microsoft.DevOpsDashboard.DataIngestion.Functions;
using Microsoft.DevOpsDashboard.DataIngestion.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Net.Http.Headers;
using System.Net.Http;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices((hostContext, services) =>
    {
        //Configure GitHub HttpClient
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

        services.AddHttpClient<GitHubCopilotUsageClient>();
    })
    .Build();

host.Run();
