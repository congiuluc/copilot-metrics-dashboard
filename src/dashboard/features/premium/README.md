# Premium Requests Dashboard

The Premium Requests Dashboard allows users to upload CSV files containing GitHub Copilot premium request data and visualize key metrics and insights.

## Features

### Data Upload
- **CSV File Upload**: Drag-and-drop or click to browse for CSV files
- **Data Validation**: Ensures proper CSV format and required columns
- **Sample Data**: Download button provides example CSV format
- **Error Handling**: Clear error messages for invalid files or formats

### Required CSV Format
```
Timestamp,User,Model,Requests Used,Exceeds Monthly Quota,Total Monthly Quota
2025-06-06T08:09:58Z,user_1,gpt-4.1-2025-04-14,1.0,False,Unlimited
```

### Analytics Dashboard

#### Statistics Cards
- **Total Premium Requests**: Sum of all requests used across all users and models
- **Total Unique Users**: Number of distinct users who made premium requests  
- **Total Models**: Number of unique models used for premium requests
- **Total Interactions**: Total number of individual request records/interactions
- **Average User Requests**: Average number of requests per user

#### Visualizations
- **Models for Requests**: Bar chart showing request count and user count per model
- **Models Usage**: Pie chart showing percentage distribution of requests by model

## Usage

1. Navigate to `/premium` in the dashboard
2. Upload a CSV file with the required format, or download the sample CSV first
3. View automatically generated analytics and visualizations
4. Explore interactive charts with tooltips and legends

## Technical Implementation

- Built with React and TypeScript
- Uses Recharts for data visualization
- Implements proper state management with Valtio
- Follows existing dashboard patterns and conventions
- Includes comprehensive error handling and validation
- Responsive design works on desktop and mobile