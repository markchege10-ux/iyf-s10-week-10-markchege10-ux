// Middleware is a function that runs between request and response
// It has access to req, res, and next

// Logger middleware
const logger = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();  // Pass to next middleware/route
};

// Apply to all routes
app.use(logger);

// Request time middleware
const addRequestTime = (req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
};

app.use(addRequestTime);

// Use in route
app.get('/api/time', (req, res) => {
    res.json({ requestTime: req.requestTime });
});

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies (forms)
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Auth check middleware
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ error: 'No authorization header' });
    }
    
    // In real app, verify token here
    next();
};

// Apply to specific routes
app.get('/api/protected', requireAuth, (req, res) => {
    res.json({ message: 'This is protected data' });
});

// Apply to all routes starting with /api/admin
app.use('/api/admin', requireAuth);

// Custom error class
class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Route that throws error
app.get('/api/error-test', (req, res, next) => {
    try {
        throw new ApiError('Something went wrong', 500);
    } catch (error) {
        next(error);  // Pass to error handler
    }
});

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage
app.get('/api/users', asyncHandler(async (req, res) => {
    const users = await fetchUsers();  // If this throws, it's caught
    res.json(users);
}));

// Error handling middleware (must be last!)
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(statusCode).json({
        error: {
            message,
            status: statusCode
        }
    });
});

// Simple validation middleware
const validatePost = (req, res, next) => {
    const { title, content, author } = req.body;
    const errors = [];
    
    if (!title || title.length < 3) {
        errors.push('Title must be at least 3 characters');
    }
    
    if (!content || content.length < 10) {
        errors.push('Content must be at least 10 characters');
    }
    
    if (!author) {
        errors.push('Author is required');
    }
    
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    
    next();
};

// Apply to route
app.post('/api/posts', validatePost, (req, res) => {
    // Create post (validation already passed)
});