'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebaseConfig';
import { ImagePlus, Loader2, AlertTriangle } from 'lucide-react'; // Added AlertTriangle for errors

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
        profileName: 'Department of English, NUB', // Default profile name
        profileImage: 'https://scontent.fdac99-1.fna.fbcdn.net/v/t39.30808-6/503380562_122207281592129146_4254790902127134274_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeF9UABAq8JEwy6CMGYYSEmZvbG_wq8PRV29sb_Crw9FXZKlHxVy0qWKakH1nXNKE2aolNLUBYjKXXCKDNUD1zDg&_nc_ohc=gakhHA4KijwQ7kNvwEM88Dy&_nc_oc=AdkiY7KraoQkW2gz5U_lIgBSH6eeNlP59d2Eo7Zmd-kKviwEJLZFIMZGv8s5KV1Su1HAFQTSSc24O810N9BKQ_vG&_nc_zt=23&_nc_ht=scontent.fdac99-1.fna&_nc_gid=k34Ffu_gWdkH9lsKwUA63w&oh=00_AfbIDrwcih0MUEddTjYNZScfldhfdrp5YRPI0h8VJjq6sA&oe=68DE100B', // Default profile image
        likes: 0,
        comments: 0,
        shares: 0,
        createdAt: serverTimestamp(),
      });
      
      router.push('/dashboard/news');

    } catch (err) {
      console.error("Error creating post:", err);
      setError('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // ★★★ PAGE LAYOUT UPDATE: Consistent header and card style ★★★
    <div className="w-full">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#4c0e4c]">Create News Post</h1>
            <p className="text-slate-500 mt-1">Compose and publish new content for news and events.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <form onSubmit={handleCreatePost}>
            <div className="space-y-6">
              
              {/* Caption Input */}
              <div>
                <label htmlFor="caption" className="block text-sm font-medium text-slate-700 mb-2">
                  Caption
                </label>
                <textarea
                  id="caption"
                  rows={6}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="What's on your mind?"
                  // ★★★ STYLE UPDATE: Branded focus ring and consistent colors ★★★
                  className="w-full p-3 text-slate-800 bg-slate-50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D46C1] border border-slate-200 transition"
                />
              </div>

              {/* Image URL Input */}
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700 mb-2">
                  Image URL
                </label>
                <input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-3 text-slate-800 bg-slate-50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D46C1] border border-slate-200 transition"
                />
              </div>
              
              {/* Image Preview */}
              {imageUrl && (
                 <div className="mt-4">
                   <p className="text-sm font-medium text-slate-700 mb-2">Image Preview:</p>
                   <div className="w-full h-64 relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                       <img 
                         src={imageUrl} 
                         alt="Preview" 
                         className="w-full h-full object-cover" 
                         // This onError logic is great for handling bad URLs
                         onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/600x400/f1f5f9/cbd5e1?text=Invalid+Image';
                            e.currentTarget.classList.add('object-contain');
                         }}
                       />
                   </div>
               </div>
              )}

              {/* ★★★ UX UPDATE: Enhanced error message display ★★★ */}
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{error}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                // ★★★ STYLE UPDATE: Branded button with consistent states ★★★
                className="flex items-center justify-center px-6 py-3 font-semibold text-white bg-[#6D46C1] rounded-md hover:bg-[#5e3bad] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D46C1] disabled:bg-[#6D46C1]/50 disabled:cursor-not-allowed transition-colors"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Publishing...' : 'Publish Post'}
              </button>
            </div>
          </form>
        </div>
    </div>
  );
};

export default CreateNewsPage;