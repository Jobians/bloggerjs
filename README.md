# BloggerJS

BloggerJS is a Node.js wrapper for the Google Blogger API v3, allowing you to interact with blogs, posts, pages, comments, and users programmatically. 

## Features
- Retrieve blog details by ID or URL
- Manage blog posts: create, update, delete, and list
- Manage pages: create, update, delete, and list
- Manage comments: list, approve, and delete
- Retrieve user information and blogs
- Supports custom requests via `sendRequest`

## Installation

Install via npm:

```bash
npm install @jobians/bloggerjs
```

## Getting Started

### Using Provided `credentials.json`

This library comes with a working `credentials.json` file to help you get started quickly. You can either:
- Use the provided `credentials.json` as-is for testing.
- Replace it with your own credentials if you have an existing Google Cloud project.

To replace the credentials, simply download your `credentials.json` file from your [Google Cloud Console](https://console.cloud.google.com/) and overwrite the existing `credentials.json` file in the root directory.

### Usage Example

```javascript
const BloggerJS = require('@jobians/bloggerjs');

const blogId = 'your-blog-id';
const blogger = new BloggerJS(blogId);

(async () => {
  try {
    // Get Blog Details
    const blog = await blogger.getBlog();
    console.log(blog);

    // Get Blog by URL
    const blogByUrl = await blogger.getBlogByUrl('http://username.blogspot.com');
    console.log(blogByUrl);

    // List Posts
    const posts = await blogger.getPosts({ maxResults: 5 });
    console.log(posts);

    // Get a Specific Post by ID
    const postId = 'your-post-id';
    const post = await blogger.getPost(postId);
    console.log(post);

    // Add a New Post
    const newPost = await blogger.addPost({
      title: 'My New Post',
      content: 'This is the content of my new post!',
    });
    console.log(newPost);

    // Update a Post
    const updatedPost = await blogger.updatePost(postId, {
      title: 'Updated Post Title',
      content: 'Updated content of the post',
    });
    console.log(updatedPost);

    // Delete a Post
    await blogger.deletePost(postId);
    console.log(`Post ${postId} deleted`);

  } catch (error) {
    console.error('Error:', error.message);
  }
})();
```

## API Documentation

### 1. `getBlog()`
Retrieve blog details using the blog ID provided during instantiation.

```javascript
const blog = await blogger.getBlog();
console.log(blog);
```

### 2. `getBlogByUrl(blogUrl)`
Retrieve a blog's details using its URL.

**Parameters:**
- `blogUrl` (string) – The URL of the blog.

```javascript
const blogByUrl = await blogger.getBlogByUrl('http://username.blogspot.com');
console.log(blogByUrl);
```

### 3. `getPosts(params = {})`
Retrieve a list of posts for the blog.

**Optional Parameters:**
- `maxResults` (number) – The maximum number of posts to return.

```javascript
const posts = await blogger.getPosts({ maxResults: 10 });
console.log(posts);
```

### 4. `getPost(postId)`
Retrieve details of a specific post by its ID.

**Parameters:**
- `postId` (string) – The ID of the post.

```javascript
const post = await blogger.getPost('your-post-id');
console.log(post);
```

### 5. `addPost(params)`
Create a new post on the blog.

**Parameters:**
- `params` (object) – An object containing the post properties, such as `title`, `content`, etc.

```javascript
const newPost = await blogger.addPost({
  title: 'New Post Title',
  content: 'The content of the new post.',
});
console.log(newPost);
```

### 6. `deletePost(postId)`
Delete a post by its ID.

**Parameters:**
- `postId` (string) – The ID of the post to delete.

```javascript
await blogger.deletePost('your-post-id');
console.log('Post deleted');
```

### 7. `updatePost(postId, params)`
Update an existing post.

**Parameters:**
- `postId` (string) – The ID of the post to update.
- `params` (object) – An object containing the new post properties (e.g., `title`, `content`).

```javascript
const updatedPost = await blogger.updatePost('your-post-id', {
  title: 'Updated Title',
  content: 'Updated post content',
});
console.log(updatedPost);
```

### 8. `patchPost(postId, params)`
Partially update a post using patch semantics.

**Parameters:**
- `postId` (string) – The ID of the post to update.
- `params` (object) – An object containing the fields to update.

```javascript
const patchedPost = await blogger.patchPost('your-post-id', {
  content: 'Partially updated content',
});
console.log(patchedPost);
```

### 9. `getComments(postId, params = {})`
Retrieve a list of comments for a specific post.

**Parameters:**
- `postId` (string) – The ID of the post.
- `params` (object) – Optional parameters such as `maxResults`.

```javascript
const comments = await blogger.getComments('your-post-id', { maxResults: 5 });
console.log(comments);
```

### 10. `getComment(postId, commentId)`
Retrieve details of a specific comment by its ID.

**Parameters:**
- `postId` (string) – The ID of the post.
- `commentId` (string) – The ID of the comment.

```javascript
const comment = await blogger.getComment('your-post-id', 'comment-id');
console.log(comment);
```

### 11. `deleteComment(postId, commentId)`
Delete a specific comment by its ID.

**Parameters:**
- `postId` (string) – The ID of the post.
- `commentId` (string) – The ID of the comment.

```javascript
await blogger.deleteComment('your-post-id', 'comment-id');
console.log('Comment deleted');
```

### 12. `approveComment(postId, commentId)`
Approve a comment that is awaiting moderation.

**Parameters:**
- `postId` (string) – The ID of the post.
- `commentId` (string) – The ID of the comment.

```javascript
await blogger.approveComment('your-post-id', 'comment-id');
console.log('Comment approved');
```

### 13. `getPages(params = {})`
Retrieve a list of pages for the blog.

**Optional Parameters:**
- `maxResults` (number) – The maximum number of pages to return.

```javascript
const pages = await blogger.getPages({ maxResults: 10 });
console.log(pages);
```

### 14. `getPage(pageId)`
Retrieve details of a specific page by its ID.

**Parameters:**
- `pageId` (string) – The ID of the page.

```javascript
const page = await blogger.getPage('your-page-id');
console.log(page);
```

### 15. `addPage(params)`
Create a new page on the blog.

**Parameters:**
- `params` (object) – An object containing the page properties, such as `title`, `content`, etc.

```javascript
const newPage = await blogger.addPage({
  title: 'New Page Title',
  content: 'The content of the new page.',
});
console.log(newPage);
```

### 16. `updatePage(pageId, params)`
Update an existing page.

**Parameters:**
- `pageId` (string) – The ID of the page to update.
- `params` (object) – An object containing the new page properties (e.g., `title`, `content`).

```javascript
const updatedPage = await blogger.updatePage('your-page-id', {
  title: 'Updated Title',
  content: 'Updated page content',
});
console.log(updatedPage);
```

### 17. `deletePage(pageId)`
Delete a page by its ID.

**Parameters:**
- `pageId` (string) – The ID of the page to delete.

```javascript
await blogger.deletePage('your-page-id');
console.log('Page deleted');
```

### 18. `getUserBlogs(userId)`
Retrieve a list of blogs for the specified user.

**Parameters:**
- `userId` (string) – The ID of the user. Use `'self'` to refer to the authenticated user.

```javascript
const blogs = await blogger.getUserBlogs('self');
console.log(blogs);
```

### 19. `getUser()`
Retrieve the authenticated user's details.

```javascript
const user = await blogger.getUser();
console.log(user);
```

### 20. `logout()`
Log out and remove saved authentication credentials. This will delete the `token.json` file, effectively logging you out of the Blogger API.

```javascript
await blogger.logout();
```

## Extending with Custom Requests

You can extend this class to make any custom requests that aren't directly covered by the provided methods. The `sendRequest` method allows you to make API calls by specifying the HTTP method, the endpoint, and any parameters.

### `sendRequest(method, endpoint, params)`
Make a custom request to any Blogger API endpoint.

**Parameters:**
- `method` (string) – The HTTP method (e.g., `'get'`, `'post'`, `'delete'`, etc.).
- `endpoint` (string) – The Blogger API endpoint in the format `resource.action`.
- `params` (object) – The parameters to send with the request.

**Example**:

```javascript
// Custom request to list posts with a specific label
const customRequest = await blogger.sendRequest('get', 'posts.list', {
  blogId: 'your-blog-id',
  labels: 'Technology',
  maxResults: 5,
});
console.log(customRequest);
```

The `sendRequest` method gives you the flexibility to interact with any part of the Blogger API, even those not directly wrapped by this library. You can refer to the official [Blogger API v3 documentation](https://developers.google.com/blogger/docs/3.0/reference/) for more information on available endpoints.

## Support

If you find my work helpful, you can support me by donating:

[![Donate](https://img.shields.io/badge/Donate-Crypto-0070BA.svg)](https://cwallet.com/t/TE6A6KMV)