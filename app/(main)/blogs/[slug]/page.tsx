// app/(main)/blogs/[slug]/page.tsx

import { use } from 'react';
import { db } from "../../../lib/firebaseConfig";
import { collection, query, where, getDocs, limit, Timestamp, orderBy } from "firebase/firestore";
import { notFound } from "next/navigation";
import BlogPostDisplay from "../../../components/blog/BlogPostDisplay";

// This type is for data coming directly from Firestore
interface BlogPostServerData {
    id: string;
    title: string;
    slug: string;
    content: string;
    imageUrl: string;
    authorName: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// This type is for the simple object we'll pass to the client
export interface BlogPostClientData {
    id: string;
    title: string;
    slug: string;
    content: string;
    imageUrl: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
}

// Function to fetch the main blog post
async function getPostBySlug(slug: string): Promise<BlogPostClientData | null> {
    const postsCollectionRef = collection(db, 'blogPosts');
    const q = query(
        postsCollectionRef,
        where('slug', '==', slug),
        where('isPublished', '==', true),
        limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;

    const doc = querySnapshot.docs[0];
    const postData = { id: doc.id, ...doc.data() } as BlogPostServerData;

    return {
        ...postData,
        createdAt: postData.createdAt.toDate().toISOString(),
        updatedAt: postData.updatedAt.toDate().toISOString(),
    };
}

// ★★★ 1. New function to fetch recent posts ★★★
async function getRecentPosts(currentSlug: string): Promise<BlogPostClientData[]> {
    const postsCollectionRef = collection(db, 'blogPosts');
    const q = query(
        postsCollectionRef,
        where('isPublished', '==', true),
        where('slug', '!=', currentSlug), // Exclude the current post
        orderBy('createdAt', 'desc'),
        limit(4) // Get the 4 most recent posts
    );

    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
        const postData = { id: doc.id, ...doc.data() } as BlogPostServerData;
        return {
            ...postData,
            createdAt: postData.createdAt.toDate().toISOString(),
            updatedAt: postData.updatedAt.toDate().toISOString(),
        };
    });
}

export default function SinglePostPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    
    // ★★★ 2. Fetch both the main post and recent posts at the same time ★★★
    const [post, recentPosts] = use(Promise.all([
        getPostBySlug(resolvedParams.slug),
        getRecentPosts(resolvedParams.slug)
    ]));

    if (!post) {
        return notFound();
    }

    // ★★★ 3. Pass both sets of data to the display component ★★★
    return <BlogPostDisplay post={post} recentPosts={recentPosts} />;
}