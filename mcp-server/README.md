# AGNO Medical Intelligence MCP Server

This MCP (Model Context Protocol) server provides tools for interacting with the AGNO Medical Intelligence platform, including user profiles, medical cases, comments, and analytics.

## Features

### Available Tools

1. **get_user_profile** - Retrieve user profile information
2. **update_user_profile** - Update user profile data
3. **get_cases** - Fetch medical cases with optional filtering
4. **create_case** - Create new medical cases
5. **get_comments** - Retrieve comments for a specific case
6. **create_comment** - Add new comments to cases
7. **search_cases** - Search cases by various criteria
8. **get_analytics** - Get platform analytics data
9. **get_case_locations** - Get all case locations for mapping

## Setup

### Prerequisites

- Node.js 18+ 
- Supabase project with configured database
- Environment variables for Supabase connection

### Installation

1. **Install dependencies:**
   ```bash
   cd mcp-server
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the mcp-server directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Build the server:**
   ```bash
   npm run build
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

### Development

For development with auto-reload:
```bash
npm run dev
```

For watching file changes:
```bash
npm run watch
```

## Usage

### Tool Examples

#### Get User Profile
```json
{
  "name": "get_user_profile",
  "arguments": {
    "userId": "user@example.com"
  }
}
```

#### Create Medical Case
```json
{
  "name": "create_case",
  "arguments": {
    "title": "Pediatric Respiratory Case",
    "description": "Complex pediatric respiratory infection case",
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

#### Search Cases
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

#### Get Analytics
```json
{
  "name": "get_analytics",
  "arguments": {
    "timeframe": "month",
    "metric": "cases"
  }
}
```

## Configuration

### MCP Client Configuration

Add this to your MCP client configuration:

```json
{
  "mcpServers": {
    "agno-medical-intelligence": {
      "command": "node",
      "args": ["/path/to/mcp-server/dist/index.js"],
      "env": {
        "VITE_SUPABASE_URL": "your_supabase_url",
        "VITE_SUPABASE_ANON_KEY": "your_supabase_anon_key"
      }
    }
  }
}
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

## Database Schema

The MCP server expects the following Supabase tables:

### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  specialty TEXT,
  institution TEXT,
  bio TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  profile_visibility TEXT DEFAULT 'public',
  credentials JSONB DEFAULT '[]',
  social JSONB DEFAULT '{"linkedin": "", "twitter": "", "website": "", "email": ""}',
  badges JSONB DEFAULT '[]',
  skills TEXT[] DEFAULT '{}',
  publications JSONB DEFAULT '[]',
  education JSONB DEFAULT '[]',
  memberships JSONB DEFAULT '[]',
  research_projects JSONB DEFAULT '[]',
  awards JSONB DEFAULT '[]',
  languages TEXT[] DEFAULT '{}',
  recent_cases JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Cases Table
```sql
CREATE TABLE cases (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  patient_info JSONB,
  symptoms TEXT[],
  diagnosis TEXT,
  treatment TEXT,
  outcome TEXT,
  latlng JSONB,
  city TEXT,
  country TEXT,
  status TEXT DEFAULT 'active',
  author_id UUID REFERENCES profiles(id),
  tags TEXT[] DEFAULT '{}',
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Comments Table
```sql
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  case_id INTEGER REFERENCES cases(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Error Handling

The server provides detailed error messages for:
- Missing Supabase configuration
- Database connection issues
- Invalid input parameters
- Row Level Security violations
- General execution errors

## Security

- Row Level Security (RLS) policies are enforced
- Input validation using Zod schemas
- Environment variable protection
- Proper error handling without exposing sensitive data

## Troubleshooting

### "Supabase not configured"
- Check that environment variables are set correctly
- Verify the `.env` file exists in the mcp-server directory
- Restart the server after changing environment variables

### "Row Level Security policy violation"
- Ensure user authentication is working
- Check RLS policies in Supabase dashboard
- Verify user permissions

### "Tool execution error"
- Check server logs for detailed error messages
- Verify input parameters match expected schemas
- Ensure database tables exist and are properly configured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details 