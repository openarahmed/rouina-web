'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebaseConfig';
import { Loader2, AlertTriangle, ChevronDown, Check, Lightbulb } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Reusable Custom Select/Dropdown Component
const CustomSelect = ({ options, value, onChange, placeholder }: { options: string[], value: string, onChange: (value: string) => void, placeholder?: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: string) => {
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={selectRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-full p-3 text-left bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D46C1] flex justify-between items-center"
            >
                <span className="text-slate-800">{value || placeholder}</span>
                <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute z-10 top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-slate-200 animate-scale-in">
                    <ul className="py-2">
                        {options.map((option) => (
                            <li key={option} onClick={() => handleSelect(option)} className={`px-4 py-2 text-sm text-slate-700 cursor-pointer flex items-center justify-between hover:bg-[#6D46C1]/10 hover:text-[#6D46C1] ${value === option ? 'font-bold text-[#6D46C1]' : ''}`}>
                                {option}
                                {value === option && <Check className="h-4 w-4" />}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// ★★★ UPDATE: Category options from your image ★★★
const tipCategories = ['Popular', 'Dev', 'AI Tools', 'Study Hacks', 'Career'];

const CreateTipPage = () => {
  // State for each form field based on the 'tips' data model
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('Routina Team');
  // ★★★ UPDATE: Default category state ★★★
  const [category, setCategory] = useState(tipCategories[0]); 
  const [contentType, setContentType] = useState('article');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateTip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !excerpt || !category || !thumbnailUrl) {
      setError('Please fill out all required fields.');
      return;
    }
    
    setError(null);
    setLoading(true);
    const toastId = toast.loading('Publishing tip...');

    try {
      const tipsCollectionRef = collection(db, 'tips');
      
      await addDoc(tipsCollectionRef, {
        title, author, category, contentType, thumbnailUrl, excerpt, content,
        publishedAt: serverTimestamp(),
      });
      
      toast.success('Tip published successfully!', { id: toastId });
      router.push('/tips');

    } catch (err) {
      console.error("Error creating tip:", err);
      toast.error('Failed to publish tip. Please try again.', { id: toastId });
      setError('Failed to create tip. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full">
          <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#4c0e4c]">Create a New Tip</h1>
              <p className="text-slate-500 mt-1">Share a new article, guide, or tip with your users.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <form onSubmit={handleCreateTip}>
              <div className="space-y-6">
                
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                    <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Top 10 AI Tools for Students" className="w-full p-3 bg-slate-50 text-black/50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D46C1]"/>
                </div>

                {/* Author, Category, Content Type */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="author" className="block text-sm font-medium text-slate-700 mb-2">Author</label>
                        <input id="author" type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full p-3 bg-slate-50 text-black/50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D46C1]"/>
                    </div>
                    {/* ★★★ UPDATE: Category text input replaced with CustomSelect ★★★ */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                        <CustomSelect
                            value={category}
                            onChange={setCategory}
                            options={tipCategories}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Content Type</label>
                        <CustomSelect
                            value={contentType}
                            onChange={setContentType}
                            options={['article', 'video', 'guide', 'quick tip']}
                        />
                    </div>
                </div>
                
                {/* Thumbnail URL */}
                <div>
                  <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-slate-700 mb-2">Thumbnail URL</label>
                  <input id="thumbnailUrl" type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 text-black/50 focus:ring-[#6D46C1]"/>
                </div>

                {/* Thumbnail Preview */}
                {thumbnailUrl && (
                   <div className="mt-4">
                     <p className="text-sm font-medium text-slate-700 mb-2">Thumbnail Preview:</p>
                     <div className="w-full max-w-sm h-48 relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                         <img 
                           src={thumbnailUrl} 
                           alt="Preview" 
                           className="w-full h-full object-cover" 
                           onError={(e) => {
                              e.currentTarget.src = 'https://placehold.co/600x400/f1f5f9/cbd5e1?text=Invalid+Image';
                              e.currentTarget.classList.add('object-contain');
                           }}
                         />
                     </div>
                 </div>
                )}
                
                {/* Excerpt */}
                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium text-slate-700 mb-2">Excerpt (Short Summary)</label>
                  <textarea id="excerpt" rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="A brief summary of the tip..." className="w-full p-3 bg-slate-50 border border-slate-200 text-black/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D46C1]"/>
                </div>

                {/* Content */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-2">Full Content</label>
                  <textarea id="content" rows={12} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write the full article or tip here..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D46C1] text-black/50" />
                </div>

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
                  className="flex items-center justify-center px-6 py-3 font-semibold text-white bg-[#6D46C1] rounded-md hover:bg-[#5e3bad] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D46C1] disabled:bg-[#6D46C1]/50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? 'Publishing...' : 'Publish Tip'}
                </button>
              </div>
            </form>
          </div>
      </div>
    </>
  );
};

export default CreateTipPage;