const API_BASE = '/api/comments';

export async function fetchComments(caseId) {
  const res = await fetch(`${API_BASE}/${caseId}`);
  if (!res.ok) throw new Error('Failed to fetch comments');
  return res.json();
}

export async function postComment({ caseId, author, content, parentId, attachments }) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ caseId, author, content, parentId, attachments }),
  });
  if (!res.ok) throw new Error('Failed to post comment');
  return res.json();
}

export async function editComment({ id, author, content }) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author, content }),
  });
  if (!res.ok) throw new Error('Failed to edit comment');
  return res.json();
}

export async function deleteComment({ id, author }) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author }),
  });
  if (!res.ok) throw new Error('Failed to delete comment');
  return res.json();
} 