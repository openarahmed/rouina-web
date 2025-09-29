// File: app/dashboard/requests/page.tsx

'use client'; 

import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebaseConfig'; // পাথটি আপডেটেড
import { collection, query, where, onSnapshot, doc, updateDoc, Timestamp } from 'firebase/firestore';

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
    <>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Pending Club Membership Requests</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <p className="p-6 text-center text-gray-500">Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No pending requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="px-5 py-3">Student Name</th>
                  <th className="px-5 py-3">Club Name</th>
                  <th className="px-5 py-3">Request Date</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-5 py-4 text-sm">
                      <p className="text-gray-900">{request.studentName}</p>
                      <p className="text-gray-600 text-xs mt-1">Dept: {request.departmentId} - Sem: {request.semester}</p>
                    </td>
                    <td className="px-5 py-4 text-sm"><p className="text-gray-900">{request.clubName}</p></td>
                    <td className="px-5 py-4 text-sm"><p className="text-gray-900">{request.requestDate.toDate().toLocaleDateString()}</p></td>
                    <td className="px-5 py-4 text-sm">
                      <button onClick={() => handleApproveRequest(request.id)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-md mr-2 text-xs">Approve</button>
                      <button onClick={() => handleDenyRequest(request.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-md text-xs">Deny</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default ClubRequestsPage;