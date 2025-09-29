'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebaseConfig';
import { ImagePlus, Loader2 } from 'lucide-react';

const CreateNewsPage = () => {
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() || !imageUrl.trim()) {
      setError('Caption and Image URL are required.');
      return;
    }
    
    setError(null);
    setLoading(true);

    try {
      const newsCollectionRef = collection(db, 'newsAndEvents');
      await addDoc(newsCollectionRef, {
        caption: caption,
        postImage: imageUrl,
        profileName: 'Department of English, NUB', // ডিফল্ট প্রোফাইল নাম
        profileImage: 'https://scontent.fdac99-1.fna.fbcdn.net/v/t39.30808-6/503380562_122207281592129146_4254790902127134274_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeF9UABAq8JEwy6CMGYYSEmZvbG_wq8PRV29sb_Crw9FXZKlHxVy0qWKakH1nXNKE2aolNLUBYjKXXCKDNUD1zDg&_nc_ohc=gakhHA4KijwQ7kNvwEM88Dy&_nc_oc=AdkiY7KraoQkW2gz5U_lIgBSH6eeNlP59d2Eo7Zmd-kKviwEJLZFIMZGv8s5KV1Su1HAFQTSSc24O810N9BKQ_vG&_nc_zt=23&_nc_ht=scontent.fdac99-1.fna&_nc_gid=k34Ffu_gWdkH9lsKwUA63w&oh=00_AfbIDrwcih0MUEddTjYNZScfldhfdrp5YRPI0h8VJjq6sA&oe=68DE100B', // ডিফল্ট প্রোফাইল ছবি
        likes: 0,
        comments: 0,
        shares: 0,
        createdAt: serverTimestamp(), // পোস্ট তৈরির সময়
      });
      
      // সফলভাবে পোস্ট হলে "All News & Events" পেজে পাঠিয়ে দেওয়া হবে
      router.push('/dashboard/news');

    } catch (err) {
      console.error("Error creating post:", err);
      setError('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create a New Post</h2>
      <form onSubmit={handleCreatePost}>
        <div className="space-y-6">
          {/* Caption Input */}
          <div>
            <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
              Caption
            </label>
            <textarea
              id="caption"
              rows={6}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-3 text-gray-700 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-200 transition"
            />
          </div>

          {/* Image URL Input */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full p-3 text-gray-700 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-200 transition"
            />
          </div>
          
          {/* Image Preview */}
          {imageUrl && (
             <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                <div className="w-full h-64 relative rounded-lg overflow-hidden border border-gray-200">
                     <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                     <div className="absolute inset-0 flex items-center justify-center bg-gray-100 -z-10">
                        <ImagePlus className="text-gray-400" size={48}/>
                     </div>
                </div>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center px-6 py-3 font-bold text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none disabled:bg-purple-400 transition-colors"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNewsPage;
