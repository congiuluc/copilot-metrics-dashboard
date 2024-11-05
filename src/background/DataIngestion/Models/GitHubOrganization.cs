using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Microsoft.CopilotDashboard.DataIngestion.Domain;

public class GitHubOrganization
{
    /// <summary>
    /// Gets or sets the login name of the organization.
    /// </summary>
    [JsonPropertyName("login")]
    public string Login { get; set; }

    /// <summary>
    /// Gets or sets the ID of the organization.
    /// </summary>
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the node ID of the organization.
    /// </summary>
    [JsonPropertyName("node_id")]
    public string NodeId { get; set; }

    /// <summary>
    /// Gets or sets the URL of the organization.
    /// </summary>
    [JsonPropertyName("url")]
    public string Url { get; set; }

    /// <summary>
    /// Gets or sets the repositories URL of the organization.
    /// </summary>
    [JsonPropertyName("repos_url")]
    public string ReposUrl { get; set; }

    /// <summary>
    /// Gets or sets the events URL of the organization.
    /// </summary>
    [JsonPropertyName("events_url")]
    public string EventsUrl { get; set; }

    /// <summary>
    /// Gets or sets the hooks URL of the organization.
    /// </summary>
    [JsonPropertyName("hooks_url")]
    public string HooksUrl { get; set; }

    /// <summary>
    /// Gets or sets the issues URL of the organization.
    /// </summary>
    [JsonPropertyName("issues_url")]
    public string IssuesUrl { get; set; }

    /// <summary>
    /// Gets or sets the members URL of the organization.
    /// </summary>
    [JsonPropertyName("members_url")]
    public string MembersUrl { get; set; }

    /// <summary>
    /// Gets or sets the public members URL of the organization.
    /// </summary>
    [JsonPropertyName("public_members_url")]
    public string PublicMembersUrl { get; set; }

    /// <summary>
    /// Gets or sets the avatar URL of the organization.
    /// </summary>
    [JsonPropertyName("avatar_url")]
    public string AvatarUrl { get; set; }

    /// <summary>
    /// Gets or sets the description of the organization.
    /// </summary>
    [JsonPropertyName("description")]
    public string Description { get; set; }
}
