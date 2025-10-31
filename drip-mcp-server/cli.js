#!/usr/bin/env node

/**
 * Drip CLI Tool
 * Direct command-line interface to Drip API via MCP client
 * Usage: node cli.js <command> [args]
 */

import { DripClient } from './src/drip-client.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Drip client
const client = new DripClient(
  process.env.DRIP_API_TOKEN,
  process.env.DRIP_ACCOUNT_ID
);

// Parse command and args
const [,, command, ...args] = process.argv;

// Helper to format output
function output(data) {
  console.log(JSON.stringify(data, null, 2));
}

function error(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

// Command handlers
const commands = {
  // ==================== TAG COMMANDS ====================
  'create-tag': async () => {
    const [email, tag] = args;
    if (!email || !tag) error('Usage: create-tag <email> <tag>');

    console.log(`Creating tag "${tag}" by applying it to ${email}...`);
    const result = await client.tagSubscriber(email, tag);
    output(result);
  },

  'list-tags': async () => {
    console.log('Fetching all tags...');
    const result = await client.listTags();
    output(result);
  },

  'tag-subscriber': async () => {
    const [email, tag] = args;
    if (!email || !tag) error('Usage: tag-subscriber <email> <tag>');

    console.log(`Applying tag "${tag}" to ${email}...`);
    const result = await client.tagSubscriber(email, tag);
    output(result);
  },

  'untag-subscriber': async () => {
    const [email, tag] = args;
    if (!email || !tag) error('Usage: untag-subscriber <email> <tag>');

    console.log(`Removing tag "${tag}" from ${email}...`);
    const result = await client.untagSubscriber(email, tag);
    output(result);
  },

  // ==================== SUBSCRIBER COMMANDS ====================
  'create-subscriber': async () => {
    const [email, firstName, lastName] = args;
    if (!email) error('Usage: create-subscriber <email> [firstName] [lastName]');

    const data = { email };
    if (firstName) data.first_name = firstName;
    if (lastName) data.last_name = lastName;

    console.log(`Creating subscriber ${email}...`);
    const result = await client.createOrUpdateSubscriber(data);
    output(result);
  },

  'create-subscriber-with-tag': async () => {
    // Format: create-subscriber-with-tag email firstName tag [customField1=value1] [customField2=value2]
    const [email, firstName, tag, ...customFieldArgs] = args;
    if (!email || !firstName || !tag) {
      error('Usage: create-subscriber-with-tag <email> <firstName> <tag> [field=value] ...');
    }

    // Parse custom fields
    const custom_fields = {};
    customFieldArgs.forEach(arg => {
      const [key, value] = arg.split('=');
      if (key && value) {
        // Try to parse as number
        custom_fields[key] = isNaN(value) ? value : parseFloat(value);
      }
    });

    const data = {
      email,
      first_name: firstName,
      tags: [tag]
    };

    if (Object.keys(custom_fields).length > 0) {
      data.custom_fields = custom_fields;
    }

    console.log(`Creating subscriber ${email} with tag "${tag}"...`);
    const result = await client.createOrUpdateSubscriber(data);
    output(result);
  },

  'get-subscriber': async () => {
    const [emailOrId] = args;
    if (!emailOrId) error('Usage: get-subscriber <email|id>');

    console.log(`Fetching subscriber ${emailOrId}...`);
    const result = await client.getSubscriber(emailOrId);
    output(result);
  },

  'list-subscribers': async () => {
    const params = {};

    // Parse optional parameters
    args.forEach(arg => {
      const [key, value] = arg.split('=');
      if (key && value) params[key] = value;
    });

    console.log('Fetching subscribers...');
    const result = await client.listSubscribers(params);
    output(result);
  },

  'delete-subscriber': async () => {
    const [emailOrId] = args;
    if (!emailOrId) error('Usage: delete-subscriber <email|id>');

    console.log(`Deleting subscriber ${emailOrId}...`);
    const result = await client.deleteSubscriber(emailOrId);
    output(result);
  },

  // ==================== CUSTOM FIELD COMMANDS ====================
  'list-custom-fields': async () => {
    console.log('Fetching all custom fields...');
    const result = await client.listCustomFields();
    output(result);
  },

  'update-custom-fields': async () => {
    // Format: update-custom-fields email field1=value1 field2=value2
    const [email, ...fieldArgs] = args;
    if (!email || fieldArgs.length === 0) {
      error('Usage: update-custom-fields <email> <field1=value1> [field2=value2] ...');
    }

    const custom_fields = {};
    fieldArgs.forEach(arg => {
      const [key, value] = arg.split('=');
      if (key && value) {
        custom_fields[key] = isNaN(value) ? value : parseFloat(value);
      }
    });

    console.log(`Updating custom fields for ${email}...`);
    const result = await client.updateCustomFields(email, custom_fields);
    output(result);
  },

  // ==================== WORKFLOW COMMANDS ====================
  'list-workflows': async () => {
    const params = {};
    args.forEach(arg => {
      const [key, value] = arg.split('=');
      if (key && value) params[key] = value;
    });

    console.log('Fetching workflows...');
    const result = await client.listWorkflows(params);
    output(result);
  },

  'get-workflow': async () => {
    const [workflowId] = args;
    if (!workflowId) error('Usage: get-workflow <workflow_id>');

    console.log(`Fetching workflow ${workflowId}...`);
    const result = await client.getWorkflow(workflowId);
    output(result);
  },

  'activate-workflow': async () => {
    const [workflowId] = args;
    if (!workflowId) error('Usage: activate-workflow <workflow_id>');

    console.log(`Activating workflow ${workflowId}...`);
    const result = await client.activateWorkflow(workflowId);
    output(result);
  },

  'pause-workflow': async () => {
    const [workflowId] = args;
    if (!workflowId) error('Usage: pause-workflow <workflow_id>');

    console.log(`Pausing workflow ${workflowId}...`);
    const result = await client.pauseWorkflow(workflowId);
    output(result);
  },

  // ==================== EVENT TRACKING ====================
  'track-event': async () => {
    // Format: track-event email action [prop1=value1] [prop2=value2]
    const [email, action, ...propArgs] = args;
    if (!email || !action) {
      error('Usage: track-event <email> <action> [property1=value1] ...');
    }

    const properties = {};
    propArgs.forEach(arg => {
      const [key, value] = arg.split('=');
      if (key && value) {
        properties[key] = isNaN(value) ? value : parseFloat(value);
      }
    });

    console.log(`Tracking event "${action}" for ${email}...`);
    const result = await client.trackEvent(email, action, properties);
    output(result);
  },

  // ==================== ACCOUNT INFO ====================
  'get-account': async () => {
    console.log('Fetching account information...');
    const result = await client.getAccount();
    output(result);
  },

  // ==================== CAMPAIGNS ====================
  'list-campaigns': async () => {
    const params = {};
    args.forEach(arg => {
      const [key, value] = arg.split('=');
      if (key && value) params[key] = value;
    });

    console.log('Fetching campaigns...');
    const result = await client.listCampaigns(params);
    output(result);
  },

  // ==================== HELP ====================
  'help': () => {
    console.log(`
Drip CLI Tool - Command Reference

TAGS:
  create-tag <email> <tag>                    Create a new tag by applying it to a subscriber
  list-tags                                    List all tags
  tag-subscriber <email> <tag>                Apply tag to subscriber
  untag-subscriber <email> <tag>              Remove tag from subscriber

SUBSCRIBERS:
  create-subscriber <email> [firstName] [lastName]
  create-subscriber-with-tag <email> <firstName> <tag> [field=value] ...
  get-subscriber <email|id>
  list-subscribers [status=active] [tags=tag1,tag2]
  delete-subscriber <email|id>

CUSTOM FIELDS:
  list-custom-fields
  update-custom-fields <email> <field1=value1> [field2=value2] ...

WORKFLOWS:
  list-workflows [status=active|paused|draft]
  get-workflow <workflow_id>
  activate-workflow <workflow_id>
  pause-workflow <workflow_id>

EVENTS:
  track-event <email> <action> [property1=value1] ...

ACCOUNT:
  get-account

CAMPAIGNS:
  list-campaigns [status=active|paused|draft]

HELP:
  help                                         Show this help message

Examples:
  node cli.js create-tag test@example.com calculator_user
  node cli.js create-subscriber-with-tag john@example.com John calculator_user estimated_cost=12000
  node cli.js list-tags
  node cli.js get-account
`);
  }
};

// Execute command
async function main() {
  // Validate environment
  if (!process.env.DRIP_API_TOKEN) {
    error('DRIP_API_TOKEN environment variable is required');
  }
  if (!process.env.DRIP_ACCOUNT_ID) {
    error('DRIP_ACCOUNT_ID environment variable is required');
  }

  if (!command || !commands[command]) {
    console.error(`Unknown command: ${command || '(none)'}\n`);
    commands.help();
    process.exit(1);
  }

  try {
    await commands[command]();
  } catch (err) {
    error(err.message);
  }
}

main();
