const express = require('express');
const app = express();
const PORT = 3000;

// Basic route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


// Home route
app.get('/', (req, res) => {
    res.send('Welcome to CommunityHub API');
});

// About route
app.get('/about', (req, res) => {
    res.send('CommunityHub - A community platform');
});

// API health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString() 
    });
});

// 404 handler (put at the end)
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// Send text
app.get('/text', (req, res) => {
    res.send('Plain text response');
});

// Send JSON
app.get('/json', (req, res) => {
    res.json({ message: 'JSON response', success: true });
});

// Send with status code
app.get('/error', (req, res) => {
    res.status(400).json({ error: 'Bad request' });
});

// Redirect
app.get('/old-page', (req, res) => {
    res.redirect('/new-page');
});

// Dynamic route with parameter
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.json({ message: `Getting user ${userId}` });
});

// Multiple parameters
app.get('/posts/:postId/comments/:commentId', (req, res) => {
    const { postId, commentId } = req.params;
    res.json({ postId, commentId });
});

// /search?q=hello&limit=10
app.get('/search', (req, res) => {
    const { q, limit = 10, page = 1 } = req.query;
    
    res.json({
        query: q,
        limit: parseInt(limit),
        page: parseInt(page)
    });
});

// /posts?category=tech&sort=newest
app.get('/posts', (req, res) => {
    const { category, sort = 'newest' } = req.query;
    
    res.json({
        message: 'Getting posts',
        filters: { category, sort }
    });
});


// Middleware to parse JSON
app.use(express.json());

// In-memory data store
let posts = [
    { 
        id: 1, 
        title: "Getting Started with Node.js", 
        content: "Node.js is a JavaScript runtime...",
        author: "John Doe",
        createdAt: "2026-01-15T10:00:00Z",
        likes: 10
    },
    { 
        id: 2, 
        title: "Express.js Fundamentals", 
        content: "Express is a web framework...",
        author: "Jane Smith",
        createdAt: "2026-01-16T14:30:00Z",
        likes: 15
    }
];

let nextId = 3;

// GET all posts
app.get('/api/posts', (req, res) => {
    const { author, sort } = req.query;
    
    let result = [...posts];
    
    // Filter by author
    if (author) {
        result = result.filter(post => 
            post.author.toLowerCase().includes(author.toLowerCase())
        );
    }
    
    // Sort
    if (sort === 'newest') {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'popular') {
        result.sort((a, b) => b.likes - a.likes);
    }
    
    res.json(result);
});

// GET single post
app.get('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const post = posts.find(p => p.id === id);
    
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(post);
});

// POST create new post
app.post('/api/posts', (req, res) => {
    const { title, content, author } = req.body;
    
    // Validation
    if (!title || !content || !author) {
        return res.status(400).json({ 
            error: 'Title, content, and author are required' 
        });
    }
    
    const newPost = {
        id: nextId++,
        title,
        content,
        author,
        createdAt: new Date().toISOString(),
        likes: 0
    };
    
    posts.push(newPost);
    res.status(201).json(newPost);
});

// PUT update post
app.put('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === id);
    
    if (postIndex === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }
    
    const { title, content } = req.body;
    
    posts[postIndex] = {
        ...posts[postIndex],
        title: title || posts[postIndex].title,
        content: content || posts[postIndex].content,
        updatedAt: new Date().toISOString()
    };
    
    res.json(posts[postIndex]);
});

// DELETE post
app.delete('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === id);
    
    if (postIndex === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }
    
    posts.splice(postIndex, 1);
    res.status(204).send();  // No content
});

// PATCH like a post
app.patch('/api/posts/:id/like', (req, res) => {
    const id = parseInt(req.params.id);
    const post = posts.find(p => p.id === id);
    
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    
    post.likes++;
    res.json(post);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});