'use client';

import Image from 'next/image';
import Link from 'next/link';
// import { Timestamp } from 'firebase/firestore'; // Eita ekhane dorkar nei, page.tsx e use kora hoyechilo
import { ArrowLeft, Twitter, Linkedin, Facebook } from 'lucide-react';
import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
} from 'react-share';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string; // Eita amader raw HTML string
    imageUrl: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
}

export default function BlogPostDisplay({ post, recentPosts }: { post: BlogPost, recentPosts: BlogPost[] }) {
    const postUrl = `https://your-site.com/blogs/${post.slug}`; // Change this to your actual site domain

    return (
        <section className="bg-[#0D0915] text-white">
            {/* ★★★ 1. Blog Post Header Section (Unchanged) ★★★ */}
            {post.imageUrl && (
                <div className="relative h-80 w-full pt-10">
                    {/* Background Image */}
                    <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Black Overlay */}
                    <div className="absolute inset-0 bg-black/80"></div>

                    {/* Centered Content */}
                    <div className="relative h-full flex flex-col items-center justify-center text-center p-4">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight max-w-4xl">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-slate-300">
                            <span>By {post.authorName}</span>
                            <span>•</span>
                            <span>
                                {new Date(post.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* ★★★ 2. Main Article Content starts below the header ★★★ */}
            <div className="py-12 sm:py-16">
                <div className="container mx-auto px-4">
                    {/* Return to Blog button (Optional, but useful) */}
                    <div className="max-w-3xl mx-auto mb-8">
                         <Link 
                            href="/blogs" 
                            className="inline-flex items-center text-slate-400 hover:text-[#8B5CF6] transition-colors"
                        >
                            <ArrowLeft size={16} className="mr-2" />
                            All Posts
                        </Link>
                    </div>

                    <article className="max-w-3xl mx-auto">
                        {/* If there's no image, the title will appear here instead */}
                        {!post.imageUrl && (
                             <div className="mb-8 text-center">
                                 <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F3F4F6] mb-4 leading-tight">
                                     {post.title}
                                 </h1>
                                 <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
                                     <span>By {post.authorName}</span>
                                     <span>•</span>
                                     <span>
                                         {new Date(post.createdAt).toLocaleDateString('en-US', {
                                             year: 'numeric', month: 'long', day: 'numeric'
                                         })}
                                     </span>
                                 </div>
                             </div>
                        )}

                        {/* ★★★ CRITICAL UPDATE: HTML Rendering with prose class ★★★ */}
                        <div 
                            className="prose prose-invert prose-lg lg:prose-xl max-w-none leading-relaxed" 
                            // 1. `whitespace-pre-wrap` remove kora holo. `prose` nijer typography manage kore.
                            // 2. `dangerouslySetInnerHTML` use kora holo jate HTML string ti shothikvabe render hoy.
                            dangerouslySetInnerHTML={{ __html: post.content }} 
                        />
                        {/* WARNING: Security er jonne, professional production e ekhane HTML Sanitization (e.g., DOMPurify diye) kora uchit. */}
                        

                        {/* Social Share Buttons (Unchanged) */}
                        <div className="mt-12 pt-8 border-t border-slate-700/50">
                            <div className="flex items-center justify-center gap-4">
                                <p className="text-slate-400 font-semibold">Share this post:</p>
                                <TwitterShareButton url={postUrl} title={post.title}>
                                    <div className="p-3 rounded-full bg-slate-800 hover:bg-[#1DA1F2] transition-colors"><Twitter size={20} /></div>
                                </TwitterShareButton>
                                <LinkedinShareButton url={postUrl} title={post.title}>
                                    <div className="p-3 rounded-full bg-slate-800 hover:bg-[#0A66C2] transition-colors"><Linkedin size={20} /></div>
                                </LinkedinShareButton>
                                {/* ★★★ FIXED THIS LINE ★★★ */}
                                <FacebookShareButton url={postUrl}>
                                    <div className="p-3 rounded-full bg-slate-800 hover:bg-[#1877F2] transition-colors"><Facebook size={20} /></div>
                                </FacebookShareButton>
                            </div>
                        </div>
                    </article>
                </div>
            </div>

            {/* "Recent Posts" section (Unchanged) */}
            {recentPosts && recentPosts.length > 0 && (
                 <div className="max-w-6xl mx-auto mt-20 pt-16 border-t border-slate-700/50 px-4">
                     <h2 className="text-3xl font-bold text-center mb-12">Recent Posts</h2>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                         {recentPosts.map(recentPost => (
                             <div key={recentPost.id} className="group">
                                 <Link href={`/blogs/${recentPost.slug}`} className="block mb-4">
                                     {recentPost.imageUrl ? (
                                         <Image
                                             src={recentPost.imageUrl}
                                             alt={recentPost.title}
                                             width={400} height={300}
                                             className="w-full h-auto aspect-[4/3] object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                                         />
                                     ) : (
                                         <div className="w-full h-auto aspect-[4/3] bg-[#2E284D] flex items-center justify-center rounded-xl">
                                             <span className='text-xl text-slate-400'>No Image</span>
                                         </div>
                                     )}
                                 </Link>
                                 <h3 className="text-xl font-bold text-[#F3F4F6] mb-2 line-clamp-2">
                                     <Link href={`/blogs/${recentPost.slug}`} className="hover:text-[#8B5CF6] transition-colors">{recentPost.title}</Link>
                                 </h3>
                                 <p className="text-xs text-slate-500">
                                     {new Date(recentPost.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                                 </p>
                             </div>
                         ))}
                     </div>
                     <div className="text-center py-16">
                         <Link href="/blogs" className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white bg-[#6D46C1] rounded-full hover:bg-purple-700 transition-all duration-300">
                             View All Posts
                         </Link>
                     </div>
                 </div>
            )}
        </section>
    );
}
