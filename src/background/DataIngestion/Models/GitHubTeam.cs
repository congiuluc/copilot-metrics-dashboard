using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Microsoft.CopilotDashboard.DataIngestion.Domain;

public class GitHubTeam
{
    /// <summary>
    /// Gets or sets the ID of the team.
    /// </summary>
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the node ID of the team.
    /// </summary>
    [JsonPropertyName("node_id")]
    public string NodeId { get; set; }

    /// <summary>
    /// Gets or sets the URL of the team.
    /// </summary>
    [JsonPropertyName("url")]
    public string Url { get; set; }

    /// <summary>
    /// Gets or sets the HTML URL of the team.
    /// </summary>
    [JsonPropertyName("html_url")]
    public string HtmlUrl { get; set; }

    /// <summary>
    /// Gets or sets the name of the team.
    /// </summary>
    [JsonPropertyName("name")]
    public string Name { get; set; }

    /// <summary>
    /// Gets or sets the slug of the team.
    /// </summary>
    [JsonPropertyName("slug")]
    public string Slug { get; set; }

    /// <summary>
    /// Gets or sets the description of the team.
    /// </summary>
    [JsonPropertyName("description")]
    public string Description { get; set; }

    /// <summary>
    /// Gets or sets the privacy setting of the team.
    /// </summary>
    [JsonPropertyName("privacy")]
    public string Privacy { get; set; }

    /// <summary>
    /// Gets or sets the notification setting of the team.
    /// </summary>
    [JsonPropertyName("notification_setting")]
    public string NotificationSetting { get; set; }

    /// <summary>
    /// Gets or sets the permission level of the team.
    /// </summary>
    [JsonPropertyName("permission")]
    public string Permission { get; set; }

    /// <summary>
    /// Gets or sets the members URL of the team.
    /// </summary>
    [JsonPropertyName("members_url")]
    public string MembersUrl { get; set; }

    /// <summary>
    /// Gets or sets the repositories URL of the team.
    /// </summary>
    [JsonPropertyName("repositories_url")]
    public string RepositoriesUrl { get; set; }

    /// <summary>
    /// Gets or sets the parent team.
    /// </summary>
    [JsonPropertyName("parent")]
    public object Parent { get; set; }
}
