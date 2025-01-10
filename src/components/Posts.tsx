import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Plus, Share2, MessageCircle, ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { formatDistanceToNow, parseISO, isValid } from 'date-fns';

const formatDate = (dateString) => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return isValid(date) ? formatDistanceToNow(date, { addSuffix: true }) : 'recently';
  } catch (error) {
    return 'recently';
  }
};

const Comment = ({ comment, level = 0, onReply }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [votes, setVotes] = useState(comment.votes || 0);
  const [voteStatus, setVoteStatus] = useState(0); // -1: downvote, 0: none, 1: upvote

  const handleVote = (direction) => {
    if (voteStatus === direction) {
      setVotes(votes - direction);
      setVoteStatus(0);
    } else {
      setVotes(votes - voteStatus + direction);
      setVoteStatus(direction);
    }
  };

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReply({
        id: Math.random().toString(36).substr(2, 9),
        content: replyContent,
        author: 'Current User',
        date: new Date().toISOString(),
        votes: 0,
        replies: [],
      }, comment.id);
      setReplyContent('');
      setIsReplying(false);
    }
  };

  return (
    <div className={`ml-${level * 4} relative`}>
      <div className="flex gap-4">
        <div className="flex flex-col items-center mt-1">
          <button 
            onClick={() => handleVote(1)}
            className="hover:bg-gray-100 p-1 rounded-full transition-colors"
          >
            <ArrowBigUp 
              size={24} 
              className={voteStatus === 1 ? 'text-blue-500' : 'text-gray-400'} 
            />
          </button>
          <span className={`text-lg font-medium my-1 ${
            voteStatus === 1 ? 'text-blue-500' : 
            voteStatus === -1 ? 'text-red-500' : 
            'text-gray-600'
          }`}>
            {votes}
          </span>
          <button 
            onClick={() => handleVote(-1)}
            className="hover:bg-gray-100 p-1 rounded-full transition-colors"
          >
            <ArrowBigDown 
              size={24} 
              className={voteStatus === -1 ? 'text-red-500' : 'text-gray-400'} 
            />
          </button>
        </div>

        <div className="flex-1">
          <p className="text-gray-700 text-lg">{comment.content}</p>
          <div className="flex gap-4 mt-2 text-base text-gray-500">
            <button 
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1 hover:text-gray-700"
            >
              <MessageCircle size={20} />
              Reply
            </button>
            <button className="flex items-center gap-1 hover:text-gray-700">
              <Share2 size={20} />
              Share
            </button>
            <span className="text-gray-400">
              • {formatDate(comment.date)}
            </span>
          </div>

          {isReplying && (
            <div className="mt-4">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg text-base"
                rows={4}
                placeholder="Write a reply..."
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSubmitReply}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-base hover:bg-blue-600 transition-colors"
                >
                  Reply
                </button>
                <button
                  onClick={() => setIsReplying(false)}
                  className="px-4 py-2 text-gray-600 rounded-lg text-base hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="mt-4">
            {comment.replies?.map((reply) => (
              <Comment 
                key={reply.id} 
                comment={reply} 
                level={level + 1}
                onReply={onReply}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Posts = ({ milestoneId, userId, initialPosts }) => {
  const [posts, setPosts] = useState(initialPosts || []);
  const [newPost, setNewPost] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState('hot');
  const fileInputRef = useRef(null);
  const comments = [
    {
      content: "Great cause, and even better team behind it!",
      date: "2024-10-31",
    },
    {
      content: "Truly inspiring work! Can't wait to see the impact.",
      date: "2024-11-01",
    },
    {
      content: "A meaningful initiative that’s much needed. Kudos to the team!",
      date: "2024-11-01",
    },
    {
      content: "Love the focus on sustainable practices for long-term change.",
      date: "2024-11-01",
    },
    {
      content: "Making a difference, one school at a time. Proud to support this.",
      date: "2024-11-01",
    },
    {
      content: "An excellent project – supporting education in rural areas is so important!",
      date: "2024-11-01",
    },
    {
      content: "Such a thoughtful approach to building strong, self-sustaining communities.",
      date: "2024-11-01",
    },
  ];
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (newPost.trim() === '' && attachments.length === 0) return;

    setIsSubmitting(true);

    try {
      const post = {
        id: Math.random().toString(36).substr(2, 9),
        userId,
        milestoneId,
        content: newPost,
        attachments: attachments,
        date: new Date().toISOString(),
        votes: 0,
        replies: [],
      };

      setPosts([post, ...posts]);
      setNewPost('');
      setAttachments([]);
    } catch (error) {
      console.error('Error submitting post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (reply, parentId) => {
    setPosts(posts.map(post => {
      if (post.id === parentId) {
        return {
          ...post,
          replies: [...(post.replies || []), reply]
        };
      }
      return post;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="flex gap-2 mb-6">
          {['Hot', 'New', 'Top'].map((sort) => (
            <button
              key={sort.toLowerCase()}
              onClick={() => setSortBy(sort.toLowerCase())}
              className={`px-4 py-2 rounded-lg text-base ${
                sortBy === sort.toLowerCase()
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {sort}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {comments.map((post, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <Comment comment={post} onReply={handleReply} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <form onSubmit={handlePostSubmit} className="space-y-4">
          <textarea
            placeholder="Create a post"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg text-base"
            rows={4}
            disabled={isSubmitting}
          />
          
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <Plus size={28} />
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg text-base hover:bg-blue-600 transition-colors"
              disabled={isSubmitting}
            >
              Post
            </button>
          </div>
          
          <input
            type="file"
            onChange={(e) => {
              // Handle file upload
            }}
            className="hidden"
            ref={fileInputRef}
            multiple
          />
        </form>
      </div>
    </div>
  );
};

export default Posts;