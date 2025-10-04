'use client';

import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../lib/firebaseConfig';
import { collection, onSnapshot, query, orderBy, Timestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { MoreVertical, Edit, Trash2, X, AlertTriangle, Lightbulb, ChevronDown, Check } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// --- Type Definitions ---
interface Tip {
  id: string;
  title: string;
  author: string;
  category: string;
  contentType: string;
  thumbnailUrl: string;
  excerpt: string;
  content: string;
  publishedAt?: Timestamp;
}

// ★★★ NEW: Skeleton loader for Tip Cards ★★★
const TipCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col animate-pulse">
        <div className="w-full h-40 bg-slate-200 rounded-t-xl"></div>
        <div className="p-4 flex flex-col flex-grow">
            <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-5 bg-slate-200 rounded w-3/4"></div>
            </div>
            <div className="flex-grow space-y-2 mt-4">
                <div className="h-3 bg-slate-200 rounded w-full"></div>
                <div className="h-3 bg-slate-200 rounded w-full"></div>
                <div className="h-3 bg-slate-200 rounded w-5/6"></div>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
            </div>
        </div>
    </div>
);

// --- Reusable Components ---

const CustomSelect = ({ options, value, onChange }: { options: string[], value: string, onChange: (value: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => { if (selectRef.current && !selectRef.current.contains(event.target as Node)) setIsOpen(false); };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleSelect = (option: string) => { onChange(option); setIsOpen(false); };
    return (
        <div className="relative" ref={selectRef}>
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="relative w-full p-3 text-left bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D46C1] flex justify-between items-center">
                <span className="text-slate-800">{value}</span>
                <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && ( <div className="absolute z-10 top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-slate-200 animate-scale-in"> <ul className="py-2">{options.map((option) => ( <li key={option} onClick={() => handleSelect(option)} className={`px-4 py-2 text-sm text-slate-700 cursor-pointer flex items-center justify-between hover:bg-[#6D46C1]/10 hover:text-[#6D46C1] ${value === option ? 'font-bold text-[#6D46C1]' : ''}`}> {option} {value === option && <Check className="h-4 w-4" />} </li> ))}</ul></div> )}
        </div>
    );
};

const TipCard = ({ tip, onDelete, onEdit }: { tip: Tip, onDelete: (id: string) => void, onEdit: (tip: Tip) => void }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false); };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col transition-shadow hover:shadow-lg">
            <div className="relative w-full h-40 rounded-t-xl overflow-hidden">
                <img src={tip.thumbnailUrl} alt={tip.title} className="w-full h-full object-cover bg-slate-100" onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/f1f5f9/cbd5e1?text=Error'; }} />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <div>
                    <p className="text-xs font-semibold text-[#6D46C1] uppercase">{tip.category}</p>
                    <h3 className="font-bold text-md text-[#4c0e4c] mt-1 line-clamp-2">{tip.title}</h3>
                    <p className="text-slate-600 text-sm mt-2 line-clamp-3">{tip.excerpt}</p>
                </div>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-400">
                        {tip.publishedAt?.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) ?? 'N/A'}
                    </p>
                    <div className="relative" ref={menuRef}>
                        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-slate-500 rounded-full hover:bg-slate-100 transition-colors">
                            <MoreVertical size={18}/>
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 bottom-full mb-2 w-36 bg-white rounded-xl shadow-xl border border-slate-200 z-10">
                                <button onClick={() => { onEdit(tip); setMenuOpen(false); }} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-[#6D46C1] transition-colors rounded-t-xl">
                                    <Edit size={14}/> Edit
                                </button>
                                <button onClick={() => { onDelete(tip.id); setMenuOpen(false); }} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 transition-colors rounded-b-xl">
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

const EditTipModal = ({ tip, isOpen, onClose, onSave }: { tip: Tip | null, isOpen: boolean, onClose: () => void, onSave: (id: string, data: Partial<Tip>) => void }) => {
    const [formData, setFormData] = useState<Partial<Tip>>({});
    useEffect(() => { if (tip) setFormData(tip); }, [tip]);
    if (!isOpen) return null;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setFormData({ ...formData, [e.target.id]: e.target.value }); };
    const handleSelectChange = (value: string) => { setFormData({ ...formData, contentType: value }); };
    const handleSave = () => { if (tip) onSave(tip.id, formData); };
    
    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-3xl animate-scale-in max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <h3 className="text-xl font-semibold text-[#4c0e4c]">Edit Tip</h3>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"><X size={20}/></button>
                </div>
                <div className="space-y-6 pt-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                        <input id="title" type="text" value={formData.title || ''} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#6D46C1]"/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Author</label>
                            <input id="author" type="text" value={formData.author || ''} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#6D46C1]"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                            <input id="category" type="text" value={formData.category || ''} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#6D46C1]"/>
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-slate-700 mb-2">Content Type</label>
                           <CustomSelect value={formData.contentType || 'article'} onChange={handleSelectChange} options={['article', 'video', 'guide', 'quick tip']} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Thumbnail URL</label>
                        <input id="thumbnailUrl" type="url" value={formData.thumbnailUrl || ''} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#6D46C1]"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Excerpt</label>
                        <textarea id="excerpt" rows={3} value={formData.excerpt || ''} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#6D46C1]"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Content</label>
                        <textarea id="content" rows={10} value={formData.content || ''} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#6D46C1]"/>
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

// --- Main Page Component ---
const AllTipsPage = () => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingTip, setEditingTip] = useState<Tip | null>(null);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [tipToDelete, setTipToDelete] = useState<string | null>(null);

  useEffect(() => {
    const tipsCollectionRef = collection(db, 'tips');
    const q = query(tipsCollectionRef, orderBy('publishedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allTips: Tip[] = [];
      querySnapshot.forEach((doc) => { allTips.push({ id: doc.id, ...doc.data() } as Tip); });
      setTips(allTips);
      setLoading(false);
    }, (error) => { console.error("Error fetching tips: ", error); setLoading(false); });
    return () => unsubscribe();
  }, []);

  const handleDeleteTip = (id: string) => { setTipToDelete(id); setConfirmModalOpen(true); };
  const confirmDelete = async () => { if (tipToDelete) { const toastId = toast.loading('Deleting tip...'); try { await deleteDoc(doc(db, "tips", tipToDelete)); toast.success("Tip deleted!", { id: toastId }); } catch (error) { toast.error("Failed to delete tip.", { id: toastId }); } finally { setConfirmModalOpen(false); setTipToDelete(null); } } };
  const handleEditTip = (tip: Tip) => { setEditingTip(tip); setEditModalOpen(true); };
  const handleUpdateTip = async (id: string, data: Partial<Tip>) => { const tipRef = doc(db, "tips", id); const toastId = toast.loading('Updating tip...'); try { await updateDoc(tipRef, data); toast.success("Tip updated!", { id: toastId }); setEditModalOpen(false); setEditingTip(null); } catch (error) { toast.error("Failed to update tip.", { id: toastId }); } };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#4c0e4c]">All Tips & Articles</h1>
                <p className="text-slate-500 mt-1">Manage all published tips and articles.</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => <TipCardSkeleton key={i} />)}
                    </div>
                ) 
                : tips.length === 0 ? (
                    <div className="text-center py-16">
                        <Lightbulb size={48} className="mx-auto text-slate-300" />
                        <h3 className="mt-4 text-lg font-semibold text-slate-700">No Tips Yet</h3>
                        <p className="mt-1 text-slate-500">Create a new tip to get started.</p>
                    </div>
                ) 
                : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tips.map(tip => (
                            <TipCard key={tip.id} tip={tip} onDelete={handleDeleteTip} onEdit={handleEditTip} />
                        ))}
                    </div>
                )}
            </div>
        </div>
      <EditTipModal isOpen={isEditModalOpen} tip={editingTip} onClose={() => setEditModalOpen(false)} onSave={handleUpdateTip} />
      <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setConfirmModalOpen(false)} onConfirm={confirmDelete} title="Delete Tip" message="Are you sure you want to delete this tip? This action is permanent." />
    </>
  );
};

export default AllTipsPage;