import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, PlusCircle, X } from 'lucide-react';

const Posts = ({ milestoneId, userId, initialPosts }) => {
  const [posts, setPosts] = useState(initialPosts || [])
  const [newPost, setNewPost] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);


  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (newPost.trim() === '' && attachments.length === 0) return;
  
    setIsSubmitting(true);
  
    try {
      const base64Attachments = await Promise.all(
        attachments.map(async (attachment) => {
          const file = attachment.file;
          const reader = new FileReader();
  
          return new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );
  
      const post = {
        userId,
        milestoneId,
        content: newPost,
        attachments: base64Attachments,
      };
  
      // Submit the post to the backend API
      const response = await fetch('/api/submitComment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),  // Send as JSON
      });
  
  
      const result = await response.json();
      console.log('Comment submitted:', result);
  
      // Fix this later
      // setPosts([{ content: newPost, attachments: attachments.map(a => a.src), date: new Date().toISOString(), likes: 0, comments: 0 }, ...posts]);
      setNewPost('');
      setAttachments([]);
    } catch (error) {
      console.error('Error submitting post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map((file) => ({
      type: file.type.startsWith('image/') ? 'image' : 'video',
      src: URL.createObjectURL(file),
      file,
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Milestone Updates</h3>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4">Create a new post</h4>
        <form onSubmit={handlePostSubmit} className="space-y-4">
          <textarea
            placeholder="Share an update..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={4}
            disabled={isSubmitting}
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
                  <video src={attachment.src} className="w-24 h-24 rounded-md object-cover" />
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
              disabled={isSubmitting}
            >
              <PlusCircle className="w-4 h-4 inline mr-2" />
              Add Images/Videos
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Post Update'}
            </button>
          </div>
        </form>
      </div>

      {posts && posts.map((post) => (
        <div key={post.id} className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-white">{post.author[0] ? post.author[0] : "0"}</span>
            </div>
            <div>
              <h4 className="font-semibold">{post.author}</h4>
              <p className="text-sm text-gray-500">{post.date}</p>
            </div>
          </div>
          <p className="mb-4">{post.content}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.attachments.map((attachment, index) => (
              <div key={index} className="cursor-pointer">
                {/* {attachment.type !== 'image' ? ( */}
                  <Image src={attachment} alt={`Attachment ${index}`} width={200} height={150} className="rounded-lg object-cover" />
                {/* ) : ( */}
                  {/* <video src={attachment} className="w-48 h-36 rounded-lg object-cover" /> */}
                {/* )} */}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;
