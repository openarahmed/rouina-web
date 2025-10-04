'use client';

import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../lib/firebaseConfig';
import { collection, onSnapshot, query, orderBy, Timestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { MoreVertical, Edit, Trash2, X, AlertTriangle, Briefcase, Calendar, MapPin, Building, Clock } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// --- Type Definitions ---
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  workModel: string;
  experience: string;
  applyLink: string;
  deadline?: Timestamp;
  description: string;
  postedAt?: Timestamp;
}

// ★★★ NEW: Skeleton loader for Job Cards ★★★
const JobCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col animate-pulse">
        <div className="space-y-3 flex-grow">
            <div className="h-5 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="space-y-2 pt-4">
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


// --- Reusable Components (Restyled for Jobs) ---
const JobCard = ({ job, onDelete, onEdit }: { job: Job, onDelete: (id: string) => void, onEdit: (job: Job) => void }) => {
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

    const isExpired = job.deadline && job.deadline.toDate() < new Date();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col transition-shadow hover:shadow-lg">
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg text-[#4c0e4c]">{job.title}</h3>
                        <p className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                            <Building size={14} className="text-slate-400"/> {job.company}
                        </p>
                    </div>
                     <div className="relative" ref={menuRef}>
                        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-slate-500 rounded-full hover:bg-slate-100 transition-colors">
                            <MoreVertical size={18}/>
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-xl shadow-xl border border-slate-200 z-10">
                                <button onClick={() => { onEdit(job); setMenuOpen(false); }} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-[#6D46C1] transition-colors rounded-t-xl">
                                    <Edit size={14}/> Edit
                                </button>
                                <button onClick={() => { onDelete(job.id); setMenuOpen(false); }} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 transition-colors rounded-b-xl">
                                    <Trash2 size={14}/> Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <p className="text-slate-600 text-sm mt-4 line-clamp-3">{job.description}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
                 <div className="flex items-center justify-between text-sm">
                    <p className="text-slate-500 flex items-center gap-2">
                        <MapPin size={14} /> {job.location}
                    </p>
                    <p className={`font-semibold px-2 py-1 rounded-full text-xs ${isExpired ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {isExpired ? 'Expired' : 'Active'}
                    </p>
                 </div>
                 <p className="text-xs text-slate-400 mt-3">
                    Deadline: {job.deadline?.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) ?? 'Not set'}
                </p>
            </div>
        </div>
    );
}

const EditJobModal = ({ job, isOpen, onClose, onSave }: { job: Job | null, isOpen: boolean, onClose: () => void, onSave: (id: string, data: Partial<Job>) => void }) => {
    const [formData, setFormData] = useState<Partial<Job>>({});

    useEffect(() => {
        if (job) {
            const deadlineDate = job.deadline?.toDate();
            // Format date for datetime-local input: YYYY-MM-DDTHH:mm
            const deadlineString = deadlineDate ? new Date(deadlineDate.getTime() - (deadlineDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : '';
            
            setFormData({ ...job, deadline: deadlineString as any });
        }
    }, [job]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSave = () => {
        if (job) {
            const dataToSave = { ...formData };
            // Convert deadline string back to Timestamp before saving
            if (formData.deadline) {
                dataToSave.deadline = Timestamp.fromDate(new Date(formData.deadline as any));
            }
            onSave(job.id, dataToSave);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <h3 className="text-xl font-semibold text-[#4c0e4c]">Edit Job</h3>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"><X size={20}/></button>
                </div>
                <div className="space-y-6 pt-6">
                    {/* Reusing the form structure from Create page */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">Job Title</label>
                            <input id="title" type="text" value={formData.title || ''} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md"/>
                        </div>
                        <div>
                            <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                            <input id="company" type="text" value={formData.company || ''} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md"/>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="deadline" className="block text-sm font-medium text-slate-700 mb-2">Application Deadline</label>
                            <input id="deadline" type="datetime-local" value={formData.deadline as any || ''} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md"/>
                        </div>
                         <div>
                            <label htmlFor="applyLink" className="block text-sm font-medium text-slate-700 mb-2">Apply Link</label>
                            <input id="applyLink" type="url" value={formData.applyLink || ''} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md"/>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">Job Description</label>
                        <textarea id="description" rows={6} value={formData.description || ''} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md"/>
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

// --- Confirmation Modal (Unchanged) ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, title: string, message: string }) => { if (!isOpen) return null; return ( <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50 p-4"> <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md animate-scale-in"> <div className="flex items-start"> <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"> <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" /> </div> <div className="ml-4 text-left"> <h3 className="text-lg font-bold text-[#4c0e4c]">{title}</h3> <div className="mt-2"> <p className="text-sm text-slate-500">{message}</p> </div> </div> </div> <div className="mt-6 flex justify-end gap-4"> <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">Cancel</button> <button onClick={onConfirm} className="px-5 py-2.5 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm transition-colors">Delete</button> </div> </div> </div> ); };

// --- Main Page Component ---
const AllJobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  useEffect(() => {
    const jobsCollectionRef = collection(db, 'manuallyAddedJobs');
    const q = query(jobsCollectionRef, orderBy('postedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allJobs: Job[] = [];
      querySnapshot.forEach((doc) => { allJobs.push({ id: doc.id, ...doc.data() } as Job); });
      setJobs(allJobs);
      setLoading(false);
    }, (error) => { console.error("Error fetching jobs: ", error); setLoading(false); });
    return () => unsubscribe();
  }, []);

  const handleDeleteJob = (id: string) => {
      setJobToDelete(id);
      setConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (jobToDelete) {
        const toastId = toast.loading('Deleting job...');
        try {
            await deleteDoc(doc(db, "manuallyAddedJobs", jobToDelete));
            toast.success("Job deleted successfully!", { id: toastId });
        } catch (error) {
            toast.error("Failed to delete job.", { id: toastId });
        } finally {
            setConfirmModalOpen(false);
            setJobToDelete(null);
        }
    }
  };

  const handleEditJob = (job: Job) => {
      setEditingJob(job);
      setEditModalOpen(true);
  };
  
  const handleUpdateJob = async (id: string, data: Partial<Job>) => {
      const jobRef = doc(db, "manuallyAddedJobs", id);
      const toastId = toast.loading('Updating job...');
      try {
          await updateDoc(jobRef, data);
          toast.success("Job updated successfully!", { id: toastId });
          setEditModalOpen(false);
          setEditingJob(null);
      } catch (error) {
          toast.error("Failed to update job.", { id: toastId });
      }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#4c0e4c]">All Jobs</h1>
                <p className="text-slate-500 mt-1">Manage all published job opportunities.</p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => <JobCardSkeleton key={i} />)}
                    </div>
                ) 
                : jobs.length === 0 ? (
                    <div className="text-center py-16">
                        <Briefcase size={48} className="mx-auto text-slate-300" />
                        <h3 className="mt-4 text-lg font-semibold text-slate-700">No Jobs Posted Yet</h3>
                        <p className="mt-1 text-slate-500">Create a new job to get started.</p>
                    </div>
                ) 
                : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map(job => (
                            <JobCard key={job.id} job={job} onDelete={handleDeleteJob} onEdit={handleEditJob} />
                        ))}
                    </div>
                )}
            </div>
        </div>

      <EditJobModal isOpen={isEditModalOpen} job={editingJob} onClose={() => setEditModalOpen(false)} onSave={handleUpdateJob} />
      
      <ConfirmationModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Job"
        message="Are you sure you want to delete this job post? This action cannot be undone."
      />
    </>
  );
};

export default AllJobsPage;