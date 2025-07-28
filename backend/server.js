const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const users = [
  { email: 'testuser@example.com', password: 'Test1234!', firstName: 'Test', lastName: 'User' }
];
const cases = [
  { id: 1, title: 'Demo Case', latlng: { lat: 40.7128, lng: -74.0060 }, city: 'New York', country: 'USA', description: 'A sample case in New York.' },
  { id: 2, title: 'Pediatric Respiratory Infection', latlng: { lat: 34.0522, lng: -118.2437 }, city: 'Los Angeles', country: 'USA', description: 'Pediatric case in Los Angeles.' },
  { id: 3, title: 'Hypertension Management', latlng: { lat: 51.5074, lng: -0.1278 }, city: 'London', country: 'UK', description: 'Hypertension case in London.' },
  { id: 4, title: 'Diabetes Care', latlng: { lat: 35.6895, lng: 139.6917 }, city: 'Tokyo', country: 'Japan', description: 'Diabetes care case in Tokyo.' },
  { id: 5, title: 'Routine Health Checkup', latlng: { lat: -33.8688, lng: 151.2093 }, city: 'Sydney', country: 'Australia', description: 'Routine checkup in Sydney.' },
  { id: 6, title: 'Rare Neurological Event', latlng: { lat: 48.8566, lng: 2.3522 }, city: 'Paris', country: 'France', description: 'Rare neurological case in Paris.' },
  { id: 7, title: 'Cardiology Follow-up', latlng: { lat: 41.9028, lng: 12.4964 }, city: 'Rome', country: 'Italy', description: 'Cardiology follow-up in Rome.' },
  { id: 8, title: 'Pulmonary Infection', latlng: { lat: 55.7558, lng: 37.6173 }, city: 'Moscow', country: 'Russia', description: 'Pulmonary infection in Moscow.' },
  { id: 9, title: 'Oncology Consultation', latlng: { lat: 19.4326, lng: -99.1332 }, city: 'Mexico City', country: 'Mexico', description: 'Oncology consultation in Mexico City.' },
  { id: 10, title: 'Dermatology Case', latlng: { lat: -23.5505, lng: -46.6333 }, city: 'São Paulo', country: 'Brazil', description: 'Dermatology case in São Paulo.' }
];
const comments = []; // In-memory comments

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.json({ token: 'demo-token', user });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'User already exists' });
  }
  const user = { email, password, firstName, lastName };
  users.push(user);
  res.json({ message: 'User registered' });
});

app.post('/api/comments', (req, res) => {
  const { caseId, author, content, parentId, attachments } = req.body;
  if (!caseId || !author || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const comment = { id: comments.length + 1, caseId, author, content, parentId: parentId || null, timestamp: new Date().toISOString(), attachments: attachments || [] };
  comments.push(comment);
  res.json(comment);
});

app.get('/api/comments', (req, res) => {
  const { caseId } = req.query;
  if (caseId) {
    return res.json(comments.filter(c => c.caseId === caseId));
  }
  res.json(comments);
});

app.get('/api/comments/:caseId', (req, res) => {
  const { caseId } = req.params;
  res.json(comments.filter(c => c.caseId === caseId));
});

// Edit a comment (by id and author)
app.put('/api/comments/:id', (req, res) => {
  const { id } = req.params;
  const { author, content } = req.body;
  const comment = comments.find(c => c.id == id);
  if (!comment) return res.status(404).json({ error: 'Comment not found' });
  if (comment.author !== author) return res.status(403).json({ error: 'Not your comment' });
  comment.content = content;
  comment.edited = true;
  res.json(comment);
});

// Delete a comment (by id and author)
app.delete('/api/comments/:id', (req, res) => {
  const { id } = req.params;
  const { author } = req.body;
  const idx = comments.findIndex(c => c.id == id);
  if (idx === -1) return res.status(404).json({ error: 'Comment not found' });
  if (comments[idx].author !== author) return res.status(403).json({ error: 'Not your comment' });
  comments.splice(idx, 1);
  res.json({ success: true });
});

app.get('/api/cases', (req, res) => {
  res.json(cases);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
