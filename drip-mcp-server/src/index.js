#!/usr/bin/env node

/**
 * Drip MCP Server
 * Model Context Protocol server for Drip email service provider
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import { DripClient } from './drip-client.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Drip client
const dripClient = new DripClient(
  process.env.DRIP_API_TOKEN,
  process.env.DRIP_ACCOUNT_ID
);

// Create MCP server
const server = new Server(
  {
    name: 'drip-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ============================================================================
// TOOL DEFINITIONS
// ============================================================================

const TOOLS = [
  // Subscriber Management
  {
    name: 'drip_create_subscriber',
    description: 'Create or update a subscriber in Drip. Use this to add new leads from forms, tag them, and set custom fields.',
    inputSchema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Subscriber email address (required)',
        },
        first_name: {
          type: 'string',
          description: 'Subscriber first name',
        },
        last_name: {
          type: 'string',
          description: 'Subscriber last name',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of tags to apply (e.g., ["calculator_user", "newsletter_subscriber"])',
        },
        custom_fields: {
          type: 'object',
          description: 'Custom field key-value pairs (e.g., {"estimated_cost": "12000", "calculator_date": "2025-01-15"})',
        },
        status: {
          type: 'string',
          enum: ['active', 'unsubscribed'],
          description: 'Subscriber status (default: active)',
        },
      },
      required: ['email'],
    },
  },
  {
    name: 'drip_get_subscriber',
    description: 'Get detailed information about a subscriber by email or ID',
    inputSchema: {
      type: 'object',
      properties: {
        email_or_id: {
          type: 'string',
          description: 'Subscriber email address or ID',
        },
      },
      required: ['email_or_id'],
    },
  },
  {
    name: 'drip_list_subscribers',
    description: 'List subscribers with optional filters (by status, tags, etc.)',
    inputSchema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['active', 'unsubscribed', 'undeliverable'],
          description: 'Filter by subscriber status',
        },
        tags: {
          type: 'string',
          description: 'Comma-separated list of tags to filter by',
        },
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
        },
      },
    },
  },
  {
    name: 'drip_delete_subscriber',
    description: 'Permanently delete a subscriber from Drip',
    inputSchema: {
      type: 'object',
      properties: {
        email_or_id: {
          type: 'string',
          description: 'Subscriber email address or ID',
        },
      },
      required: ['email_or_id'],
    },
  },
  {
    name: 'drip_unsubscribe_subscriber',
    description: 'Unsubscribe a subscriber from all mailings',
    inputSchema: {
      type: 'object',
      properties: {
        email_or_id: {
          type: 'string',
          description: 'Subscriber email address or ID',
        },
      },
      required: ['email_or_id'],
    },
  },

  // Tag Management
  {
    name: 'drip_tag_subscriber',
    description: 'Apply a tag to a subscriber (e.g., "calculator_user", "surgeon_researcher")',
    inputSchema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Subscriber email address',
        },
        tag: {
          type: 'string',
          description: 'Tag name to apply',
        },
      },
      required: ['email', 'tag'],
    },
  },
  {
    name: 'drip_untag_subscriber',
    description: 'Remove a tag from a subscriber',
    inputSchema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Subscriber email address',
        },
        tag: {
          type: 'string',
          description: 'Tag name to remove',
        },
      },
      required: ['email', 'tag'],
    },
  },
  {
    name: 'drip_list_tags',
    description: 'List all tags in the Drip account',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Custom Fields
  {
    name: 'drip_update_custom_fields',
    description: 'Update custom fields for a subscriber (e.g., estimated_cost, calculator_date, procedure_interest)',
    inputSchema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Subscriber email address',
        },
        custom_fields: {
          type: 'object',
          description: 'Custom field key-value pairs',
        },
      },
      required: ['email', 'custom_fields'],
    },
  },
  {
    name: 'drip_list_custom_fields',
    description: 'List all custom field identifiers in the account',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Campaign Management
  {
    name: 'drip_list_campaigns',
    description: 'List all email campaigns (email series/sequences)',
    inputSchema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['active', 'paused', 'draft'],
          description: 'Filter by campaign status',
        },
        page: {
          type: 'number',
          description: 'Page number for pagination',
        },
      },
    },
  },
  {
    name: 'drip_get_campaign',
    description: 'Get detailed information about a specific campaign',
    inputSchema: {
      type: 'object',
      properties: {
        campaign_id: {
          type: 'string',
          description: 'Campaign ID',
        },
      },
      required: ['campaign_id'],
    },
  },
  {
    name: 'drip_get_campaign_subscribers',
    description: 'Get list of subscribers in a campaign',
    inputSchema: {
      type: 'object',
      properties: {
        campaign_id: {
          type: 'string',
          description: 'Campaign ID',
        },
      },
      required: ['campaign_id'],
    },
  },

  // Workflow Management
  {
    name: 'drip_list_workflows',
    description: 'List all workflows (automations)',
    inputSchema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['active', 'paused', 'draft'],
          description: 'Filter by workflow status',
        },
        page: {
          type: 'number',
          description: 'Page number for pagination',
        },
      },
    },
  },
  {
    name: 'drip_get_workflow',
    description: 'Get detailed information about a specific workflow',
    inputSchema: {
      type: 'object',
      properties: {
        workflow_id: {
          type: 'string',
          description: 'Workflow ID',
        },
      },
      required: ['workflow_id'],
    },
  },
  {
    name: 'drip_activate_workflow',
    description: 'Activate a workflow to start processing subscribers',
    inputSchema: {
      type: 'object',
      properties: {
        workflow_id: {
          type: 'string',
          description: 'Workflow ID',
        },
      },
      required: ['workflow_id'],
    },
  },
  {
    name: 'drip_pause_workflow',
    description: 'Pause an active workflow',
    inputSchema: {
      type: 'object',
      properties: {
        workflow_id: {
          type: 'string',
          description: 'Workflow ID',
        },
      },
      required: ['workflow_id'],
    },
  },

  // Event Tracking
  {
    name: 'drip_track_event',
    description: 'Track a custom event for a subscriber (e.g., "Completed Calculator", "Downloaded Checklist")',
    inputSchema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Subscriber email address',
        },
        action: {
          type: 'string',
          description: 'Event action name (e.g., "Completed Calculator")',
        },
        properties: {
          type: 'object',
          description: 'Event properties (e.g., {"estimated_cost": "12000", "bmi": "35"})',
        },
      },
      required: ['email', 'action'],
    },
  },

  // Form Management
  {
    name: 'drip_list_forms',
    description: 'List all forms in the account',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'drip_get_form',
    description: 'Get detailed information about a specific form',
    inputSchema: {
      type: 'object',
      properties: {
        form_id: {
          type: 'string',
          description: 'Form ID',
        },
      },
      required: ['form_id'],
    },
  },

  // Broadcast Management
  {
    name: 'drip_list_broadcasts',
    description: 'List all broadcast emails',
    inputSchema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['draft', 'scheduled', 'sent'],
          description: 'Filter by broadcast status',
        },
        page: {
          type: 'number',
          description: 'Page number for pagination',
        },
      },
    },
  },
  {
    name: 'drip_get_broadcast',
    description: 'Get detailed information about a specific broadcast',
    inputSchema: {
      type: 'object',
      properties: {
        broadcast_id: {
          type: 'string',
          description: 'Broadcast ID',
        },
      },
      required: ['broadcast_id'],
    },
  },

  // Account Management
  {
    name: 'drip_get_account',
    description: 'Get account information and statistics',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

// ============================================================================
// TOOL HANDLERS
// ============================================================================

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result;

    switch (name) {
      // Subscriber Management
      case 'drip_create_subscriber':
        result = await dripClient.createOrUpdateSubscriber(args);
        break;

      case 'drip_get_subscriber':
        result = await dripClient.getSubscriber(args.email_or_id);
        break;

      case 'drip_list_subscribers':
        result = await dripClient.listSubscribers(args);
        break;

      case 'drip_delete_subscriber':
        result = await dripClient.deleteSubscriber(args.email_or_id);
        break;

      case 'drip_unsubscribe_subscriber':
        result = await dripClient.unsubscribeSubscriber(args.email_or_id);
        break;

      // Tag Management
      case 'drip_tag_subscriber':
        result = await dripClient.tagSubscriber(args.email, args.tag);
        break;

      case 'drip_untag_subscriber':
        result = await dripClient.untagSubscriber(args.email, args.tag);
        break;

      case 'drip_list_tags':
        result = await dripClient.listTags();
        break;

      // Custom Fields
      case 'drip_update_custom_fields':
        result = await dripClient.updateCustomFields(args.email, args.custom_fields);
        break;

      case 'drip_list_custom_fields':
        result = await dripClient.listCustomFields();
        break;

      // Campaign Management
      case 'drip_list_campaigns':
        result = await dripClient.listCampaigns(args);
        break;

      case 'drip_get_campaign':
        result = await dripClient.getCampaign(args.campaign_id);
        break;

      case 'drip_get_campaign_subscribers':
        result = await dripClient.getCampaignSubscribers(args.campaign_id);
        break;

      // Workflow Management
      case 'drip_list_workflows':
        result = await dripClient.listWorkflows(args);
        break;

      case 'drip_get_workflow':
        result = await dripClient.getWorkflow(args.workflow_id);
        break;

      case 'drip_activate_workflow':
        result = await dripClient.activateWorkflow(args.workflow_id);
        break;

      case 'drip_pause_workflow':
        result = await dripClient.pauseWorkflow(args.workflow_id);
        break;

      // Event Tracking
      case 'drip_track_event':
        result = await dripClient.trackEvent(args.email, args.action, args.properties || {});
        break;

      // Form Management
      case 'drip_list_forms':
        result = await dripClient.listForms();
        break;

      case 'drip_get_form':
        result = await dripClient.getForm(args.form_id);
        break;

      // Broadcast Management
      case 'drip_list_broadcasts':
        result = await dripClient.listBroadcasts(args);
        break;

      case 'drip_get_broadcast':
        result = await dripClient.getBroadcast(args.broadcast_id);
        break;

      // Account Management
      case 'drip_get_account':
        result = await dripClient.getAccount();
        break;

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// ============================================================================
// START SERVER
// ============================================================================

async function main() {
  // Validate required environment variables
  if (!process.env.DRIP_API_TOKEN) {
    console.error('Error: DRIP_API_TOKEN environment variable is required');
    process.exit(1);
  }

  if (!process.env.DRIP_ACCOUNT_ID) {
    console.error('Error: DRIP_ACCOUNT_ID environment variable is required');
    process.exit(1);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Drip MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
