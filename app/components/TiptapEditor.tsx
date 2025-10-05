'use client';

// ★★★ CRITICAL FIX: Import Editor type from @tiptap/react ★★★
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { Color } from '@tiptap/extension-color';
import { FontSize } from './TiptapExtensions/FontSize'; // Custom Extension Import

import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Heading2, Quote, Code, Paintbrush, Undo, Redo
} from 'lucide-react';
import React from 'react';

// MenuBar component remains the same
// ★★★ FIXED LINE 19: Changed 'any' to 'Editor | null' to resolve the TypeScript error ★★★
const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return null;
    }

    const buttonClasses = (isActive: boolean) =>
        `p-2 rounded-md transition-colors duration-200 ${
            isActive ? 'bg-purple-200 text-purple-800' : 'hover:bg-gray-200'
        }`;
    
    const fontSizes = ['12px', '14px', '16px', '18px', '24px', '30px', '36px', '48px', '60px'];

    return (
        <div className="flex flex-wrap items-center gap-2 p-2 border border-slate-300 bg-slate-50 rounded-t-md text-black/70">
            {/* Undo/Redo */}
            <button type="button" onClick={() => editor.chain().focus().undo().run()} title="Undo" className={buttonClasses(false)}><Undo className="w-5 h-5" /></button>
            <button type="button" onClick={() => editor.chain().focus().redo().run()} title="Redo" className={buttonClasses(false)}><Redo className="w-5 h-5" /></button>
            <div className="h-6 w-px bg-slate-300 mx-1"></div>

            {/* Font Size Dropdown */}
            <select
                onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
                value={editor.getAttributes('textStyle').fontSize || '16px'}
                className="p-1.5 rounded-md transition-colors duration-200 hover:bg-gray-200 focus:outline-none bg-transparent"
            >
                {fontSizes.map(size => (
                    // Note: No unescaped entities here, so this is safe.
                    <option key={size} value={size}>{size.replace('px', '')}</option> 
                ))}
            </select>
            <div className="h-6 w-px bg-slate-300 mx-1"></div>

            {/* Basic Formatting */}
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClasses(editor.isActive('bold'))} title="Bold"><Bold className="w-5 h-5" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClasses(editor.isActive('italic'))} title="Italic"><Italic className="w-5 h-5" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={buttonClasses(editor.isActive('underline'))} title="Underline"><UnderlineIcon className="w-5 h-5" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={buttonClasses(editor.isActive('strike'))} title="Strikethrough"><Strikethrough className="w-5 h-5" /></button>
            
            {/* Color and Highlight */}
            <div className="flex items-center">
                <input type="color" onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()} value={editor.getAttributes('textStyle').color || '#000000'} className="w-6 h-6 border-none bg-transparent p-0" title="Text Color"/>
                <button type="button" onClick={() => editor.chain().focus().toggleHighlight().run()} className={buttonClasses(editor.isActive('highlight'))} title="Highlight"><Paintbrush className="w-5 h-5" /></button>
            </div>
            <div className="h-6 w-px bg-slate-300 mx-1"></div>

            {/* Alignment */}
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={buttonClasses(editor.isActive({ textAlign: 'left' }))} title="Align Left"><AlignLeft className="w-5 h-5" /></button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={buttonClasses(editor.isActive({ textAlign: 'center' }))} title="Align Center"><AlignCenter className="w-5 h-5" /></button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={buttonClasses(editor.isActive({ textAlign: 'right' }))} title="Align Right"><AlignRight className="w-5 h-5" /></button>
            <div className="h-6 w-px bg-slate-300 mx-1"></div>
            
            {/* Lists and Blocks */}
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={buttonClasses(editor.isActive('heading', { level: 2 }))} title="Heading 2"><Heading2 className="w-5 h-5" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonClasses(editor.isActive('bulletList'))} title="Bullet List"><List className="w-5 h-5" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={buttonClasses(editor.isActive('orderedList'))} title="Ordered List"><ListOrdered className="w-5 h-5" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={buttonClasses(editor.isActive('blockquote'))} title="Blockquote"><Quote className="w-5 h-5" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={buttonClasses(editor.isActive('codeBlock'))} title="Code Block"><Code className="w-5 h-5" /></button>
        </div>
    );
};

interface TiptapEditorProps {
    content: string;
    onChange: (richText: string) => void;
}

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Underline,
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            FontSize,
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose max-w-none p-4 border border-t-0 border-slate-300 rounded-b-md min-h-[400px] focus:outline-none',
            },
        },
        immediatelyRender: false,
    });

    return (
        <div>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
            
            <style jsx global>{`
                .ProseMirror ul, .ProseMirror ol {
                    list-style: revert;
                    margin: revert;
                    padding: revert;
                }
                .ProseMirror {
                   color: #212529;
                }
            `}</style>
        </div>
    );
};

export default TiptapEditor;
