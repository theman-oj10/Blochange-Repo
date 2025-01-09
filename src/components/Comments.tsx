import React, { useState } from 'react';
import { UserCircle } from 'lucide-react';

interface Comment {
  id: number;
  user: string;
  text: string;
  date: string;
}

const Comments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, user: 'Alice', text: 'Great cause! Happy to support.', date: '2023-09-15' },
    { id: 2, user: 'Bob', text: 'This project is making a real difference.', date: '2023-09-14' },
  ]);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        user: 'Current User', // Update this to the actual user
        text: newComment.trim(),
        date: new Date().toISOString().split('T')[0],
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Comments</h2>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center mb-2">
              <UserCircle className="w-6 h-6 mr-2 text-gray-500" />
              <span className="font-semibold">{comment.user}</span>
              <span className="text-gray-500 text-sm ml-2">{comment.date}</span>
            </div>
            <p className="text-gray-700">{comment.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-6">
        <textarea
          className="w-full p-2 border rounded-lg resize-none"
          rows={3}
          placeholder="Leave a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Post Comment
        </button>
      </form>
    </div>
  );
};

export default Comments;