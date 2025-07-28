import React, { useState, useEffect, useRef } from 'react';
import { supabaseService } from '../../../services/supabaseClient';
// Mock user list for mentions (replace with real user list from backend in future)
const MOCK_USERS = [
  { name: 'Dr. Sarah Chen', email: 'sarah.chen@hospital.com' },
  { name: 'Dr. John Smith', email: 'john.smith@hospital.com' },
  { name: 'Dr. Emily Lee', email: 'emily.lee@hospital.com' },
];

const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export default function CommentSection({ caseId }) {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState('');
  const [posting, setPosting] = useState(false);
  const commentsEndRef = useRef(null);
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [mentionDropdown, setMentionDropdown] = useState({ open: false, query: '', position: { x: 0, y: 0 } });
  const [mentionCandidates, setMentionCandidates] = useState([]);
  const textareaRef = useRef();
  const [attachment, setAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [replyInput, setReplyInput] = useState('');
  const [replyAttachment, setReplyAttachment] = useState(null);
  const [replyAttachmentPreview, setReplyAttachmentPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const prevCommentsLength = useRef(0);

  // Get logged-in user info safely
  let userInfo = {};
  try {
    const raw = localStorage.getItem('userInfo');
    userInfo = raw && raw !== 'undefined' ? JSON.parse(raw) : {};
  } catch {
    userInfo = {};
  }
  const userName = userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : userInfo.email || 'User';
  const userId = userInfo.id || userInfo.email || 'user-1';

  // Load comments from Supabase on mount or caseId change
  useEffect(() => {
    const loadComments = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabaseService.getComments(caseId);
        if (error) {
          console.error('Error loading comments:', error);
          setComments([]);
        } else {
          setComments(data || []);
        }
      } catch (err) {
        console.error('Error loading comments:', err);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    if (caseId) {
      loadComments();
    }
  }, [caseId]);

  // Scroll to bottom when comments change
  useEffect(() => {
    if (comments.length > prevCommentsLength.current && commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    prevCommentsLength.current = comments.length;
  }, [comments]);

  // Handle file input change
  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAttachment(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => setAttachmentPreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setAttachmentPreview(null);
    }
  };

  const clearAttachment = () => {
    setAttachment(null);
    setAttachmentPreview(null);
  };

  const handlePost = async () => {
    if (!input.trim() && !attachment) return;
    
    setPosting(true);
    try {
      const commentData = {
        case_id: caseId,
        author_id: userId,
        content: input.trim(),
        attachments: attachment ? [{ name: attachment.name, type: attachment.type, size: attachment.size }] : []
      };

      const { data, error } = await supabaseService.createComment(commentData);
      
      if (error) {
        console.error('Error posting comment:', error);
        setError('Failed to post comment');
      } else {
        setComments(prev => [...prev, data]);
        setInput('');
        clearAttachment();
        setError(null);
      }
    } catch (err) {
      console.error('Error posting comment:', err);
      setError('Failed to post comment');
    } finally {
      setPosting(false);
    }
  };

  const handleEdit = (comment) => {
    setEditingId(comment.id);
    setEditingValue(comment.content);
  };

  const handleEditSave = async (comment) => {
    try {
      const { data, error } = await supabaseService.updateComment(comment.id, {
        content: editingValue
      });
      
      if (error) {
        console.error('Error updating comment:', error);
        setError('Failed to update comment');
      } else {
        setComments(prev => prev.map(c => c.id === comment.id ? { ...c, content: editingValue } : c));
        setEditingId(null);
        setEditingValue('');
        setError(null);
      }
    } catch (err) {
      console.error('Error updating comment:', err);
      setError('Failed to update comment');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingValue('');
  };

  const handleDelete = (comment) => {
    setDeletingId(comment.id);
  };

  const confirmDelete = async (comment) => {
    try {
      const { error } = await supabaseService.deleteComment(comment.id);
      
      if (error) {
        console.error('Error deleting comment:', error);
        setError('Failed to delete comment');
      } else {
        setComments(prev => prev.filter(c => c.id !== comment.id));
        setDeletingId(null);
        setError(null);
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Failed to delete comment');
    }
  };

  const cancelDelete = () => {
    setDeletingId(null);
  };

  // Mention detection in textarea
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    const cursor = e.target.selectionStart;
    const textUpToCursor = value.slice(0, cursor);
    const match = /(^|\s)@(\w*)$/.exec(textUpToCursor);
    if (match) {
      const query = match[2].toLowerCase();
      const candidates = MOCK_USERS.filter(u =>
        u.name.toLowerCase().replace(/[^a-z0-9]/g, '').includes(query)
      );
      const rect = e.target.getBoundingClientRect();
      setMentionDropdown({
        open: true,
        query,
        position: { x: rect.left + 40, y: rect.top + e.target.offsetHeight + 4 },
      });
      setMentionCandidates(candidates);
    } else {
      setMentionDropdown({ open: false, query: '', position: { x: 0, y: 0 } });
    }
  };

  const handleMentionSelect = (user) => {
    // Insert mention at cursor
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const cursor = textarea.selectionStart;
    const value = input;
    const textUpToCursor = value.slice(0, cursor);
    const match = /(^|\s)@(\w*)$/.exec(textUpToCursor);
    if (match) {
      const before = value.slice(0, match.index + match[1].length);
      const after = value.slice(cursor);
      const mentionText = `@${user.name.replace(/ /g, '')}`;
      const newValue = before + mentionText + ' ' + after;
      setInput(newValue);
      setMentionDropdown({ open: false, query: '', position: { x: 0, y: 0 } });
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = (before + mentionText + ' ').length;
      }, 0);
    }
  };

  // Handle reply attachment
  const handleReplyAttachmentChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setReplyAttachment(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => setReplyAttachmentPreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setReplyAttachmentPreview(null);
    }
  };
  const clearReplyAttachment = () => {
    setReplyAttachment(null);
    setReplyAttachmentPreview(null);
  };

  const handleReply = (parentId) => {
    setReplyTo(parentId);
    setReplyInput('');
    clearReplyAttachment();
  };
  const handleCancelReply = () => {
    setReplyTo(null);
    setReplyInput('');
    clearReplyAttachment();
  };
  const handlePostReply = async (parentId) => {
    if (!replyInput.trim() && !replyAttachment) return;
    let attachmentData = null;
    if (replyAttachment) {
      if (replyAttachment.type.startsWith('image/')) {
        attachmentData = {
          name: replyAttachment.name,
          type: replyAttachment.type,
          url: replyAttachmentPreview,
        };
      } else {
        attachmentData = {
          name: replyAttachment.name,
          type: replyAttachment.type,
          url: URL.createObjectURL(replyAttachment),
        };
      }
    }
    try {
      const replyComment = await supabaseService.createComment({
        case_id: caseId,
        author_id: userId,
        content: replyInput.trim(),
        parent_id: parentId,
        attachments: attachmentData ? [{ name: attachmentData.name, type: attachmentData.type, url: attachmentData.url }] : []
      });
      setComments((prev) => [...prev, replyComment]);
      setReplyTo(null);
      setReplyInput('');
      clearReplyAttachment();
    } catch (e) {
      setError('Failed to post reply');
    }
  };

  // Helper to get replies for a comment
  const getReplies = (commentId) =>
    comments.filter((c) => c.parent_id === commentId);

  // Recursive render for comments and replies
  const renderComment = (comment, depth = 0) => (
    <div key={comment.id} className={`flex items-start space-x-3 group ${depth > 0 ? 'ml-8' : ''}`}>
      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-lg">
        {getInitials(comment.author)}
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-card-foreground">{comment.author}</span>
          <span className="text-xs text-muted-foreground">{new Date(comment.timestamp).toLocaleString()}</span>
          {comment.edited && <span className="text-xs text-muted-foreground italic">(edited)</span>}
        </div>
        {editingId === comment.id ? (
          <div className="flex items-end space-x-2 mt-1">
            <textarea
              className="flex-1 min-h-[40px] max-h-32 p-2 border border-border rounded-md resize-y bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              value={editingValue}
              onChange={e => setEditingValue(e.target.value)}
              autoFocus
            />
            <button
              className="bg-accent text-accent-foreground px-3 py-1 rounded-md font-medium hover:bg-accent/90 transition disabled:opacity-50"
              onClick={() => handleEditSave(comment)}
              disabled={!editingValue.trim()}
            >Save</button>
            <button
              className="bg-muted text-muted-foreground px-3 py-1 rounded-md font-medium hover:bg-muted/80 transition"
              onClick={handleEditCancel}
            >Cancel</button>
          </div>
        ) : (
          <div className="text-sm text-foreground mt-1 whitespace-pre-line">
            {/* Highlight @mentions */}
            {(comment && comment.content ? comment.content : '').split(/(\s+)/).map((word, i) =>
              word.startsWith('@') ? (
                <span key={i} className="text-accent font-semibold">{word}</span>
              ) : word
            )}
            {/* Show attachment if present */}
            {Array.isArray(comment.attachments) && comment.attachments.length > 0 && (
              <div className="mt-2">
                {comment.attachments.map((att, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    {att.type && att.type.startsWith('image/') ? (
                      <img
                        src={att.url}
                        alt={att.name}
                        className="max-w-xs max-h-40 rounded border border-border"
                      />
                    ) : (
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent underline text-xs"
                      >
                        {att.name}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Reply, Edit, Delete actions */}
        <div className="flex items-center space-x-2 mt-1">
          <button
            className="text-xs text-accent hover:underline"
            onClick={() => handleReply(comment.id)}
          >Reply</button>
          {comment.author_id === userId && editingId !== comment.id && (
            <>
              <button
                className="text-xs text-accent hover:underline"
                title="Edit"
                onClick={() => handleEdit(comment)}
              >Edit</button>
              <button
                className="text-xs text-error hover:underline"
                title="Delete"
                onClick={() => handleDelete(comment)}
              >Delete</button>
            </>
          )}
        </div>
        {/* Reply input */}
        {replyTo === comment.id && (
          <div className="mt-2 flex flex-col space-y-2">
            <textarea
              className="min-h-[40px] max-h-32 p-2 border border-border rounded-md resize-y bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Write a reply..."
              value={replyInput}
              onChange={e => setReplyInput(e.target.value)}
              autoFocus
            />
            <div className="flex items-center space-x-2">
              <label className="cursor-pointer text-accent hover:underline text-xs">
                <input
                  id="reply-attachment-input"
                  type="file"
                  className="hidden"
                  onChange={handleReplyAttachmentChange}
                />
                Attach
              </label>
              {replyAttachment && (
                <>
                  {replyAttachmentPreview ? (
                    <img src={replyAttachmentPreview} alt="preview" className="w-8 h-8 object-cover rounded border" />
                  ) : (
                    <span className="text-xs">{replyAttachment.name}</span>
                  )}
                  <button className="text-error text-xs ml-1" onClick={clearReplyAttachment} title="Remove attachment">✕</button>
                </>
              )}
              <button
                className="bg-accent text-accent-foreground px-3 py-1 rounded-md font-medium hover:bg-accent/90 transition disabled:opacity-50"
                onClick={() => handlePostReply(comment.id)}
                disabled={!replyInput.trim() && !replyAttachment}
              >Post Reply</button>
              <button
                className="bg-muted text-muted-foreground px-3 py-1 rounded-md font-medium hover:bg-muted/80 transition"
                onClick={handleCancelReply}
              >Cancel</button>
            </div>
          </div>
        )}
        {/* Render replies recursively */}
        {getReplies(comment.id).length > 0 && (
          <div className="mt-2 space-y-2">
            {getReplies(comment.id).map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
      {/* Delete confirmation */}
      {deletingId === comment.id && (
        <div className="absolute z-10 bg-card border border-border rounded-lg shadow-lg p-4 left-1/2 -translate-x-1/2 mt-8">
          <div className="text-sm mb-2">Delete this comment?</div>
          <div className="flex space-x-2">
            <button className="bg-error text-white px-3 py-1 rounded" onClick={() => confirmDelete(comment)}>Delete</button>
            <button className="bg-muted text-muted-foreground px-3 py-1 rounded" onClick={cancelDelete}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card mt-8">
      <h3 className="text-lg font-heading font-semibold text-card-foreground mb-4">Case Discussion</h3>
      <div className="max-h-72 overflow-y-auto space-y-4 mb-4 pr-2">
        {loading && <div className="text-center py-4">Loading comments...</div>}
        {error && <div className="text-center py-4 text-error">{error}</div>}
        {comments.filter(c => c && typeof c === 'object' && c.content).filter(c => !c.parent_id).map((comment) => renderComment(comment, 0))}
        <div ref={commentsEndRef} />
      </div>
      <div className="flex items-end space-x-2 mt-2">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            className="w-full min-h-[40px] max-h-32 p-2 border border-border rounded-md resize-y bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Write a comment... Use @ to mention a user."
            value={input}
            onChange={handleInputChange}
            disabled={posting}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handlePost();
              }
            }}
          />
          {/* Mention dropdown */}
          {mentionDropdown.open && mentionCandidates.length > 0 && (
            <div
              className="absolute z-20 bg-card border border-border rounded shadow-lg mt-1 left-0"
              style={{ minWidth: 200 }}
            >
              {mentionCandidates.map((user, idx) => (
                <div
                  key={user.email}
                  className="px-3 py-2 hover:bg-accent/10 cursor-pointer text-sm"
                  onMouseDown={() => handleMentionSelect(user)}
                >
                  @{user.name.replace(/ /g, '')}
                  <span className="text-muted-foreground ml-2">{user.email}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Attachment input */}
        <div className="flex flex-col items-center space-y-1">
          <label className="cursor-pointer text-accent hover:underline text-xs">
            <input
              id="comment-attachment-input"
              type="file"
              className="hidden"
              onChange={handleAttachmentChange}
              disabled={posting}
            />
            Attach
          </label>
          {attachment && (
            <div className="flex items-center space-x-1">
              {attachmentPreview ? (
                <img src={attachmentPreview} alt="preview" className="w-8 h-8 object-cover rounded border" />
              ) : (
                <span className="text-xs">{attachment.name}</span>
              )}
              <button className="text-error text-xs ml-1" onClick={clearAttachment} title="Remove attachment">✕</button>
            </div>
          )}
        </div>
        <button
          className="bg-accent text-accent-foreground px-4 py-2 rounded-md font-medium hover:bg-accent/90 transition disabled:opacity-50"
          onClick={handlePost}
          disabled={posting || (!input.trim() && !attachment)}
        >
          Post
        </button>
      </div>
    </div>
  );
} 