// Node.js can run JavaScript without a browser!
console.log("Hello from Node.js!");

// Access environment info
console.log("Node version:", process.version);
console.log("Current directory:", process.cwd());
console.log("Platform:", process.platform);

// Command line arguments
console.log("Arguments:", process.argv);

// fs - File System
const fs = require('fs');

// Read file (synchronous)
const content = fs.readFileSync('hello.js', 'utf-8');
console.log(content);

// Read file (asynchronous - preferred)
fs.readFile('hello.js', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
});

// Write file
fs.writeFileSync('output.txt', 'Hello, World!');

// path - Path utilities
const path = require('path');
console.log(path.join(__dirname, 'files', 'data.json'));
console.log(path.extname('photo.jpg'));  // .jpg