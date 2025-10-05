// components/PostViewer.tsx (TypeScript/React)

import React from 'react';

interface PostViewerProps {
    /** Tomar text editor theke generate kora HTML string ekhane asbe */
    htmlContent: string; 
    postTitle: string;
}

const PostViewer: React.FC<PostViewerProps> = ({ htmlContent, postTitle }) => {
    return (
        <article className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            {/* Title ti prose class-er baire thakle bhalo lagbe */}
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-50 mb-8 leading-tight">
                {postTitle}
            </h1>
            
            {/* ★★★ Magic Wrapper Ekhane ★★★ */}
            {/* prose: basic styling, dark:prose-invert: dark mode support */}
            {/* lg:prose-xl: boro screen e boro font, max-w-none: width control */}
            
            <div 
                className="prose dark:prose-invert lg:prose-xl max-w-none"
                // WARNING: dangerouslySetInnerHTML React er warning, kintu user generated HTML render korar jonno necessary. 
                // Ensure koren je apnar editor-er output sanitise kora.
                dangerouslySetInnerHTML={{ __html: htmlContent }} 
            />

        </article>
    );
}

export default PostViewer;