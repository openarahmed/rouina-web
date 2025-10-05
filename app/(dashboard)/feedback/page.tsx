// app/(dashboard)/feedback/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebaseConfig'; // Adjust path if needed
import { collection, query, onSnapshot, Timestamp, orderBy } from 'firebase/firestore';
import { Inbox, MessageSquare, Lightbulb, Mail } from 'lucide-react';

// Define a type for the submission data
interface Submission {
  id: string;
  type: 'Question' | 'Feature Request';
  message: string;
  email: string;
  status: 'new' | 'viewed' | 'completed';
  createdAt: Timestamp;
}

const FeedbackPage = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const submissionsRef = collection(db, 'userSubmissions');
    // Query to get the newest submissions first
    const q = query(submissionsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allSubmissions: Submission[] = [];
      querySnapshot.forEach((doc) => {
        allSubmissions.push({ id: doc.id, ...doc.data() } as Submission);
      });
      setSubmissions(allSubmissions);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching submissions: ", error);
      setLoading(false);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  // Helper to format the timestamp
  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return 'No date';
    return timestamp.toDate().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#4c0e4c]">User Feedback</h1>
        <p className="text-slate-500 mt-1">Questions and feature requests from your users.</p>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center p-8 text-slate-500">Loading feedback...</p>
          ) : submissions.length === 0 ? (
            <div className="text-center py-16">
              <Inbox size={48} className="mx-auto text-slate-300" />
              <h3 className="mt-4 text-lg font-semibold text-slate-700">No Feedback Yet</h3>
              <p className="mt-1 text-slate-500">When users submit questions or requests, they will appear here.</p>
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="border-b-2 border-slate-200 bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">User Email</th>
                  <th className="px-5 py-3">Message</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        {submission.type === 'Question' ? 
                            <MessageSquare className="h-4 w-4 text-sky-500" /> : 
                            <Lightbulb className="h-4 w-4 text-amber-500" />
                        }
                        <span className="font-medium text-slate-700">{submission.type}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{formatDate(submission.createdAt)}</td>
                    <td className="px-5 py-4 text-sm">
                        <a href={`mailto:${submission.email}`} className="text-indigo-600 hover:underline flex items-center gap-1.5">
                            <Mail className="h-4 w-4"/>
                            {submission.email}
                        </a>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-800 max-w-md whitespace-pre-wrap">{submission.message}</td>
                    <td className="px-5 py-4 text-sm">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;