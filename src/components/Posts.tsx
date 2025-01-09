import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, PlusCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';

const mockPosts = [
  {
    id: 1,
    author: 'John Smith',
    content: 'We just reached our first milestone! Thank you to all our supporters.',
    attachments: [
      { type: 'image', src: '/api/placeholder/640/480' },
      { type: 'image', src: '/api/placeholder/640/481' }
    ],
    likes: 15,
    likedBy: [], // Add this to keep track of who liked the post
    comments: 3,
    date: '2023-09-20'
  },
  {
    id: 2,
    author: 'John Smith',
    content: 'Here\'s a video update on our progress.',
    attachments: [
      { type: 'video', src: 'https://example.com/video.mp4' },
      { type: 'image', src: '/api/placeholder/640/482' }
    ],
    likes: 8,
    likedBy: [], // Add this to keep track of who liked the post
    comments: 1,
    date: '2023-09-18'
  }
];

const FullScreenModal = ({ attachments, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') handlePrev();
      if (event.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : attachments.length - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex < attachments.length - 1 ? prevIndex + 1 : 0
    );
  };

  const currentAttachment = attachments[currentIndex];

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likedBy.includes(currentUserId);
        return {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1,
          likedBy: isLiked
            ? post.likedBy.filter(id => id !== currentUserId)
            : [...post.likedBy, currentUserId]
        };
      }
      return post;
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative w-full h-full flex items-center justify-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300"
        >
          <X size={24} />
        </button>
        <button
          onClick={handlePrev}
          className="absolute left-4 text-white hover:text-gray-300"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 text-white hover:text-gray-300"
        >
          <ChevronRight size={24} />
        </button>
        {currentAttachment.type === 'image' ? (
          <Image
            src={currentAttachment.src}
            alt="Full-screen attachment"
            layout="fill"
            objectFit="contain"
          />
        ) : (
          <video src={currentAttachment.src} controls className="max-w-full max-h-full" />
        )}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
          {currentIndex + 1} / {attachments.length}
        </div>
      </div>
    </div>
  );
};

const Posts = () => {
  const [posts, setPosts] = useState(mockPosts);
  const [newPost, setNewPost] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [fullScreenAttachments, setFullScreenAttachments] = useState(null);
  const fileInputRef = useRef(null);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim() === '' && attachments.length === 0) return;

    const newPostObj = {
      id: posts.length + 1,
      author: 'John Smith',
      content: newPost,
      attachments: attachments,
      likes: 0,
      comments: 0,
      date: new Date().toISOString().split('T')[0]
    };

    setPosts([newPostObj, ...posts]);
    setNewPost('');
    setAttachments([]);
  };

  const handleAttachmentClick = (postAttachments, index) => {
    setFullScreenAttachments({ attachments: postAttachments, initialIndex: index });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      type: file.type.startsWith('image/') ? 'image' : 'video',
      src: URL.createObjectURL(file),
      file
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Updates</h2>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Create a new post</h3>
        <form onSubmit={handlePostSubmit} className="space-y-4">
          <textarea
            placeholder="Share an update..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={4}
          />
          <div className="flex flex-wrap gap-2 mb-2">
            {attachments.map((attachment, index) => (
              <div key={index} className="relative">
                {attachment.type === 'image' ? (
                  <Image
                    src={attachment.src}
                    alt={`Preview ${index}`}
                    width={100}
                    height={100}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <video
                    src={attachment.src}
                    className="w-24 h-24 rounded-md object-cover"
                  />
                )}
                <button
                  onClick={() => removeAttachment(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="attachment"
              accept="image/*,video/*"
              multiple
              ref={fileInputRef}
            />
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              onClick={() => fileInputRef.current.click()}
            >
              <PlusCircle className="w-4 h-4 inline mr-2" />
              Add Images/Videos
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Post Update
            </button>
          </div>
        </form>
      </div>

      {posts.map((post) => (
        <div key={post.id} className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-white">{post.author[0]}</span>
            </div>
            <div>
              <h3 className="font-semibold">{post.author}</h3>
              <p className="text-sm text-gray-500">{post.date}</p>
            </div>
          </div>
          <p className="mb-4">{post.content}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.attachments.map((attachment, index) => (
              <div 
                key={index}
                className="cursor-pointer"
                onClick={() => handleAttachmentClick(post.attachments, index)}
              >
                {attachment.type === 'image' ? (
                  <Image 
                    src={attachment.src} 
                    alt={`Attachment ${index}`} 
                    width={200} 
                    height={150} 
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <video 
                    src={attachment.src} 
                    className="w-48 h-36 rounded-lg object-cover"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-gray-600 hover:text-blue-500">
              <Heart className="w-4 h-4 mr-2" />
              {post.likes} Likes
            </button>
            <button className="flex items-center text-gray-600 hover:text-blue-500">
              <MessageCircle className="w-4 h-4 mr-2" />
              {post.comments} Comments
            </button>
          </div>
        </div>
      ))}

      {fullScreenAttachments && (
        <FullScreenModal
          attachments={fullScreenAttachments.attachments}
          initialIndex={fullScreenAttachments.initialIndex}
          onClose={() => setFullScreenAttachments(null)}
        />
      )}
    </div>
  );
};

export default Posts;