# AGNO Medical Intelligence MCP Server Setup

This guide will help you set up and use the MCP (Model Context Protocol) server for AGNO Medical Intelligence.

## What is MCP?

MCP (Model Context Protocol) is a protocol that allows AI assistants to interact with external tools and data sources. Our AGNO MCP server provides tools for:

- User profile management
- Medical case operations
- Comment system
- Analytics and reporting
- Location-based case mapping

## Prerequisites

- Node.js 18+ installed
- Supabase project set up (optional, for full functionality)
- MCP-compatible client (like Claude Desktop, Cursor, etc.)

## Quick Setup

### 1. Install Dependencies

```bash
cd mcp-server
npm install
```

### 2. Build the Server

```bash
npm run build
```

### 3. Test the Server

```bash
node test.js
```

You should see output indicating the server is working correctly.

## Configuration

### Environment Variables

Create a `.env` file in the `mcp-server` directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note:** If you don't have Supabase set up, the server will still work but will return configuration warnings for database operations.

### MCP Client Configuration

Add this to your MCP client configuration file:

```json
{
  "mcpServers": {
    "agno-medical-intelligence": {
      "command": "node",
      "args": ["/path/to/agno_medical_intelligence/mcp-server/dist/index.js"],
      "env": {
        "VITE_SUPABASE_URL": "your_supabase_url",
        "VITE_SUPABASE_ANON_KEY": "your_supabase_anon_key"
      }
    }
  }
}
```

## Available Tools

### 1. User Profile Tools

#### `get_user_profile`
Retrieve a user's profile information.

**Parameters:**
- `userId` (string): The user ID or email

**Example:**
```json
{
  "name": "get_user_profile",
  "arguments": {
    "userId": "user@example.com"
  }
}
```

#### `update_user_profile`
Update a user's profile information.

**Parameters:**
- `userId` (string): The user ID to update
- `updates` (object): Profile updates to apply

**Example:**
```json
{
  "name": "update_user_profile",
  "arguments": {
    "userId": "user@example.com",
    "updates": {
      "bio": "Updated bio text",
      "specialty": "Cardiology"
    }
  }
}
```

### 2. Case Management Tools

#### `get_cases`
Fetch medical cases with optional filtering.

**Parameters:**
- `limit` (number, optional): Maximum number of cases to return
- `status` (string, optional): Filter by case status

**Example:**
```json
{
  "name": "get_cases",
  "arguments": {
    "limit": 10,
    "status": "active"
  }
}
```

#### `create_case`
Create a new medical case.

**Parameters:**
- `title` (string): Case title
- `description` (string): Case description
- `latlng` (object): Location coordinates with `lat` and `lng`
- `city` (string): City name
- `country` (string): Country name
- `authorId` (string): Author user ID

**Example:**
```json
{
  "name": "create_case",
  "arguments": {
    "title": "Pediatric Respiratory Case",
    "description": "Complex pediatric respiratory infection",
    "latlng": {
      "lat": 40.7128,
      "lng": -74.0060
    },
    "city": "New York",
    "country": "USA",
    "authorId": "user-uuid"
  }
}
```

#### `search_cases`
Search medical cases by various criteria.

**Parameters:**
- `query` (string): Search query
- `specialty` (string, optional): Filter by medical specialty
- `location` (string, optional): Filter by location

**Example:**
```json
{
  "name": "search_cases",
  "arguments": {
    "query": "respiratory",
    "specialty": "pediatrics",
    "location": "New York"
  }
}
```

### 3. Comment System Tools

#### `get_comments`
Get comments for a specific case.

**Parameters:**
- `caseId` (number): Case ID to get comments for

**Example:**
```json
{
  "name": "get_comments",
  "arguments": {
    "caseId": 123
  }
}
```

#### `create_comment`
Create a new comment on a case.

**Parameters:**
- `caseId` (number): Case ID to comment on
- `authorId` (string): Comment author ID
- `content` (string): Comment content
- `parentId` (number, optional): Parent comment ID for replies

**Example:**
```json
{
  "name": "create_comment",
  "arguments": {
    "caseId": 123,
    "authorId": "user-uuid",
    "content": "This is a helpful comment",
    "parentId": 456
  }
}
```

### 4. Analytics Tools

#### `get_analytics`
Get analytics data for the AGNO platform.

**Parameters:**
- `timeframe` (string): Analytics timeframe ("day", "week", "month", "year")
- `metric` (string): Metric to analyze ("cases", "users", "comments", "locations")

**Example:**
```json
{
  "name": "get_analytics",
  "arguments": {
    "timeframe": "month",
    "metric": "cases"
  }
}
```

### 5. Mapping Tools

#### `get_case_locations`
Get all case locations for mapping.

**Parameters:** None

**Example:**
```json
{
  "name": "get_case_locations",
  "arguments": {}
}
```

## Usage Examples

### With Claude Desktop

1. Open Claude Desktop
2. Go to Settings → MCP
3. Add the server configuration
4. Restart Claude Desktop
5. Ask questions like:
   - "Show me all medical cases in New York"
   - "Create a new case about a pediatric respiratory infection"
   - "Get analytics for user growth this month"

### With Cursor

1. Open Cursor
2. Go to Settings → Extensions → MCP
3. Add the server configuration
4. Restart Cursor
5. Use the tools in your conversations

## Development

### Running in Development Mode

```bash
npm run dev
```

### Watching for Changes

```bash
npm run watch
```

### Adding New Tools

1. Add the tool definition to the `tools` array in `src/index.ts`
2. Add the tool handler in the switch statement
3. Rebuild the server: `npm run build`

## Troubleshooting

### "Supabase not configured"
- Check that your `.env` file exists and has the correct variables
- Verify the environment variables are being passed to the MCP client
- Restart your MCP client after changing configuration

### "Tool execution error"
- Check the server logs for detailed error messages
- Verify your Supabase database is properly set up
- Ensure the required tables exist in your database

### "Server not responding"
- Verify the server is built correctly: `npm run build`
- Check that the path in your MCP client configuration is correct
- Test the server manually: `node test.js`

## Security Considerations

- The server uses Row Level Security (RLS) when connected to Supabase
- Environment variables are used for sensitive configuration
- Input validation is performed on all tool parameters
- Error messages don't expose sensitive information

## Next Steps

1. **Set up Supabase**: Follow the Supabase setup guide to enable full functionality
2. **Customize tools**: Add new tools specific to your medical intelligence needs
3. **Integrate with your workflow**: Use the MCP server in your daily AI interactions
4. **Extend functionality**: Add more sophisticated analytics and reporting tools

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify your configuration is correct
3. Test the server manually with `node test.js`
4. Check the server logs for detailed error messages

## License

MIT License - see LICENSE file for details 