'use client';

import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../lib/firebaseConfig';
import { collection, onSnapshot, query, orderBy, Timestamp, doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { MoreVertical, Edit, Trash2, X, AlertTriangle, FileText, Image as ImageIcon } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    imageUrl: string;
    isPublished: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

type BlogPostFormData = Partial<Omit<BlogPost, 'createdAt' | 'updatedAt'>>;

const BlogPostCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col animate-pulse">
        <div className="w-full h-32 bg-slate-200 rounded-lg"></div>
        <div className="space-y-3 flex-grow mt-4">
            <div className="h-5 bg-slate-200 rounded w-3/4"></div>
            <div className="space-y-2 pt-2">
                <div className="h-3 bg-slate-200 rounded w-full"></div>
                <div className="h-3 bg-slate-200 rounded w-5/6"></div>
            </div>
        </div>
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
        </div>
    </div>
);

const BlogPostCard = ({ post, onDelete, onEdit }: { post: BlogPost, onDelete: (id: string) => void, onEdit: (post: BlogPost) => void }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(event.target as Node)) { setMenuOpen(false); } };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col transition-shadow hover:shadow-lg overflow-hidden">
            {post.imageUrl ? (
                <Image src={post.imageUrl} alt={post.title} width={400} height={200} className="w-full h-32 object-cover" />
            ) : (
                <div className="w-full h-32 bg-slate-100 flex items-center justify-center text-slate-400">
                    <ImageIcon size={32} />
                </div>
            )}
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-[#4c0e4c] line-clamp-2">{post.title}</h3>
                        <div className="relative" ref={menuRef}>
                            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-slate-500 rounded-full hover:bg-slate-100 transition-colors flex-shrink-0"><MoreVertical size={18}/></button>
                            {menuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-xl shadow-xl border border-slate-200 z-10">
                                    <button onClick={() => { onEdit(post); setMenuOpen(false); }} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-[#6D46C1] transition-colors rounded-t-xl"><Edit size={14}/> Edit</button>
                                    <button onClick={() => { onDelete(post.id); setMenuOpen(false); }} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 transition-colors rounded-b-xl"><Trash2 size={14}/> Delete</button>
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="text-slate-600 text-sm mt-2 line-clamp-3">{post.content}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-sm">
                        <p className="text-xs text-slate-400">
                            Posted: {post.createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) ?? 'N/A'}
                        </p>
                        <p className={`font-semibold px-2 py-1 rounded-full text-xs ${post.isPublished ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                            {post.isPublished ? 'Published' : 'Draft'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const EditPostModal = ({ post, isOpen, onClose, onSave }: { post: BlogPost | null, isOpen: boolean, onClose: () => void, onSave: (id: string, data: BlogPostFormData) => void }) => {
    const [formData, setFormData] = useState<BlogPostFormData>({});
    
    useEffect(() => {
        if (post) { setFormData({ ...post }); }
    }, [post]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSave = () => {
        if (post) {
            onSave(post.id, formData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <h3 className="text-xl font-semibold text-[#4c0e4c]">Edit Blog Post</h3>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"><X size={20}/></button>
                </div>
                <div className="space-y-6 pt-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">Post Title</label>
                        <input id="title" type="text" value={formData.title || ''} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md"/>
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700 mb-2">Featured Image URL</label>
                        <input id="imageUrl" type="url" value={formData.imageUrl || ''} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md"/>
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-2">Content</label>
                        <textarea id="content" rows={10} value={formData.content || ''} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md"/>
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

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, title: string, message: string }) => { if (!isOpen) return null; return ( <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50 p-4"> <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md animate-scale-in"> <div className="flex items-start"> <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"> <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" /> </div> <div className="ml-4 text-left"> <h3 className="text-lg font-bold text-[#4c0e4c]">{title}</h3> <div className="mt-2"> <p className="text-sm text-slate-500">{message}</p> </div> </div> </div> <div className="mt-6 flex justify-end gap-4"> <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">Cancel</button> <button onClick={onConfirm} className="px-5 py-2.5 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm transition-colors">Delete</button> </div> </div> </div> ); };

const AllBlogPostsPage = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);

    useEffect(() => {
        const postsCollectionRef = collection(db, 'blogPosts');
        const q = query(postsCollectionRef, orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const allPosts: BlogPost[] = [];
            querySnapshot.forEach((doc) => { allPosts.push({ id: doc.id, ...doc.data() } as BlogPost); });
            setPosts(allPosts);
            setLoading(false);
        }, 
        // ★★★ This is the important fix ★★★
        // Now it will log the actual error to the console instead of failing silently.
        (error) => { 
            console.error("Error fetching blog posts:", error);
            setLoading(false); 
        });
        return () => unsubscribe();
    }, []);

    const handleDeletePost = (id: string) => { setPostToDelete(id); setConfirmModalOpen(true); };
    const confirmDelete = async () => {
        if (postToDelete) {
            const toastId = toast.loading('Deleting post...');
            try {
                await deleteDoc(doc(db, "blogPosts", postToDelete));
                toast.success("Post deleted successfully!", { id: toastId });
            } catch {
                toast.error("Failed to delete post.", { id: toastId });
            } finally {
                setConfirmModalOpen(false);
                setPostToDelete(null);
            }
        }
    };

    const handleEditPost = (post: BlogPost) => { setEditingPost(post); setEditModalOpen(true); };
    const handleUpdatePost = async (id: string, data: BlogPostFormData) => {
        const postRef = doc(db, "blogPosts", id);
        const dataToUpdate = { ...data, updatedAt: serverTimestamp() };
        const toastId = toast.loading('Updating post...');
        try {
            await updateDoc(postRef, dataToUpdate);
            toast.success("Post updated successfully!", { id: toastId });
            setEditModalOpen(false);
            setEditingPost(null);
        } catch {
            toast.error("Failed to update post.", { id: toastId });
        }
    };

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <div className="w-full">
                <div className="mb-8"><h1 className="text-3xl font-bold text-[#4c0e4c]">All Blog Posts</h1><p className="text-slate-500 mt-1">Manage all your published articles.</p></div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    {loading ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(3)].map((_, i) => <BlogPostCardSkeleton key={i} />)}</div>) 
                    : posts.length === 0 ? (<div className="text-center py-16"><FileText size={48} className="mx-auto text-slate-300" /><h3 className="mt-4 text-lg font-semibold text-slate-700">No Blog Posts Yet</h3><p className="mt-1 text-slate-500">Create a new post to get started.</p></div>) 
                    : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{posts.map(post => (<BlogPostCard key={post.id} post={post} onDelete={handleDeletePost} onEdit={handleEditPost} />))}</div>)}
                </div>
            </div>
            <EditPostModal isOpen={isEditModalOpen} post={editingPost} onClose={() => setEditModalOpen(false)} onSave={handleUpdatePost} />
            <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setConfirmModalOpen(false)} onConfirm={confirmDelete} title="Delete Post" message="Are you sure you want to delete this blog post? This action cannot be undone."/>
        </>
    );
};

export default AllBlogPostsPage;