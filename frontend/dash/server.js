const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the public directory
app.use(express.static('public'));

// Serve home.html as the default page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Add route handler for /dash
app.get('/dash', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve index.html for all other routes (SPA fallback for React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 