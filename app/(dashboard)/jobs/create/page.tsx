'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebaseConfig';
import { Briefcase, Loader2, AlertTriangle, ChevronDown, Check } from 'lucide-react';
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
                            <li
                                key={option}
                                onClick={() => handleSelect(option)}
                                className={`px-4 py-2 text-sm text-slate-700 cursor-pointer flex items-center justify-between hover:bg-[#6D46C1]/10 hover:text-[#6D46C1] ${value === option ? 'font-bold text-[#6D46C1]' : ''}`}
                            >
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


const CreateJobPage = () => {
  // State for each form field based on your data model
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Dhaka, Bangladesh');
  const [jobType, setJobType] = useState('Full-time');
  const [workModel, setWorkModel] = useState('On-Site');
  const [experience, setExperience] = useState('');
  const [applyLink, setApplyLink] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company || !description || !deadline || !applyLink) {
      setError('Please fill out all required fields.');
      return;
    }
    
    setError(null);
    setLoading(true);
    const toastId = toast.loading('Publishing job...');

    try {
      const jobsCollectionRef = collection(db, 'manuallyAddedJobs');
      const deadlineTimestamp = Timestamp.fromDate(new Date(deadline));

      await addDoc(jobsCollectionRef, {
        title, company, location, jobType, workModel, experience, applyLink,
        deadline: deadlineTimestamp,
        description,
        postedAt: serverTimestamp(),
      });
      
      toast.success('Job published successfully!', { id: toastId });
      router.push('/jobs');

    } catch (err) {
      console.error("Error creating job:", err);
      toast.error('Failed to publish job. Please try again.', { id: toastId });
      setError('Failed to create job. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full">
          <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#4c0e4c]">Create a New Job</h1>
              <p className="text-slate-500 mt-1">Fill out the details below to post a new job opportunity.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <form onSubmit={handleCreateJob}>
              <div className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">Job Title</label>
                        {/* ★★★ FIX: Added text color class ★★★ */}
                        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Senior React Native Developer" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D46C1] text-black/50"/>
                    </div>
                    <div>
                        <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                        <input id="company" type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g., CoderMat Inc." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D46C1] text-black/50"/>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Job Type</label>
                        <CustomSelect
                            value={jobType}
                            onChange={setJobType}
                            options={['Full-time', 'Part-time', 'Contract', 'Internship']}
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Work Model</label>
                        <CustomSelect
                            value={workModel}
                            onChange={setWorkModel}
                            options={['On-Site', 'Remote', 'Hybrid']}
                        />
                    </div>
                    <div>
                        <label htmlFor="experience" className="block text-sm font-medium text-slate-700 mb-2">Experience</label>
                        <input id="experience" type="text" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g., 1-2 years" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D46C1] text-black/50"/>
                    </div>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                        <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Dhaka, Bangladesh" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D46C1] text-black/50"/>
                    </div>
                    <div>
                        <label htmlFor="deadline" className="block text-sm font-medium text-slate-700 mb-2">Application Deadline</label>
                        <input id="deadline" type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D46C1] text-black/50"/>
                    </div>
                </div>

                <div>
                  <label htmlFor="applyLink" className="block text-sm font-medium text-slate-700 mb-2">Apply Link</label>
                  <input id="applyLink" type="url" value={applyLink} onChange={(e) => setApplyLink(e.target.value)} placeholder="https://www.linkedin.com/..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D46C1] text-black/50"/>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">Job Description</label>
                  {/* ★★★ FIX: Corrected a small typo from e.Targate to e.target ★★★ */}
                  <textarea id="description" rows={8} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide a detailed job description..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D46C1] text-black/50"/>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{error}</span>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center px-6 py-3 font-semibold text-white bg-[#6D46C1] rounded-md hover:bg-[#5e3bad] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D46C1] disabled:bg-[#6D46C1]/50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? 'Publishing...' : 'Publish Job'}
                </button>
              </div>
            </form>
          </div>
      </div>
    </>
  );
};

export default CreateJobPage;