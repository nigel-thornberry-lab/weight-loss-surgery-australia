/**
 * Drip API Client
 * Handles all interactions with the Drip API v3
 * API Documentation: https://developer.drip.com/
 */

import fetch from 'node-fetch';

export class DripClient {
  constructor(apiToken, accountId) {
    this.apiToken = apiToken;
    this.accountId = accountId;
    // Drip API v2 is the current stable version
    this.baseUrl = 'https://api.getdrip.com/v2';
  }

  /**
   * Make authenticated request to Drip API
   */
  async makeRequest(endpoint, method = 'GET', body = null) {
    const url = `${this.baseUrl}/${this.accountId}${endpoint}`;

    // Drip API v2 uses Basic Auth with API token as username and empty password
    const authString = Buffer.from(`${this.apiToken}:`).toString('base64');

    const options = {
      method,
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
        'User-Agent': 'drip-mcp-server/1.0.0'
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Drip API error (${response.status}): ${errorText}`);
    }

    return await response.json();
  }

  // ============================================================================
  // SUBSCRIBER MANAGEMENT
  // ============================================================================

  /**
   * Create or update a subscriber
   * @param {Object} subscriberData - Subscriber information
   * @returns {Promise<Object>} Subscriber data
   */
  async createOrUpdateSubscriber(subscriberData) {
    const body = {
      subscribers: [subscriberData]
    };

    return await this.makeRequest('/subscribers', 'POST', body);
  }

  /**
   * Get a subscriber by email or ID
   * @param {string} emailOrId - Email address or subscriber ID
   * @returns {Promise<Object>} Subscriber data
   */
  async getSubscriber(emailOrId) {
    const endpoint = emailOrId.includes('@')
      ? `/subscribers/${encodeURIComponent(emailOrId)}`
      : `/subscribers/${emailOrId}`;

    return await this.makeRequest(endpoint);
  }

  /**
   * List all subscribers with optional filters
   * @param {Object} params - Query parameters (status, tags, page, etc.)
   * @returns {Promise<Object>} List of subscribers
   */
  async listSubscribers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/subscribers?${queryString}` : '/subscribers';

    return await this.makeRequest(endpoint);
  }

  /**
   * Delete a subscriber
   * @param {string} emailOrId - Email address or subscriber ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteSubscriber(emailOrId) {
    const endpoint = emailOrId.includes('@')
      ? `/subscribers/${encodeURIComponent(emailOrId)}`
      : `/subscribers/${emailOrId}`;

    return await this.makeRequest(endpoint, 'DELETE');
  }

  /**
   * Unsubscribe a subscriber from all mailings
   * @param {string} emailOrId - Email address or subscriber ID
   * @returns {Promise<Object>} Unsubscribe confirmation
   */
  async unsubscribeSubscriber(emailOrId) {
    const body = {
      subscribers: [{
        email: emailOrId.includes('@') ? emailOrId : undefined,
        id: !emailOrId.includes('@') ? emailOrId : undefined
      }]
    };

    return await this.makeRequest('/subscribers/unsubscribe', 'POST', body);
  }

  // ============================================================================
  // TAG MANAGEMENT
  // ============================================================================

  /**
   * Apply a tag to a subscriber
   * @param {string} email - Subscriber email
   * @param {string} tag - Tag name
   * @returns {Promise<Object>} Tag application result
   */
  async tagSubscriber(email, tag) {
    const body = {
      tags: [{
        email,
        tag
      }]
    };

    return await this.makeRequest('/tags', 'POST', body);
  }

  /**
   * Remove a tag from a subscriber
   * @param {string} email - Subscriber email
   * @param {string} tag - Tag name
   * @returns {Promise<Object>} Tag removal result
   */
  async untagSubscriber(email, tag) {
    const endpoint = `/subscribers/${encodeURIComponent(email)}/tags/${encodeURIComponent(tag)}`;
    return await this.makeRequest(endpoint, 'DELETE');
  }

  /**
   * List all tags in the account
   * @returns {Promise<Object>} List of tags
   */
  async listTags() {
    return await this.makeRequest('/tags');
  }

  // ============================================================================
  // CUSTOM FIELD MANAGEMENT
  // ============================================================================

  /**
   * Update custom fields for a subscriber
   * @param {string} email - Subscriber email
   * @param {Object} customFields - Custom field key-value pairs
   * @returns {Promise<Object>} Update result
   */
  async updateCustomFields(email, customFields) {
    const body = {
      subscribers: [{
        email,
        custom_fields: customFields
      }]
    };

    return await this.makeRequest('/subscribers', 'POST', body);
  }

  /**
   * List all custom fields
   * @returns {Promise<Object>} List of custom fields
   */
  async listCustomFields() {
    return await this.makeRequest('/custom_field_identifiers');
  }

  // ============================================================================
  // CAMPAIGN MANAGEMENT
  // ============================================================================

  /**
   * List all campaigns
   * @param {Object} params - Query parameters (status, page, etc.)
   * @returns {Promise<Object>} List of campaigns
   */
  async listCampaigns(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/campaigns?${queryString}` : '/campaigns';

    return await this.makeRequest(endpoint);
  }

  /**
   * Get a specific campaign
   * @param {string} campaignId - Campaign ID
   * @returns {Promise<Object>} Campaign data
   */
  async getCampaign(campaignId) {
    return await this.makeRequest(`/campaigns/${campaignId}`);
  }

  /**
   * Get subscribers for a campaign
   * @param {string} campaignId - Campaign ID
   * @returns {Promise<Object>} Campaign subscribers
   */
  async getCampaignSubscribers(campaignId) {
    return await this.makeRequest(`/campaigns/${campaignId}/subscribers`);
  }

  // ============================================================================
  // WORKFLOW (AUTOMATION) MANAGEMENT
  // ============================================================================

  /**
   * List all workflows
   * @param {Object} params - Query parameters (status, page, etc.)
   * @returns {Promise<Object>} List of workflows
   */
  async listWorkflows(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/workflows?${queryString}` : '/workflows';

    return await this.makeRequest(endpoint);
  }

  /**
   * Get a specific workflow
   * @param {string} workflowId - Workflow ID
   * @returns {Promise<Object>} Workflow data
   */
  async getWorkflow(workflowId) {
    return await this.makeRequest(`/workflows/${workflowId}`);
  }

  /**
   * Activate a workflow
   * @param {string} workflowId - Workflow ID
   * @returns {Promise<Object>} Activation result
   */
  async activateWorkflow(workflowId) {
    return await this.makeRequest(`/workflows/${workflowId}/activate`, 'POST');
  }

  /**
   * Pause a workflow
   * @param {string} workflowId - Workflow ID
   * @returns {Promise<Object>} Pause result
   */
  async pauseWorkflow(workflowId) {
    return await this.makeRequest(`/workflows/${workflowId}/pause`, 'POST');
  }

  // ============================================================================
  // EVENT TRACKING
  // ============================================================================

  /**
   * Track a custom event for a subscriber
   * @param {string} email - Subscriber email
   * @param {string} action - Event action name
   * @param {Object} properties - Event properties
   * @returns {Promise<Object>} Event tracking result
   */
  async trackEvent(email, action, properties = {}) {
    const body = {
      events: [{
        email,
        action,
        properties,
        occurred_at: new Date().toISOString()
      }]
    };

    return await this.makeRequest('/events', 'POST', body);
  }

  // ============================================================================
  // FORM MANAGEMENT
  // ============================================================================

  /**
   * List all forms
   * @returns {Promise<Object>} List of forms
   */
  async listForms() {
    return await this.makeRequest('/forms');
  }

  /**
   * Get a specific form
   * @param {string} formId - Form ID
   * @returns {Promise<Object>} Form data
   */
  async getForm(formId) {
    return await this.makeRequest(`/forms/${formId}`);
  }

  // ============================================================================
  // BROADCAST MANAGEMENT
  // ============================================================================

  /**
   * List all broadcasts
   * @param {Object} params - Query parameters (status, page, etc.)
   * @returns {Promise<Object>} List of broadcasts
   */
  async listBroadcasts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/broadcasts?${queryString}` : '/broadcasts';

    return await this.makeRequest(endpoint);
  }

  /**
   * Get a specific broadcast
   * @param {string} broadcastId - Broadcast ID
   * @returns {Promise<Object>} Broadcast data
   */
  async getBroadcast(broadcastId) {
    return await this.makeRequest(`/broadcasts/${broadcastId}`);
  }

  // ============================================================================
  // ACCOUNT MANAGEMENT
  // ============================================================================

  /**
   * Get account information
   * @returns {Promise<Object>} Account data
   */
  async getAccount() {
    return await this.makeRequest('');
  }
}
