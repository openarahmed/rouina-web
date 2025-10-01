'use client';

import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../lib/firebaseConfig';
import { collection, onSnapshot, query, orderBy, Timestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { MoreVertical, Edit, Trash2, Heart, MessageCircle, X, AlertTriangle } from 'lucide-react';
// ★★★ নতুন: Toast নোটিফিকেশনের জন্য ইম্পোর্ট ★★★
import toast, { Toaster } from 'react-hot-toast';


// Post এর জন্য টাইপ
interface Post {
  id: string;
  caption: string;
  postImage: string;
  createdAt: Timestamp;
  likes: number;
  comments: number;
}

// PostCard কম্পোনেন্ট (অপরিবর্তিত)
const PostCard = ({ post, onDelete, onEdit }: { post: Post, onDelete: (id: string) => void, onEdit: (post: Post) => void }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-100 flex flex-col transition-shadow hover:shadow-xl">
            <div className="relative w-full h-48">
                <img 
                    src={post.postImage || 'https://placehold.co/600x400/E9D5FF/3730a3?text=No+Image'} 
                    alt="Post image" 
                    className="w-full h-full object-cover bg-gray-100"
                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/E9D5FF/3730a3?text=Error'; }}
                />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex-grow">
                     <p className="text-gray-700 leading-relaxed text-sm mb-3">
                        {post.caption.length > 100 ? `${post.caption.substring(0, 100)}...` : post.caption}
                    </p>
                    <p className="text-xs text-gray-400 mb-4">
                        Posted on: {post.createdAt ? post.createdAt.toDate().toLocaleDateString() : 'N/A'}
                    </p>
                </div>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Heart size={16} className="text-red-500"/>
                            <span>{post.likes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <MessageCircle size={16} className="text-blue-500"/>
                            <span>{post.comments || 0}</span>
                        </div>
                    </div>
                    <div className="relative" ref={menuRef}>
                        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-gray-500 rounded-full hover:bg-gray-100">
                            <MoreVertical size={18}/>
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                <button onClick={() => { onEdit(post); setMenuOpen(false); }} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <Edit size={14}/> Edit
                                </button>
                                <button onClick={() => { onDelete(post.id); setMenuOpen(false); }} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                    <Trash2 size={14}/> Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Edit Modal কম্পোনেন্ট (অপরিবর্তিত)
const EditPostModal = ({ post, isOpen, onClose, onSave }: { post: Post | null, isOpen: boolean, onClose: () => void, onSave: (id: string, data: { caption: string, postImage: string }) => void }) => {
    const [caption, setCaption] = useState('');
    const [postImage, setPostImage] = useState('');

    useEffect(() => { if (post) { setCaption(post.caption); setPostImage(post.postImage); } }, [post]);

    if (!isOpen) return null;

    const handleSave = () => { if (post) { onSave(post.id, { caption, postImage }); } };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800">Edit Post</h3>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"><X size={24}/></button>
                </div>
                <div className="space-y-6 pt-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                        <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={5} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-purple-500 focus:border-purple-500 transition-colors" placeholder="Write your caption here..."/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input type="text" value={postImage} onChange={(e) => setPostImage(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-purple-500 focus:border-purple-500 transition-colors" placeholder="https://example.com/image.jpg"/>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-200">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="px-5 py-2.5 text-sm font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-sm transition-colors">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

// ★★★ নতুন: Confirmation Modal Component ★★★
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, title: string, message: string }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md transform animate-scale-in">
                <div className="flex items-start">
                    <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="ml-4 text-left">
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">{message}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button>
                    <button onClick={onConfirm} className="px-5 py-2.5 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm">Delete</button>
                </div>
            </div>
        </div>
    );
};


const AllNewsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  // ★★★ নতুন: Confirmation Modal এর জন্য State ★★★
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  useEffect(() => {
    const newsCollectionRef = collection(db, 'newsAndEvents');
    const q = query(newsCollectionRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allPosts: Post[] = [];
      querySnapshot.forEach((doc) => { allPosts.push({ id: doc.id, ...doc.data() } as Post); });
      setPosts(allPosts);
      setLoading(false);
    }, (error) => { console.error("Error fetching posts: ", error); setLoading(false); });
    return () => unsubscribe();
  }, []);

  // ★★★ পরিবর্তন: এখন শুধু মোডাল খোলা হবে ★★★
  const handleDeletePost = (id: string) => {
      setPostToDelete(id);
      setConfirmModalOpen(true);
  };

  // ★★★ নতুন: মোডাল থেকে ডিলিট নিশ্চিত করার ফাংশন ★★★
  const confirmDelete = async () => {
    if (postToDelete) {
        try {
            await deleteDoc(doc(db, "newsAndEvents", postToDelete));
            toast.success("Post deleted successfully!");
        } catch (error) {
            console.error("Error deleting post: ", error);
            toast.error("Failed to delete post.");
        } finally {
            setConfirmModalOpen(false);
            setPostToDelete(null);
        }
    }
  };

  const handleEditPost = (post: Post) => {
      setEditingPost(post);
      setEditModalOpen(true);
  };
  
  // ★★★ পরিবর্তন: alert এর পরিবর্তে toast ব্যবহার করা হয়েছে ★★★
  const handleUpdatePost = async (id: string, data: { caption: string, postImage: string }) => {
      const postRef = doc(db, "newsAndEvents", id);
      try {
          await updateDoc(postRef, data);
          toast.success("Post updated successfully!");
          setEditModalOpen(false);
          setEditingPost(null);
      } catch (error) {
          console.error("Error updating post: ", error);
          toast.error("Failed to update post.");
      }
  };

  return (
    <>
      {/* ★★★ নতুন: Toast নোটিফিকেশন দেখানোর জন্য Toaster কম্পোনেন্ট ★★★ */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">All News & Events</h2>
        
        {loading ? ( <p className="text-center text-gray-500 py-10">Loading posts...</p> ) 
        : posts.length === 0 ? ( <p className="text-center text-gray-500 py-10">No posts found.</p> ) 
        : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map(post => (
              <PostCard key={post.id} post={post} onDelete={handleDeletePost} onEdit={handleEditPost} />
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
      `}</style>

      <EditPostModal isOpen={isEditModalOpen} post={editingPost} onClose={() => setEditModalOpen(false)} onSave={handleUpdatePost} />
      
      {/* ★★★ নতুন: Confirmation Modal রেন্ডার করা হচ্ছে ★★★ */}
      <ConfirmationModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action is permanent and cannot be undone."
      />
    </>
  );
};

export default AllNewsPage;

