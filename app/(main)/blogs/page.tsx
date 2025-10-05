'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebaseConfig';
import { collection, query, where, onSnapshot, Timestamp, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import { ImageIcon, ArrowRight } from 'lucide-react';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    imageUrl: string;
    createdAt: string;
}

const BlogPage = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const postsCollectionRef = collection(db, 'blogPosts');
        const q = query(
            postsCollectionRef, 
            where('isPublished', '==', true), 
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const allPosts = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
                } as BlogPost;
            });
            setPosts(allPosts);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const featuredPost = posts[0];
    // ★★★ FIX: Changed from slice(1, 5) to slice(1) to get ALL other posts ★★★
    const otherPosts = posts.slice(1); 

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
        });
    };

    return (
        <section className="bg-[#0D0915] text-white py-20 sm:py-28">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {loading ? (
                        <div className="text-center text-lg">Loading posts...</div>
                    ) : posts.length === 0 ? (
                        <div className="text-center text-lg">No posts found yet. Check back soon!</div>
                    ) : (
                        <div className="space-y-16">
                            
                            {featuredPost && (
                                <div className="flex flex-col md:flex-row items-center gap-8 group">
                                    <div className="w-full md:w-1/2">
                                        <Link href={`/blogs/${featuredPost.slug}`}>
                                            {featuredPost.imageUrl ? (
                                                <Image
                                                    src={featuredPost.imageUrl}
                                                    alt={featuredPost.title}
                                                    width={400} height={400}
                                                    className="w-[600px] h-auto object-cover rounded-xl aspect-[4/3] transition-transform duration-300 hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-auto aspect-[4/3] bg-[#2E284D] flex items-center justify-center rounded-xl">
                                                    <ImageIcon className="h-16 w-16 text-slate-500" />
                                                </div>
                                            )}
                                        </Link>
                                    </div>
                                    <div className="w-full md:w-1/2 flex flex-col items-start">
                                        <p className="text-sm text-slate-400 mb-2">{formatDate(featuredPost.createdAt)} • Blog</p>
                                        <h2 className="text-3xl lg:text-4xl font-bold text-[#F3F4F6] mb-4 leading-tight text-left">
                                            <Link href={`/blogs/${featuredPost.slug}`} className="hover:text-[#8B5CF6] transition-colors">{featuredPost.title}</Link>
                                        </h2>
                                        <p className="text-[#9CA3AF] text-base line-clamp-3 mb-6 text-left">
                                            {featuredPost.content}
                                        </p>
                                        <Link href={`/blogs/${featuredPost.slug}`} className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white bg-[#6D46C1] rounded-full hover:bg-purple-700 transition-all duration-300">
                                            Continue Reading <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {otherPosts.map((post) => (
                                    <div key={post.id} className="group">
                                        <Link href={`/blogs/${post.slug}`} className="block mb-4">
                                            {post.imageUrl ? (
                                                <Image
                                                    src={post.imageUrl}
                                                    alt={post.title}
                                                    width={400} height={400}
                                                    className="w-full h-auto aspect-square object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-auto aspect-square bg-[#2E284D] flex items-center justify-center rounded-xl">
                                                    <ImageIcon className="h-12 w-12 text-slate-500" />
                                                </div>
                                            )}
                                        </Link>
                                        <h3 className="text-xl font-bold text-[#F3F4F6] mb-2 line-clamp-2">
                                            <Link href={`/blogs/${post.slug}`} className="hover:text-[#8B5CF6] transition-colors">{post.title}</Link>
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            {formatDate(post.createdAt)} • Blog
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default BlogPage;