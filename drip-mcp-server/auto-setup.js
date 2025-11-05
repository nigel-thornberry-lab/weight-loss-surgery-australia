#!/usr/bin/env node

/**
 * AUTOMATED Drip Setup Script
 *
 * This script automatically sets up everything possible in Drip via the API:
 * - Creates custom fields (if possible)
 * - Creates tags (by applying to test subscriber)
 * - Creates test subscribers for both sequences
 * - Provides instructions for what must be done manually in Drip UI
 *
 * Usage: node auto-setup.js
 */

import { DripClient } from './src/drip-client.js';
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();

const client = new DripClient(
  process.env.DRIP_API_TOKEN,
  process.env.DRIP_ACCOUNT_ID
);

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  log(`\n${'='.repeat(70)}`, 'cyan');
  log(`  ${title}`, 'bright');
  log('='.repeat(70), 'cyan');
}

async function loadConfig() {
  const configData = await fs.readFile('./email-sequences/sequence-config.json', 'utf8');
  return JSON.parse(configData);
}

/**
 * Step 1: Verify and create custom fields
 * Note: Drip API doesn't support creating custom fields programmatically
 * We can only check if they exist
 */
async function setupCustomFields(config) {
  section('STEP 1: Custom Fields');

  try {
    const existing = await client.listCustomFields();
    const existingNames = existing.custom_field_identifiers || [];

    log(`\n✓ Found ${existingNames.length} existing custom fields:`, 'green');
    existingNames.forEach(name => log(`  • ${name}`, 'blue'));

    const required = Object.keys(config.custom_fields);
    const missing = required.filter(field => !existingNames.includes(field));

    if (missing.length > 0) {
      log(`\n⚠  Missing custom fields (must create manually):`, 'yellow');
      missing.forEach(field => {
        const fieldConfig = config.custom_fields[field];
        log(`  • ${field}`, 'yellow');
        log(`    Type: ${fieldConfig.type}`, 'reset');
        log(`    Description: ${fieldConfig.description}`, 'reset');
      });
      log(`\n📝 Create these at: https://www.getdrip.com/${process.env.DRIP_ACCOUNT_ID}/settings/custom_fields`, 'blue');

      return { success: false, missing };
    } else {
      log(`\n✅ All required custom fields exist!`, 'green');
      return { success: true, missing: [] };
    }
  } catch (error) {
    log(`\n✗ Error checking custom fields: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

/**
 * Step 2: Create tags by applying them to a test subscriber
 */
async function setupTags(config) {
  section('STEP 2: Creating Tags');

  const testEmail = `drip-setup-test-${Date.now()}@bariatricsurgeryhub.com`;
  log(`\nCreating temporary test subscriber: ${testEmail}`, 'blue');

  try {
    // Create test subscriber with all tags
    const tags = Object.keys(config.tags);

    log(`\nApplying ${tags.length} tags...`, 'yellow');

    const result = await client.createOrUpdateSubscriber({
      email: testEmail,
      first_name: 'Test',
      last_name: 'Setup',
      tags: tags,
      custom_fields: {
        estimated_cost: 12000,
        location: 'Test',
        procedure_type: 'Setup Test'
      }
    });

    log(`✓ Test subscriber created with all tags`, 'green');
    tags.forEach(tag => log(`  • ${tag}`, 'blue'));

    // Delete the test subscriber
    log(`\nCleaning up test subscriber...`, 'yellow');
    await client.deleteSubscriber(testEmail);
    log(`✓ Test subscriber deleted`, 'green');

    log(`\n✅ All ${tags.length} tags created in Drip!`, 'green');
    return { success: true, tags };

  } catch (error) {
    log(`\n✗ Error creating tags: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

/**
 * Step 3: List existing campaigns/workflows
 */
async function checkWorkflows() {
  section('STEP 3: Checking Workflows');

  try {
    const workflows = await client.listWorkflows({ status: 'all' });

    if (workflows.workflows && workflows.workflows.length > 0) {
      log(`\n✓ Found ${workflows.workflows.length} existing workflows:`, 'green');
      workflows.workflows.forEach(wf => {
        log(`  • ${wf.name} (${wf.status})`, 'blue');
        log(`    ID: ${wf.id}`, 'reset');
      });
    } else {
      log(`\n⚠  No workflows found`, 'yellow');
      log(`You'll need to create them manually in Drip UI`, 'yellow');
    }

    return { success: true, workflows: workflows.workflows || [] };

  } catch (error) {
    log(`\n⚠  Error listing workflows: ${error.message}`, 'yellow');
    return { success: false, error: error.message };
  }
}

/**
 * Step 4: Check for existing campaigns
 */
async function checkCampaigns() {
  section('STEP 4: Checking Campaigns');

  try {
    const campaigns = await client.listCampaigns({ status: 'all' });

    if (campaigns.campaigns && campaigns.campaigns.length > 0) {
      log(`\n✓ Found ${campaigns.campaigns.length} existing campaigns:`, 'green');
      campaigns.campaigns.forEach(camp => {
        log(`  • ${camp.name} (${camp.status})`, 'blue');
        log(`    ID: ${camp.id}`, 'reset');
      });
    } else {
      log(`\n⚠  No campaigns found`, 'yellow');
    }

    return { success: true, campaigns: campaigns.campaigns || [] };

  } catch (error) {
    log(`\n⚠  Could not list campaigns: ${error.message}`, 'yellow');
    return { success: false, error: error.message };
  }
}

/**
 * Step 5: Create test subscribers for both sequences
 */
async function createTestSubscribers(config) {
  section('STEP 5: Creating Test Subscribers');

  const timestamp = Date.now();
  const testA = `test-insured-${timestamp}@bariatricsurgeryhub.com`;
  const testB = `test-selffunded-${timestamp}@bariatricsurgeryhub.com`;

  try {
    // Test subscriber A (Insured)
    log(`\nCreating A-segment test subscriber...`, 'yellow');
    const resultA = await client.createOrUpdateSubscriber({
      email: testA,
      first_name: 'Test',
      last_name: 'Insured',
      tags: ['calculator_user', 'calculator_user_insured'],
      custom_fields: {
        estimated_cost: 12000,
        location: 'Sydney',
        procedure_type: 'Gastric Sleeve',
        calculator_date: new Date().toISOString().split('T')[0]
      }
    });

    log(`✓ A-segment test: ${testA}`, 'green');
    log(`  Tags: calculator_user, calculator_user_insured`, 'blue');
    log(`  Custom fields: estimated_cost=12000, location=Sydney`, 'blue');

    // Test subscriber B (Self-funded)
    log(`\nCreating B-segment test subscriber...`, 'yellow');
    const resultB = await client.createOrUpdateSubscriber({
      email: testB,
      first_name: 'Test',
      last_name: 'SelfFunded',
      tags: ['calculator_user', 'calculator_user_self_funded'],
      custom_fields: {
        estimated_cost: 18000,
        location: 'Melbourne',
        procedure_type: 'Gastric Bypass',
        calculator_date: new Date().toISOString().split('T')[0]
      }
    });

    log(`✓ B-segment test: ${testB}`, 'green');
    log(`  Tags: calculator_user, calculator_user_self_funded`, 'blue');
    log(`  Custom fields: estimated_cost=18000, location=Melbourne`, 'blue');

    log(`\n✅ Test subscribers created!`, 'green');
    log(`\n📧 Check these email addresses to verify workflow emails`, 'cyan');
    log(`   (If workflows are set up, emails should arrive)`, 'cyan');

    return {
      success: true,
      testA,
      testB
    };

  } catch (error) {
    log(`\n✗ Error creating test subscribers: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

/**
 * Generate workflow creation instructions
 */
function generateWorkflowInstructions(config) {
  section('STEP 6: Workflow Setup (Manual)');

  log(`\n⚠️  Drip API does not support creating workflows programmatically`, 'yellow');
  log(`You must create workflows manually in the Drip UI\n`, 'yellow');

  log(`📋 WORKFLOW A: ${config.sequences.A_insured.name}`, 'bright');
  log(`────────────────────────────────────────────────`, 'cyan');
  log(`1. Go to: https://www.getdrip.com/${process.env.DRIP_ACCOUNT_ID}/workflows`);
  log(`2. Click "Create Workflow"`);
  log(`3. Name: "${config.sequences.A_insured.name}"`);
  log(`4. Trigger: Tag applied → "calculator_user_insured"`);
  log(`5. Add ${config.sequences.A_insured.emails.length} emails (see ALL-14-EMAILS-FINAL.md)`);
  log(`6. Exit condition: Tag "consultation_booked" applied`);
  log(`7. Activate workflow\n`);

  log(`📋 WORKFLOW B: ${config.sequences.B_self_funded.name}`, 'bright');
  log(`────────────────────────────────────────────────`, 'cyan');
  log(`1. Go to: https://www.getdrip.com/${process.env.DRIP_ACCOUNT_ID}/workflows`);
  log(`2. Click "Create Workflow"`);
  log(`3. Name: "${config.sequences.B_self_funded.name}"`);
  log(`4. Trigger: Tag applied → "calculator_user_self_funded"`);
  log(`5. Add ${config.sequences.B_self_funded.emails.length} emails (see ALL-14-EMAILS-FINAL.md)`);
  log(`6. Exit condition: Tag "consultation_booked" applied`);
  log(`7. Activate workflow\n`);

  log(`📚 Full email content: ./email-sequences/ALL-14-EMAILS-FINAL.md`, 'blue');
  log(`📋 Quick reference: ./email-sequences/sequence-config.json`, 'blue');
}

/**
 * Display final summary and next steps
 */
function displaySummary(results) {
  section('SETUP SUMMARY');

  log(`\n✅ COMPLETED AUTOMATICALLY:`, 'green');
  if (results.customFields.success) {
    log(`  ✓ Custom fields verified`, 'green');
  } else if (results.customFields.missing?.length > 0) {
    log(`  ⚠ Custom fields need manual creation: ${results.customFields.missing.join(', ')}`, 'yellow');
  }

  if (results.tags.success) {
    log(`  ✓ ${results.tags.tags?.length || 0} tags created`, 'green');
  }

  if (results.testSubscribers.success) {
    log(`  ✓ Test subscribers created`, 'green');
    log(`    • ${results.testSubscribers.testA}`, 'blue');
    log(`    • ${results.testSubscribers.testB}`, 'blue');
  }

  log(`\n⚠️  REQUIRES MANUAL SETUP:`, 'yellow');
  log(`  • Create workflows in Drip UI (see instructions above)`, 'yellow');
  log(`  • Add email content to each workflow email`, 'yellow');
  log(`  • Activate workflows when ready`, 'yellow');

  if (results.customFields.missing?.length > 0) {
    log(`  • Create missing custom fields in Drip`, 'yellow');
  }

  log(`\n📋 NEXT STEPS:`, 'cyan');
  log(`  1. Create missing custom fields (if any)`, 'reset');
  log(`  2. Create workflows in Drip UI (see instructions above)`, 'reset');
  log(`  3. Check test subscriber inboxes for emails`, 'reset');
  log(`  4. Integrate with your website calculator`, 'reset');
  log(`  5. Monitor Drip dashboard for results`, 'reset');

  log(`\n📊 MONITORING:`, 'cyan');
  log(`  Drip Dashboard: https://www.getdrip.com/${process.env.DRIP_ACCOUNT_ID}/`, 'blue');
  log(`  Workflows: https://www.getdrip.com/${process.env.DRIP_ACCOUNT_ID}/workflows`, 'blue');
  log(`  Subscribers: https://www.getdrip.com/${process.env.DRIP_ACCOUNT_ID}/subscribers`, 'blue');
}

/**
 * Main execution
 */
async function main() {
  log(`\n${'═'.repeat(70)}`, 'cyan');
  log(`  AUTOMATED DRIP SETUP`, 'bright');
  log(`  Weight Loss Surgery Australia - Email Sequences`, 'bright');
  log('═'.repeat(70), 'cyan');

  // Validate environment
  if (!process.env.DRIP_API_TOKEN || !process.env.DRIP_ACCOUNT_ID) {
    log(`\n✗ Error: Missing Drip credentials in .env file`, 'red');
    process.exit(1);
  }

  try {
    // Load configuration
    const config = await loadConfig();
    log(`\n✓ Configuration loaded`, 'green');
    log(`  • A-Segment: ${config.sequences.A_insured.emails.length} emails`, 'blue');
    log(`  • B-Segment: ${config.sequences.B_self_funded.emails.length} emails`, 'blue');

    // Run automated setup
    const results = {
      customFields: await setupCustomFields(config),
      tags: await setupTags(config),
      workflows: await checkWorkflows(),
      campaigns: await checkCampaigns(),
      testSubscribers: await createTestSubscribers(config)
    };

    // Generate manual instructions
    generateWorkflowInstructions(config);

    // Display summary
    displaySummary(results);

    log(`\n✅ Automated setup complete!`, 'green');
    log(`\n`);

  } catch (error) {
    log(`\n✗ Setup failed: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

main();
