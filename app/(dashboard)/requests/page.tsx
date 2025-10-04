// File: app/dashboard/requests/page.tsx

'use client'; 

import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebaseConfig'; // Please double-check this import path
import { collection, query, where, onSnapshot, doc, updateDoc, Timestamp, orderBy } from 'firebase/firestore';
import { Check, X, Inbox } from 'lucide-react';

interface MembershipRequest {
  id: string; 
  studentName: string;
  clubName: string;
  departmentId: string;
  semester: string;
  status: 'pending' | 'approved' | 'denied';
  requestDate?: Timestamp; // Make requestDate optional to handle missing data
}

// Skeleton loader component for a better loading experience
const RequestTableSkeleton = () => (
    <div className="animate-pulse">
        <div className="hidden md:block">
            <div className="bg-slate-50 h-12 w-full rounded-t-lg"></div>
            <div className="divide-y divide-slate-200">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center p-4">
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                        </div>
                        <div className="h-8 bg-slate-200 rounded w-1/4"></div>
                    </div>
                ))}
            </div>
        </div>
        <div className="block md:hidden divide-y divide-slate-200">
             {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center p-3">
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                        <div className="h-3 bg-slate-200 rounded w-full"></div>
                    </div>
                    <div className="flex gap-2 ml-4">
                        <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
                        <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);


const ClubRequestsPage = () => {
  const [requests, setRequests] = useState<MembershipRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const membershipsRef = collection(db, 'clubMemberships');
    const q = query(membershipsRef, where('status', '==', 'pending'), orderBy('requestDate', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const pendingRequests: MembershipRequest[] = [];
      querySnapshot.forEach((doc) => {
        pendingRequests.push({ id: doc.id, ...doc.data() } as MembershipRequest);
      });
      setRequests(pendingRequests);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching pending requests: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleApproveRequest = async (id: string) => {
    const requestDocRef = doc(db, 'clubMemberships', id);
    try {
      await updateDoc(requestDocRef, { status: 'approved' });
    } catch (error) {
      console.error("Error approving request: ", error);
    }
  };

  const handleDenyRequest = async (id: string) => {
    const requestDocRef = doc(db, 'clubMemberships', id);
    try {
      await updateDoc(requestDocRef, { status: 'denied' });
    } catch (error) {
      console.error("Error denying request: ", error);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#4c0e4c]">Club Requests</h1>
        <p className="text-slate-500 mt-1">Review and manage pending membership requests.</p>
      </div>

      <div className="bg-white p-0 sm:p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <RequestTableSkeleton />
        ) : requests.length === 0 ? (
          <div className="text-center py-16">
            <Inbox size={48} className="mx-auto text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-700">All caught up!</h3>
            <p className="mt-1 text-slate-500">There are no new pending requests.</p>
          </div>
        ) : (
          <div>
            {/* Mobile View */}
            <div className="block md:hidden">
              <div className="divide-y divide-slate-100">
                {requests.map((request) => (
                  <div key={request.id} className="p-3 flex items-center justify-between gap-3">
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-slate-800 truncate">{request.studentName}</p>
                        <p className="text-xs text-slate-500 truncate">({request.clubName})</p>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 truncate">
                        {request.departmentId} &bull; Sem {request.semester} &bull; 
                        {/* ★★★ FIX: Added optional chaining to prevent crash if date is missing ★★★ */}
                        {request.requestDate?.toDate().toLocaleDateString() ?? 'N/A'}
                      </p>
                    </div>
                    <div className="flex flex-shrink-0 gap-2">
                      <button 
                        onClick={() => handleApproveRequest(request.id)} 
                        className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                        title="Approve Request"
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        onClick={() => handleDenyRequest(request.id)} 
                        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                        title="Deny Request"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop View */}
            <div className="overflow-x-auto hidden md:block">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b-2 border-slate-200 bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-5 py-3">Student Info</th>
                    <th className="px-5 py-3">Club Name</th>
                    <th className="px-5 py-3">Request Date</th>
                    <th className="px-5 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 text-sm">
                        <p className="text-slate-800 font-medium">{request.studentName}</p>
                        <p className="text-slate-500 text-xs mt-1">Dept: {request.departmentId} - Sem: {request.semester}</p>
                      </td>
                      <td className="px-5 py-4 text-sm"><p className="text-slate-700">{request.clubName}</p></td>
                      <td className="px-5 py-4 text-sm">
                        <p className="text-slate-700">
                           {/* ★★★ FIX: Added optional chaining here as well ★★★ */}
                          {request.requestDate?.toDate().toLocaleDateString() ?? 'No Date'}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-sm text-center">
                        <button onClick={() => handleApproveRequest(request.id)} className="bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-1.5 px-4 rounded-md mr-2 text-xs transition-colors">Approve</button>
                        <button onClick={() => handleDenyRequest(request.id)} className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-1.5 px-4 rounded-md text-xs transition-colors">Deny</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubRequestsPage;