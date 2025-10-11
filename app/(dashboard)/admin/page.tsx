'use client';

import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    where,
    writeBatch
} from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { db } from '../../lib/firebaseConfig'; // Using your firebase config path

// --- Data for Selectors (Same as your mobile app) ---
const departmentItems = [
    { label: 'Computer Science & Engineering', value: 'CSE' },
    { label: 'Electrical & Electronic Engineering', value: 'EEE' },
    { label: 'English', value: 'ENG' },
    { label: 'Business Administration', value: 'BBA' },
];

const semesterItems = Array.from({ length: 12 }, (_, i) => ({
    label: `Semester ${i + 1}`,
    value: `${i + 1}`
}));

// --- Main Admin Page Component ---
export default function AdminPage() {
    // --- State Management ---
    const [loading, setLoading] = useState({ duplicate: false, promote: false });
    const [routines, setRoutines] = useState<{ label: string; value: string }[]>([]);
    
    // State for Duplicating Routines
    const [templateId, setTemplateId] = useState<string>('');
    const [newId, setNewId] = useState('');

    // State for Promoting Students
    const [departmentId, setDepartmentId] = useState<string>('');
    const [currentSemester, setCurrentSemester] = useState<string>('');
    const [nextSemester, setNextSemester] = useState<string>('');

    // State for user feedback
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });

    // --- Data Fetching ---
    // Fetch existing routines to populate the dropdown
    const fetchRoutines = useCallback(async () => {
        try {
            const routinesColRef = collection(db, 'routines');
            const snapshot = await getDocs(routinesColRef);
            const routineList = snapshot.docs.map(doc => ({
                label: doc.id,
                value: doc.id,
            }));
            setRoutines(routineList);
        } catch (error) {
            console.error("Could not fetch routine templates.", error);
            setFeedback({ type: 'error', message: 'Could not fetch routine templates.' });
        }
    }, []);

    useEffect(() => {
        fetchRoutines();
    }, [fetchRoutines]);


    // --- Core Logic Functions (Ported from React Native) ---

    const handleDuplicateRoutine = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!templateId || !newId.trim()) {
            setFeedback({ type: 'error', message: 'Please select a template and provide a new routine ID.' });
            return;
        }

        const sanitizedNewId = newId.trim().toLowerCase().replace(/\s+/g, '-');
        if (!sanitizedNewId) {
             setFeedback({ type: 'error', message: 'Please provide a valid new routine ID.' });
            return;
        }

        setLoading(prev => ({ ...prev, duplicate: true }));
        setFeedback({ type: '', message: '' });

        try {
            const templateDocRef = doc(db, 'routines', templateId);
            const newDocRef = doc(db, 'routines', sanitizedNewId);

            const templateDoc = await getDoc(templateDocRef);
            if (!templateDoc.exists()) {
                throw new Error('Template document does not exist.');
            }

            await setDoc(newDocRef, templateDoc.data());

            setFeedback({ type: 'success', message: `Routine '${sanitizedNewId}' has been created successfully.` });
            setTemplateId('');
            setNewId('');
            // Refetch routines to include the new one in the list
            await fetchRoutines(); 
        } catch (error: any) {
            console.error("Error duplicating routine: ", error);
            setFeedback({ type: 'error', message: error.message || 'Failed to duplicate routine.' });
        } finally {
            setLoading(prev => ({ ...prev, duplicate: false }));
        }
    };

    const handlePromoteStudents = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!departmentId || !currentSemester || !nextSemester) {
            setFeedback({ type: 'error', message: 'Please select a department, current, and next semester.' });
            return;
        }

        setLoading(prev => ({ ...prev, promote: true }));
        setFeedback({ type: '', message: '' });

        try {
            const usersCollectionRef = collection(db, "users");
            const q = query(
                usersCollectionRef,
                where("studentInfo.departmentId", "==", departmentId),
                where("studentInfo.semester", "==", currentSemester)
            );

            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                setFeedback({ type: 'success', message: `No students found for ${departmentId} in semester ${currentSemester}. No action was taken.` });
                setLoading(prev => ({ ...prev, promote: false }));
                return;
            }

            const batch = writeBatch(db);
            snapshot.forEach(document => {
                batch.update(document.ref, { "studentInfo.semester": nextSemester });
            });
            await batch.commit();

            setFeedback({ type: 'success', message: `Successfully promoted ${snapshot.size} students to semester ${nextSemester}.` });
            setDepartmentId('');
            setCurrentSemester('');
            setNextSemester('');
        } catch (error: any) {
            console.error("Error promoting students: ", error);
            setFeedback({ type: 'error', message: error.message || 'Failed to promote students.' });
        } finally {
            setLoading(prev => ({ ...prev, promote: false }));
        }
    };

    // --- Reusable Input & Button Components ---
    const renderSelect = (id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, items: { label: string, value: string }[], placeholder: string) => (
         <div>
            <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
                {label}
            </label>
            <select
                id={id}
                value={value}
                onChange={onChange}
                className="block w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D46C1] text-black/60"
            >
                <option value="" disabled>{placeholder}</option>
                {items.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
        </div>
    );

    const renderTextInput = (id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string) => (
         <div>
            <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
                {label}
            </label>
            <input
                type="text"
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="block w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D46C1] text-black/60"
            />
        </div>
    );

    const renderActionButton = (label: string, isLoading: boolean) => (
        <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-[#6D46C1] rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? `${label}...` : label}
        </button>
    );

    // --- Main JSX ---
    return (
        <div className="w-full space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-[#4c0e4c]">Admin Panel</h1>
                <p className="text-slate-500 mt-1">Manage routines and student data.</p>
            </div>

            {/* --- Feedback Alert --- */}
            {feedback.message && (
                <div className={`p-4 rounded-md text-sm ${
                    feedback.type === 'success' ? 'bg-green-100 text-green-800' : 
                    feedback.type === 'error' ? 'bg-red-100 text-red-800' : ''
                }`}>
                    {feedback.message}
                </div>
            )}

            {/* --- Duplicate Routine Card --- */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Duplicate Routine</h2>
                <form onSubmit={handleDuplicateRoutine} className="space-y-6">
                    {renderSelect('templateId', 'Select Template Routine', templateId, (e) => setTemplateId(e.target.value), routines, 'Select a template...')}
                    {renderTextInput('newId', 'New Routine ID', newId, (e) => setNewId(e.target.value), 'e.g., cse-5-a')}
                    {renderActionButton('Duplicate Now', loading.duplicate)}
                </form>
            </div>

            {/* --- Promote Students Card --- */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Promote Students</h2>
                <form onSubmit={handlePromoteStudents} className="space-y-6">
                    {renderSelect('departmentId', 'Select Department', departmentId, (e) => setDepartmentId(e.target.value), departmentItems, 'Select a department...')}
                    {renderSelect('currentSemester', 'Current Semester', currentSemester, (e) => setCurrentSemester(e.target.value), semesterItems, 'Select current semester...')}
                    {renderSelect('nextSemester', 'Promote to Semester', nextSemester, (e) => setNextSemester(e.target.value), semesterItems, 'Select next semester...')}
                    {renderActionButton('Promote Now', loading.promote)}
                </form>
            </div>
        </div>
    );
}
