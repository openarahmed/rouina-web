'use client';

import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../lib/firebaseConfig';
import { collection, onSnapshot, query, orderBy, Timestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';
// ★★★ FIX: Imported Next.js Image component ★★★
import Image from 'next/image';
import { MoreVertical, Edit, Trash2, Heart, MessageCircle, X, AlertTriangle, Newspaper } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// --- Type Definitions ---
interface Post {
    id: string;
    caption: string;
    postImage: string;
    createdAt?: Timestamp; // Optional for data safety
    likes: number;
    comments: number;
}

// Skeleton loader for Post Cards
const PostCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col animate-pulse">
        <div className="relative w-full h-48 bg-slate-200"></div>
        <div className="p-4 flex flex-col flex-grow">
            <div className="flex-grow space-y-3">
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                <div className="h-3 bg-slate-200 rounded w-1/3 mt-2"></div>
            </div>
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="h-5 bg-slate-200 rounded w-10"></div>
                    <div className="h-5 bg-slate-200 rounded w-10"></div>
                </div>
                <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
            </div>
        </div>
    </div>
);

// --- Reusable Components (Restyled) ---

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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col transition-shadow hover:shadow-lg">
            <div className="relative w-full h-48 rounded-t-xl overflow-hidden">
                {/* ★★★ FIX: Replaced <img> with Next.js <Image> component ★★★ */}
                <Image
                    src={post.postImage || 'https://placehold.co/600x400/f1f5f9/cbd5e1?text=No+Image'}
                    alt="Post image"
                    layout="fill"
                    className="object-cover bg-slate-100"
                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/f1f5f9/cbd5e1?text=Error'; }}
                />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex-grow">
                    <p className="text-slate-700 leading-relaxed text-sm mb-3 line-clamp-2">
                        {post.caption}
                    </p>
                    <p className="text-xs text-slate-400 mb-4">
                        Posted on: {post.createdAt?.toDate().toLocaleDateString() ?? 'N/A'}
                    </p>
                </div>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                            <Heart size={16} className="text-red-500"/>
                            <span>{post.likes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                            <MessageCircle size={16} className="text-sky-500"/>
                            <span>{post.comments || 0}</span>
                        </div>
                    </div>
                    <div className="relative" ref={menuRef}>
                        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-slate-500 rounded-full hover:bg-slate-100 transition-colors">
                            <MoreVertical size={18}/>
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 bottom-full mb-2 w-36 bg-white rounded-xl shadow-xl border border-slate-200 z-10">
                                <button onClick={() => { onEdit(post); setMenuOpen(false); }} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-[#6D46C1] transition-colors rounded-t-xl">
                                    <Edit size={14}/> Edit
                                </button>
                                <button onClick={() => { onDelete(post.id); setMenuOpen(false); }} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 transition-colors rounded-b-xl">
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

// --- Modals and Main Page Component (No changes below) ---

const EditPostModal = ({ post, isOpen, onClose, onSave }: { post: Post | null, isOpen: boolean, onClose: () => void, onSave: (id: string, data: { caption: string, postImage: string }) => void }) => {
    const [caption, setCaption] = useState('');
    const [postImage, setPostImage] = useState('');

    useEffect(() => { if (post) { setCaption(post.caption); setPostImage(post.postImage); } }, [post]);
    if (!isOpen) return null;
    const handleSave = () => { if (post) { onSave(post.id, { caption, postImage }); } };

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-lg animate-scale-in">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <h3 className="text-xl font-semibold text-[#4c0e4c]">Edit Post</h3>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"><X size={20}/></button>
                </div>
                <div className="space-y-6 pt-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Caption</label>
                        <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={5} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#6D46C1] focus:border-[#6D46C1] transition" placeholder="Write your caption here..."/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                        <input type="text" value={postImage} onChange={(e) => setPostImage(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#6D46C1] focus:border-[#6D46C1] transition" placeholder="https://example.com/image.jpg"/>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-slate-200">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="px-5 py-2.5 text-sm font-semibold bg-[#6D46C1] text-white rounded-lg hover:bg-[#5e3bad] shadow-sm transition-colors">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, title: string, message: string }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md animate-scale-in">
                <div className="flex items-start">
                    <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="ml-4 text-left">
                        <h3 className="text-lg font-bold text-[#4c0e4c]">{title}</h3>
                        <div className="mt-2">
                            <p className="text-sm text-slate-500">{message}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="px-5 py-2.5 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm transition-colors">Delete</button>
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

    const handleDeletePost = (id: string) => {
        setPostToDelete(id);
        setConfirmModalOpen(true);
    };

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
            <Toaster position="top-right" reverseOrder={false} />

                <div className="w-full">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[#4c0e4c]">All News & Events</h1>
                        <p className="text-slate-500 mt-1">Manage all published posts.</p>
                    </div>

                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {[...Array(4)].map((_, i) => <PostCardSkeleton key={i} />)}
                            </div>
                        ) 
                        : posts.length === 0 ? (
                            <div className="text-center py-16">
                                <Newspaper size={48} className="mx-auto text-slate-300" />
                                <h3 className="mt-4 text-lg font-semibold text-slate-700">No Posts Yet</h3>
                                <p className="mt-1 text-slate-500">Create a new post to get started.</p>
                            </div>
                        ) 
                        : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {posts.map(post => (
                                    <PostCard key={post.id} post={post} onDelete={handleDeletePost} onEdit={handleEditPost} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            <EditPostModal isOpen={isEditModalOpen} post={editingPost} onClose={() => setEditModalOpen(false)} onSave={handleUpdatePost} />
            
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
