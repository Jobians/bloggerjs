const path = require('path');
const fs = require('fs');
const { google } = require('googleapis');
const { authenticate } = require('@google-cloud/local-auth');

const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

class BloggerJS {
  /**
   * Initializes the BloggerJS instance
   * @param {string} blogId - The ID of the blog to operate on (optional)
   */
  constructor(blogId = null) {
    this.blogId = blogId;
    this.blogger = google.blogger('v3');
  }

  /**
   * Loads previously saved credentials from a file.
   * @returns {Promise<google.auth.OAuth2|null>} - Returns the authenticated client or null
   */
  async loadSavedCredentials() {
    try {
      const content = await fs.promises.readFile(TOKEN_PATH, 'utf-8');
      return google.auth.fromJSON(JSON.parse(content));
    } catch (error) {
      console.warn('No saved credentials found, proceeding to authenticate...');
      return null;
    }
  }

  /**
   * Saves the user's credentials after authentication.
   * @param {google.auth.OAuth2} client - The authenticated OAuth2 client
   */
  async saveCredentials(client) {
    const { client_id, client_secret } = JSON.parse(await fs.promises.readFile(CREDENTIALS_PATH, 'utf-8')).web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id,
      client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.promises.writeFile(TOKEN_PATH, payload);
  }

  /**
   * Authenticates the user, either by loading saved credentials or prompting for login.
   * @returns {Promise<google.auth.OAuth2>} - Returns the authenticated OAuth2 client
   */
  async authenticateUser() {
    let client = await this.loadSavedCredentials();
    if (!client) {
      client = await authenticate({
        keyfilePath: CREDENTIALS_PATH,
        scopes: ['https://www.googleapis.com/auth/blogger'],
      });
      if (client.credentials) await this.saveCredentials(client);
    }
    return client;
  }

  /**
   * Generalized request handler for interacting with the Blogger API.
   * @param {string} method - HTTP method ('GET', 'POST', etc.)
   * @param {string} endpoint - The API endpoint in 'resource.action' format
   * @param {object} params - Parameters to pass in the API request
   * @returns {Promise<object>} - The API response data
   */
  async sendRequest(method, endpoint, params = {}) {
    try {
      const authClient = await this.authenticateUser();
      google.options({ auth: authClient });

      const [resource, action] = endpoint.split('.');
      const response = await this.blogger[resource][action](params);

      return response.data;
    } catch (error) {
      throw new Error(`Error making ${method.toUpperCase()} request to ${endpoint}: ${error.message}`);
    }
  }

  /**
   * Validates that required parameters are present in a request.
   * @param {Array<string>} requiredParams - List of required parameters
   * @param {object} params - Provided parameters
   */
  validateParams(requiredParams, params) {
    requiredParams.forEach(param => {
      if (!params[param]) throw new Error(`${param.replace(/([A-Z])/g, ' $1')} is required`);
    });
  }

  /**
   * Utility to extract the domain from a given URL.
   * @param {string} url - The URL to extract the domain from
   * @returns {string} - The extracted domain
   */
  extractDomain(url) {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  }

  // === Blogger API Methods === //

  async getBlog() {
    return this.sendRequest('GET', 'blogs.get', { blogId: this.blogId });
  }

  async getBlogByUrl(blogUrl) {
    if (!blogUrl) throw new Error('Blog URL is required');
    const blogs = await this.getUserBlogs('self');
    const blog = blogs.items.find(b => this.extractDomain(b.url) === this.extractDomain(blogUrl));
    if (!blog) throw new Error('Blog not found');
    return blog;
  }

  async getPosts(params = {}) {
    return this.sendRequest('GET', 'posts.list', { blogId: this.blogId, ...params });
  }

  async getPost(postId) {
    this.validateParams(['postId'], { postId });
    return this.sendRequest('GET', 'posts.get', { blogId: this.blogId, postId });
  }

  async addPost(params) {
    return this.sendRequest('POST', 'posts.insert', { blogId: this.blogId, requestBody: params });
  }

  async deletePost(postId) {
    this.validateParams(['postId'], { postId });
    return this.sendRequest('DELETE', 'posts.delete', { blogId: this.blogId, postId });
  }

  async updatePost(postId, params) {
    this.validateParams(['postId'], { postId });
    return this.sendRequest('PUT', 'posts.update', { blogId: this.blogId, postId, requestBody: params });
  }

  async patchPost(postId, params) {
    this.validateParams(['postId'], { postId });
    return this.sendRequest('PATCH', 'posts.patch', { blogId: this.blogId, postId, requestBody: params });
  }
  
  async getComments(postId, params = {}) {
    this.validateParams(['postId'], { postId });
    return this.sendRequest('list', 'comments.list', { blogId: this.blogId, postId, ...params });
  }
  
  async getComment(postId, commentId) {
    this.validateParams(['postId', 'commentId'], { postId, commentId });
    return this.sendRequest('get', 'comments.get', { blogId: this.blogId, postId, commentId });
  }
  
  async deleteComment(postId, commentId) {
    this.validateParams(['postId', 'commentId'], { postId, commentId });
    return this.sendRequest('delete', 'comments.delete', { blogId: this.blogId, postId, commentId });
  }
  
  async approveComment(postId, commentId) {
    this.validateParams(['postId', 'commentId'], { postId, commentId });
    return this.sendRequest('approve', 'comments.approve', { blogId: this.blogId, postId, commentId });
  }
  
  async getPages(params = {}) {
    return this.sendRequest('list', 'pages.list', { blogId: this.blogId, ...params });
  }
  
  async getPage(pageId) {
    this.validateParams(['pageId'], { pageId });
    return this.sendRequest('get', 'pages.get', { blogId: this.blogId, pageId });
  }
  
  async addPage(params) {
    return this.sendRequest('insert', 'pages.insert', { blogId: this.blogId, requestBody: params });
  }
  
  async updatePage(pageId, params) {
    this.validateParams(['pageId'], { pageId });
    return this.sendRequest('update', 'pages.update', { blogId: this.blogId, pageId, requestBody: params });
  }
  
  async deletePage(pageId) {
    this.validateParams(['pageId'], { pageId });
    return this.sendRequest('delete', 'pages.delete', { blogId: this.blogId, pageId });
  }
  
  async getUserBlogs(userId) {
    if (!userId) throw new Error('User ID is required');
    return this.sendRequest('list', 'blogs.listByUser', { userId });
  }
  
  async getUser() {
    return this.sendRequest('get', 'users.get', { userId: 'self' });
  }
  
  async logout() {
    try {
      await fs.promises.unlink(TOKEN_PATH);
      console.log('Logged out successfully. Credentials have been deleted.');
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  }
}

module.exports = BloggerJS;