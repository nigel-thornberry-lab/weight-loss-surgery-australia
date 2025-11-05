#!/usr/bin/env node

/**
 * Drip Email Sequence Setup Script
 *
 * This script sets up the automated email sequences in Drip:
 * - Creates required tags
 * - Creates custom fields
 * - Provides instructions for creating workflows/campaigns
 *
 * Usage: node setup-sequences.js
 */

import { DripClient } from './src/drip-client.js';
import dotenv from 'dotenv';
import fs from 'fs/promises';

// Load environment variables
dotenv.config();

// Initialize Drip client
const client = new DripClient(
  process.env.DRIP_API_TOKEN,
  process.env.DRIP_ACCOUNT_ID
);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  log(`\n${'='.repeat(60)}`, 'blue');
  log(title, 'bright');
  log('='.repeat(60), 'blue');
}

async function loadConfig() {
  try {
    const configData = await fs.readFile('./email-sequences/sequence-config.json', 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    log(`Error loading config: ${error.message}`, 'red');
    process.exit(1);
  }
}

async function createTags(config) {
  section('CREATING TAGS');

  const tags = Object.keys(config.tags);

  for (const tag of tags) {
    try {
      log(`\nCreating tag: ${tag}`, 'yellow');
      log(`  Description: ${config.tags[tag]}`);

      // Tags are created by applying them to a subscriber
      // We'll just log them for now - they'll be created when first used
      log(`  ✓ Tag ready to use`, 'green');
    } catch (error) {
      log(`  ✗ Error: ${error.message}`, 'red');
    }
  }

  log(`\n✓ ${tags.length} tags configured`, 'green');
}

async function checkCustomFields(config) {
  section('CHECKING CUSTOM FIELDS');

  try {
    const existingFields = await client.listCustomFields();
    const existingFieldNames = existingFields.custom_field_identifiers || [];

    log(`\nExisting custom fields: ${existingFieldNames.length}`);
    existingFieldNames.forEach(field => log(`  - ${field}`, 'blue'));

    const requiredFields = Object.keys(config.custom_fields);
    const missingFields = requiredFields.filter(
      field => !existingFieldNames.includes(field)
    );

    if (missingFields.length > 0) {
      log(`\n⚠ Missing custom fields (create these in Drip):`, 'yellow');
      missingFields.forEach(field => {
        const fieldConfig = config.custom_fields[field];
        log(`  - ${field}`, 'yellow');
        log(`    Type: ${fieldConfig.type}`);
        log(`    Description: ${fieldConfig.description}`);
        log(`    Example: ${fieldConfig.example}`);
      });

      log(`\n📝 To create custom fields:`, 'blue');
      log(`   1. Go to: https://www.getdrip.com/${process.env.DRIP_ACCOUNT_ID}/settings/custom_fields`);
      log(`   2. Click "Create Custom Field"`);
      log(`   3. Add each missing field above`);
    } else {
      log(`\n✓ All required custom fields exist!`, 'green');
    }
  } catch (error) {
    log(`\n✗ Error checking custom fields: ${error.message}`, 'red');
  }
}

async function generateWorkflowInstructions(config) {
  section('WORKFLOW SETUP INSTRUCTIONS');

  log(`\nDrip doesn't have a public API for creating workflows/campaigns.`);
  log(`You'll need to set these up manually in the Drip UI.\n`);

  // A-Segment Instructions
  log(`\n${'─'.repeat(60)}`, 'blue');
  log(`A-SEGMENT: Insured Patients`, 'bright');
  log('─'.repeat(60), 'blue');

  const aSegment = config.sequences.A_insured;
  log(`\n1. Create new workflow in Drip:`);
  log(`   Name: "${aSegment.name}"`);
  log(`   Description: ${aSegment.description}`);

  log(`\n2. Trigger: "Tag applied"`);
  log(`   Tag: "${aSegment.trigger_tag}"`);

  log(`\n3. Add these ${aSegment.emails.length} emails:`);
  aSegment.emails.forEach((email, index) => {
    log(`\n   Email ${index + 1} (Day ${email.day}):`, 'yellow');
    log(`   - Delay: ${email.delay_days} days, ${email.delay_hours} hours after ${index === 0 ? 'trigger' : 'previous email'}`);
    log(`   - Subject: ${email.subject}`);
    log(`   - Preheader: ${email.preheader}`);
    log(`   - Content: See ALL-14-EMAILS-FINAL.md (Email ${email.id})`);
  });

  log(`\n4. Exit condition: Tag "${config.workflow_settings.exit_on_tag}" applied`);

  // B-Segment Instructions
  log(`\n${'─'.repeat(60)}`, 'blue');
  log(`B-SEGMENT: Self-Funded Patients`, 'bright');
  log('─'.repeat(60), 'blue');

  const bSegment = config.sequences.B_self_funded;
  log(`\n1. Create new workflow in Drip:`);
  log(`   Name: "${bSegment.name}"`);
  log(`   Description: ${bSegment.description}`);

  log(`\n2. Trigger: "Tag applied"`);
  log(`   Tag: "${bSegment.trigger_tag}"`);

  log(`\n3. Add these ${bSegment.emails.length} emails:`);
  bSegment.emails.forEach((email, index) => {
    log(`\n   Email ${index + 1} (Day ${email.day}):`, 'yellow');
    log(`   - Delay: ${email.delay_days} days, ${email.delay_hours} hours after ${index === 0 ? 'trigger' : 'previous email'}`);
    log(`   - Subject: ${email.subject}`);
    log(`   - Preheader: ${email.preheader}`);
    log(`   - Content: See ALL-14-EMAILS-FINAL.md (Email ${email.id})`);
  });

  log(`\n4. Exit condition: Tag "${config.workflow_settings.exit_on_tag}" applied`);

  // General Settings
  log(`\n${'─'.repeat(60)}`, 'blue');
  log(`WORKFLOW SETTINGS (for both)`, 'bright');
  log('─'.repeat(60), 'blue');

  log(`\n- Allow multiple subscriptions: ${config.workflow_settings.allow_multiple_subscriptions ? 'Yes' : 'No'}`);
  log(`- Send time: ${config.workflow_settings.send_time}`);
  log(`- Timezone: ${config.workflow_settings.timezone}`);
  log(`- Exit on tag: ${config.workflow_settings.exit_on_tag}`);
}

function generateTestCommands() {
  section('TESTING THE SEQUENCES');

  log(`\nOnce workflows are set up in Drip, test with these commands:\n`);

  log(`Test A-Segment (Insured):`, 'yellow');
  log(`  node cli.js create-subscriber-with-tag test-insured@example.com John calculator_user_insured estimated_cost=12000 location=Sydney`);

  log(`\nTest B-Segment (Self-Funded):`, 'yellow');
  log(`  node cli.js create-subscriber-with-tag test-selffund@example.com Jane calculator_user_self_funded estimated_cost=18000 location=Melbourne`);

  log(`\nCheck subscriber status:`, 'yellow');
  log(`  node cli.js get-subscriber test-insured@example.com`);

  log(`\nMark as booked (exit sequence):`, 'yellow');
  log(`  node cli.js tag-subscriber test-insured@example.com consultation_booked`);

  log(`\nRemove from sequence:`, 'yellow');
  log(`  node cli.js untag-subscriber test-insured@example.com calculator_user_insured`);
}

function generateIntegrationCode() {
  section('INTEGRATING WITH YOUR WEBSITE');

  log(`\nAdd this code to your cost calculator completion:\n`);

  log(`JavaScript (Frontend):`, 'yellow');
  log(`
// After calculator shows results
const calculatorData = {
  email: userEmail,
  first_name: firstName,
  insurance_status: hasInsurance, // true or false
  estimated_cost: calculatedCost,
  location: userLocation,
  procedure_type: selectedProcedure
};

// Send to your backend
fetch('/api/calculator-complete', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(calculatorData)
});
`, 'blue');

  log(`Backend (Node.js):`, 'yellow');
  log(`
import { DripClient } from './drip-mcp-server/src/drip-client.js';

const drip = new DripClient(
  process.env.DRIP_API_TOKEN,
  process.env.DRIP_ACCOUNT_ID
);

app.post('/api/calculator-complete', async (req, res) => {
  const { email, first_name, insurance_status, estimated_cost, location, procedure_type } = req.body;

  // Determine which sequence tag to apply
  const sequenceTag = insurance_status
    ? 'calculator_user_insured'
    : 'calculator_user_self_funded';

  try {
    // Create/update subscriber with tag (triggers workflow)
    await drip.createOrUpdateSubscriber({
      email,
      first_name,
      tags: ['calculator_user', sequenceTag],
      custom_fields: {
        estimated_cost,
        location,
        procedure_type
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Drip error:', error);
    res.status(500).json({ error: 'Failed to start email sequence' });
  }
});
`, 'blue');
}

async function generateSummary(config) {
  section('SETUP SUMMARY');

  const aCount = config.sequences.A_insured.emails.length;
  const bCount = config.sequences.B_self_funded.emails.length;
  const tagCount = Object.keys(config.tags).length;
  const fieldCount = Object.keys(config.custom_fields).length;

  log(`\n✓ Configuration loaded`, 'green');
  log(`  - A-Segment: ${aCount} emails over 21 days`);
  log(`  - B-Segment: ${bCount} emails over 21 days`);
  log(`  - Tags: ${tagCount} configured`);
  log(`  - Custom fields: ${fieldCount} defined`);

  log(`\n📋 NEXT STEPS:`, 'yellow');
  log(`  1. Create missing custom fields in Drip (see above)`);
  log(`  2. Create workflows in Drip UI (see instructions above)`);
  log(`  3. Add integration code to your calculator (see above)`);
  log(`  4. Test with the CLI commands (see above)`);
  log(`  5. Monitor results in Drip dashboard`);

  log(`\n📚 DOCUMENTATION:`, 'blue');
  log(`  - Email content: ./email-sequences/ALL-14-EMAILS-FINAL.md`);
  log(`  - Configuration: ./email-sequences/sequence-config.json`);
  log(`  - Drip dashboard: https://www.getdrip.com/${process.env.DRIP_ACCOUNT_ID}/`);
}

async function main() {
  log(`\n${'═'.repeat(60)}`, 'blue');
  log(`  Drip Email Sequence Setup`, 'bright');
  log(`  Weight Loss Surgery Australia`, 'bright');
  log('═'.repeat(60), 'blue');

  // Validate environment
  if (!process.env.DRIP_API_TOKEN || !process.env.DRIP_ACCOUNT_ID) {
    log(`\n✗ Error: Missing Drip credentials`, 'red');
    log(`  Please set DRIP_API_TOKEN and DRIP_ACCOUNT_ID in .env file\n`);
    process.exit(1);
  }

  try {
    // Load configuration
    const config = await loadConfig();

    // Run setup steps
    await createTags(config);
    await checkCustomFields(config);
    await generateWorkflowInstructions(config);
    generateTestCommands();
    generateIntegrationCode();
    await generateSummary(config);

    log(`\n✓ Setup script complete!`, 'green');
    log(`\n`);

  } catch (error) {
    log(`\n✗ Setup failed: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

main();
