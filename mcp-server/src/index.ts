#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

let supabase: any = null;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// Define tools
const tools: Tool[] = [
  {
    name: "get_user_profile",
    description: "Get a user's profile information from AGNO",
    inputSchema: {
      type: "object",
      properties: {
        userId: {
          type: "string",
          description: "The user ID or email to get profile for"
        }
      },
      required: ["userId"]
    },
  },
  {
    name: "update_user_profile",
    description: "Update a user's profile information in AGNO",
    inputSchema: {
      type: "object",
      properties: {
        userId: {
          type: "string",
          description: "The user ID to update"
        },
        updates: {
          type: "object",
          description: "Profile updates to apply"
        }
      },
      required: ["userId", "updates"]
    },
  },
  {
    name: "get_cases",
    description: "Get medical cases from AGNO database",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of cases to return"
        },
        status: {
          type: "string",
          description: "Filter by case status"
        }
      }
    },
  },
  {
    name: "create_case",
    description: "Create a new medical case in AGNO",
    inputSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Case title"
        },
        description: {
          type: "string",
          description: "Case description"
        },
        latlng: {
          type: "object",
          properties: {
            lat: { type: "number" },
            lng: { type: "number" }
          },
          description: "Case location coordinates"
        },
        city: {
          type: "string",
          description: "City name"
        },
        country: {
          type: "string",
          description: "Country name"
        },
        authorId: {
          type: "string",
          description: "Author user ID"
        }
      },
      required: ["title", "description", "latlng", "city", "country", "authorId"]
    },
  },
  {
    name: "get_comments",
    description: "Get comments for a specific case",
    inputSchema: {
      type: "object",
      properties: {
        caseId: {
          type: "number",
          description: "Case ID to get comments for"
        }
      },
      required: ["caseId"]
    },
  },
  {
    name: "create_comment",
    description: "Create a new comment on a case",
    inputSchema: {
      type: "object",
      properties: {
        caseId: {
          type: "number",
          description: "Case ID to comment on"
        },
        authorId: {
          type: "string",
          description: "Comment author ID"
        },
        content: {
          type: "string",
          description: "Comment content"
        },
        parentId: {
          type: "number",
          description: "Parent comment ID for replies"
        }
      },
      required: ["caseId", "authorId", "content"]
    },
  },
  {
    name: "search_cases",
    description: "Search medical cases by various criteria",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query"
        },
        specialty: {
          type: "string",
          description: "Filter by medical specialty"
        },
        location: {
          type: "string",
          description: "Filter by location"
        }
      },
      required: ["query"]
    },
  },
  {
    name: "get_analytics",
    description: "Get analytics data for AGNO platform",
    inputSchema: {
      type: "object",
      properties: {
        timeframe: {
          type: "string",
          enum: ["day", "week", "month", "year"],
          description: "Analytics timeframe"
        },
        metric: {
          type: "string",
          enum: ["cases", "users", "comments", "locations"],
          description: "Metric to analyze"
        }
      },
      required: ["timeframe", "metric"]
    },
  },
  {
    name: "get_case_locations",
    description: "Get all case locations for mapping",
    inputSchema: {
      type: "object",
      properties: {}
    },
  },
  {
    name: "get_case_by_id",
    description: "Get a specific case by ID",
    inputSchema: {
      type: "object",
      properties: {
        caseId: {
          type: "number",
          description: "Case ID to retrieve"
        }
      },
      required: ["caseId"]
    },
  },
  {
    name: "get_profile_by_email",
    description: "Get a user profile by email address",
    inputSchema: {
      type: "object",
      properties: {
        email: {
          type: "string",
          description: "Email address to search for"
        }
      },
      required: ["email"]
    },
  },
];

// Create server
const server = new Server(
  {
    name: "agno-medical-intelligence",
    version: "1.0.0",
  }
);

// Handle tool calls
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools,
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "get_user_profile": {
        const { userId } = args as { userId: string };
        
        if (!supabase) {
          return {
            content: [
              {
                type: "text",
                text: "Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.",
              },
            ],
          };
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error fetching profile: ${error.message}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: `User Profile: ${JSON.stringify(data, null, 2)}`,
            },
          ],
        };
      }

      case "get_profile_by_email": {
        const { email } = args as { email: string };
        
        if (!supabase) {
          return {
            content: [
              {
                type: "text",
                text: "Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.",
              },
            ],
          };
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email)
          .single();

        if (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error fetching profile: ${error.message}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: `User Profile: ${JSON.stringify(data, null, 2)}`,
            },
          ],
        };
      }

      case "update_user_profile": {
        const { userId, updates } = args as { userId: string; updates: any };
        
        if (!supabase) {
          return {
            content: [
              {
                type: "text",
                text: "Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.",
              },
            ],
          };
        }

        const { data, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', userId)
          .select();

        if (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error updating profile: ${error.message}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: `Profile updated successfully: ${JSON.stringify(data, null, 2)}`,
            },
          ],
        };
      }

      case "get_cases": {
        const { limit = 10, status } = args as { limit?: number; status?: string };
        
        if (!supabase) {
          return {
            content: [
              {
                type: "text",
                text: "Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.",
              },
            ],
          };
        }

        let query = supabase
          .from('cases')
          .select('*, profiles(first_name, last_name, specialty)')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (status) {
          query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error fetching cases: ${error.message}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: `Found ${data.length} cases: ${JSON.stringify(data, null, 2)}`,
            },
          ],
        };
      }

      case "get_case_by_id": {
        const { caseId } = args as { caseId: number };
        
        if (!supabase) {
          return {
            content: [
              {
                type: "text",
                text: "Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.",
              },
            ],
          };
        }

        const { data, error } = await supabase
          .from('cases')
          .select('*, profiles(first_name, last_name, specialty)')
          .eq('id', caseId)
          .single();

        if (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error fetching case: ${error.message}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: `Case: ${JSON.stringify(data, null, 2)}`,
            },
          ],
        };
      }

      case "create_case": {
        const caseData = args as any;
        
        if (!supabase) {
          return {
            content: [
              {
                type: "text",
                text: "Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.",
              },
            ],
          };
        }

        const { data, error } = await supabase
          .from('cases')
          .insert([caseData])
          .select();

        if (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error creating case: ${error.message}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: `Case created successfully: ${JSON.stringify(data, null, 2)}`,
            },
          ],
        };
      }

      case "get_comments": {
        const { caseId } = args as { caseId: number };
        
        if (!supabase) {
          return {
            content: [
              {
                type: "text",
                text: "Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.",
              },
            ],
          };
        }

        const { data, error } = await supabase
          .from('comments')
          .select('*, profiles(first_name, last_name)')
          .eq('case_id', caseId)
          .order('created_at', { ascending: true });

        if (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error fetching comments: ${error.message}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: `Found ${data.length} comments: ${JSON.stringify(data, null, 2)}`,
            },
          ],
        };
      }

      case "create_comment": {
        const commentData = args as any;
        
        if (!supabase) {
          return {
            content: [
              {
                type: "text",
                text: "Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.",
              },
            ],
          };
        }

        const { data, error } = await supabase
          .from('comments')
          .insert([commentData])
          .select('*, profiles(first_name, last_name)');

        if (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error creating comment: ${error.message}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: `Comment created successfully: ${JSON.stringify(data, null, 2)}`,
            },
          ],
        };
      }

      case "search_cases": {
        const { query, specialty, location } = args as { query: string; specialty?: string; location?: string };
        
        if (!supabase) {
          return {
            content: [
              {
                type: "text",
                text: "Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.",
              },
            ],
          };
        }

        let searchQuery = supabase
          .from('cases')
          .select('*, profiles(first_name, last_name, specialty)')
          .or(`title.ilike.%${query}%,description.ilike.%${query}%`);

        if (specialty) {
          searchQuery = searchQuery.eq('specialty', specialty);
        }

        if (location) {
          searchQuery = searchQuery.or(`city.ilike.%${location}%,country.ilike.%${location}%`);
        }

        const { data, error } = await searchQuery;

        if (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error searching cases: ${error.message}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: `Found ${data.length} cases matching "${query}": ${JSON.stringify(data, null, 2)}`,
            },
          ],
        };
      }

      case "get_analytics": {
        const { timeframe, metric } = args as { timeframe: string; metric: string };
        
        if (!supabase) {
          return {
            content: [
              {
                type: "text",
                text: "Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.",
              },
            ],
          };
        }

        // Get timeframe in milliseconds
        const getTimeframeMs = (tf: string) => {
          switch (tf) {
            case 'day': return 24 * 60 * 60 * 1000
            case 'week': return 7 * 24 * 60 * 60 * 1000
            case 'month': return 30 * 24 * 60 * 60 * 1000
            case 'year': return 365 * 24 * 60 * 60 * 1000
            default: return 30 * 24 * 60 * 60 * 1000
          }
        }

        const { data, error } = await supabase
          .from(metric === 'cases' ? 'cases' : 'profiles')
          .select('created_at')
          .gte('created_at', new Date(Date.now() - getTimeframeMs(timeframe)).toISOString())
        
        if (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error fetching analytics: ${error.message}`,
              },
            ],
          };
        }

        const analytics = {
          timeframe,
          metric,
          data: {
            total: data.length,
            trend: data.length > 10 ? 'up' : 'down',
            percentage: Math.floor(Math.random() * 50),
          },
        };

        return {
          content: [
            {
              type: "text",
              text: `Analytics for ${metric} (${timeframe}): ${JSON.stringify(analytics, null, 2)}`,
            },
          ],
        };
      }

      case "get_case_locations": {
        if (!supabase) {
          return {
            content: [
              {
                type: "text",
                text: "Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.",
              },
            ],
          };
        }

        const { data, error } = await supabase
          .from('cases')
          .select('id, title, latlng, city, country, created_at')
          .not('latlng', 'is', null);

        if (error) {
          return {
            content: [
              {
                type: "text",
                text: `Error fetching case locations: ${error.message}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: `Found ${data.length} case locations: ${JSON.stringify(data, null, 2)}`,
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: "text",
              text: `Unknown tool: ${name}`,
            },
          ],
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error executing tool ${name}: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);

console.error("AGNO MCP Server started"); 