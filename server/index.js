const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/openai', require('./routes/openai'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/cases', require('./routes/cases'));
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

app.get('/', (req, res) => {
  res.send('Agno Medical Intelligence Backend Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 