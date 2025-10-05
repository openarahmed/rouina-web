// app/(dashboard)/blog/create/page.tsx

'use client';

import React, { useState } from 'react';
import { db } from '../../../lib/firebaseConfig'; // Adjust path if needed
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { FileText, Loader2 } from 'lucide-react';

const CreateBlogPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [slug, setSlug] = useState('');
    // ★★★ 1. Add state for the image URL ★★★
    const [imageUrl, setImageUrl] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        const newSlug = newTitle
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
        setSlug(newSlug);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content || !slug) {
            setError('Please fill in title, slug, and content.');
            return;
        }
        setIsSubmitting(true);
        setError(null);

        try {
            // ★★★ 3. Add the imageUrl to the data being saved ★★★
            await addDoc(collection(db, 'blogPosts'), {
                title: title,
                slug: slug,
                imageUrl: imageUrl, // The new image URL field
                content: content,
                authorName: "Routina Admin",
                isPublished: true,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            router.push('/dashboard');
            
        } catch (err) {
            console.error("Error creating post: ", err);
            setError("Failed to create post. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#4c0e4c]">Create New Blog Post</h1>
                <p className="text-slate-500 mt-1">Write and publish new content for your users.</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                            Post Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="e.g., 5 Tips for Your Next Job Interview"
                            className="block w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D46C1]"
                        />
                    </div>

                    <div>
                        <label htmlFor="slug" className="block text-sm font-medium text-slate-700 mb-1">
                            URL Slug
                        </label>
                        <input
                            type="text"
                            id="slug"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="e.g., 5-tips-for-job-interview"
                            className="block w-full p-3 border border-slate-300 rounded-md bg-slate-50 text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#6D46C1]"
                        />
                         <p className="text-xs text-slate-400 mt-1">This will be the link to your post: yoursite.com/blog/{slug}</p>
                    </div>

                    {/* ★★★ 2. Add the new input field for the Image URL ★★★ */}
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700 mb-1">
                            Featured Image URL
                        </label>
                        <input
                            type="url"
                            id="imageUrl"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://example.com/your-image.png"
                            className="block w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D46C1]"
                        />
                         <p className="text-xs text-slate-400 mt-1">Paste the link to your post's main image here.</p>
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1">
                            Content
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={15}
                            placeholder="Write your blog post here. You can use Markdown for formatting."
                            className="block w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D46C1] font-mono"
                        />
                    </div>
                    
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-[#6D46C1] rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-sm disabled:bg-gray-400"
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSubmitting ? 'Publishing...' : 'Publish Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBlogPage;