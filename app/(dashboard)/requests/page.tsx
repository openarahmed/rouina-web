// File: app/dashboard/requests/page.tsx

'use client'; 

import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebaseConfig';
import { collection, query, where, onSnapshot, doc, updateDoc, Timestamp } from 'firebase/firestore';
// ★★★ Check এবং X আইকন import করা হয়েছে ★★★
import { Check, X } from 'lucide-react';

interface MembershipRequest {
  id: string; 
  studentName: string;
  clubName: string;
  departmentId: string;
  semester: string;
  status: 'pending' | 'approved' | 'denied';
  requestDate: Timestamp;
}

const ClubRequestsPage = () => {
  const [requests, setRequests] = useState<MembershipRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const membershipsRef = collection(db, 'clubMemberships');
    const q = query(membershipsRef, where('status', '==', 'pending'));
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
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Pending Club Membership Requests</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <p className="p-6 text-center text-gray-500">Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No pending requests found.</p>
        ) : (
          <div>
            {/* ★★★ Mobile View: Compact Card Layout ★★★ */}
            <div className="block md:hidden">
              <div className="divide-y divide-gray-200">
                {requests.map((request) => (
                  <div key={request.id} className="p-3 flex items-center justify-between gap-3">
                    {/* Left Side: Information */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-gray-800 truncate">{request.studentName}</p>
                        <p className="text-xs text-gray-500 truncate">({request.clubName})</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        Dept: {request.departmentId} &bull; Sem: {request.semester} &bull; {request.requestDate.toDate().toLocaleDateString()}
                      </p>
                    </div>

                    {/* Right Side: Actions */}
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

            {/* ★★★ Desktop View: Table Layout (Unchanged) ★★★ */}
            <div className="overflow-x-auto hidden md:block">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <th className="px-5 py-3">Student Info</th>
                    <th className="px-5 py-3">Club Name</th>
                    <th className="px-5 py-3">Request Date</th>
                    <th className="px-5 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-5 py-4 text-sm">
                        <p className="text-gray-900 font-medium">{request.studentName}</p>
                        <p className="text-gray-600 text-xs mt-1">Dept: {request.departmentId} - Sem: {request.semester}</p>
                      </td>
                      <td className="px-5 py-4 text-sm"><p className="text-gray-900">{request.clubName}</p></td>
                      <td className="px-5 py-4 text-sm"><p className="text-gray-900">{request.requestDate.toDate().toLocaleDateString()}</p></td>
                      <td className="px-5 py-4 text-sm text-center">
                        <button onClick={() => handleApproveRequest(request.id)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-md mr-2 text-xs">Approve</button>
                        <button onClick={() => handleDenyRequest(request.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-md text-xs">Deny</button>
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