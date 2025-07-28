const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory comments store
// Structure: { id, caseId, author, content, parentId, timestamp, attachments }
const comments = [];

// Get all comments for a case (flat or threaded)
router.get('/:caseId', (req, res) => {
  const { caseId } = req.params;
  const caseComments = comments.filter(c => c.caseId === caseId);
  res.json(caseComments);
});

// Post a new comment or reply
router.post('/', (req, res) => {
  const { caseId, author, content, parentId, attachments } = req.body;
  if (!caseId || !author || !content) {
    return res.status(400).json({ error: 'caseId, author, and content are required' });
  }
  const newComment = {
    id: uuidv4(),
    caseId,
    author,
    content,
    parentId: parentId || null,
    timestamp: new Date().toISOString(),
    attachments: attachments || [],
  };
  comments.push(newComment);
  res.status(201).json(newComment);
});

// Edit a comment (by id and author)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { author, content } = req.body;
  const comment = comments.find(c => c.id === id);
  if (!comment) return res.status(404).json({ error: 'Comment not found' });
  if (comment.author !== author) return res.status(403).json({ error: 'Not your comment' });
  comment.content = content;
  comment.edited = true;
  res.json(comment);
});

// Delete a comment (by id and author)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const { author } = req.body;
  const idx = comments.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Comment not found' });
  if (comments[idx].author !== author) return res.status(403).json({ error: 'Not your comment' });
  comments.splice(idx, 1);
  res.json({ success: true });
});

module.exports = router; 