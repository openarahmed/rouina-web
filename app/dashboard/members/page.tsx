'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { db } from '../../lib/firebaseConfig';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import Image from 'next/image';

// Member er jonno type
interface ApprovedMember {
  id: string;
  studentName: string;
  clubName: string;
  departmentId: string;
  semester: string;
  requestDate: Timestamp;
}

const MembersPage = () => {
  const [allMembers, setAllMembers] = useState<ApprovedMember[]>([]);
  const [clubList, setClubList] = useState<string[]>([]);
  const [selectedClub, setSelectedClub] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const membershipsRef = collection(db, 'clubMemberships');
    const q = query(membershipsRef, where('status', '==', 'approved'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const approvedMembers: ApprovedMember[] = [];
      const clubs = new Set<string>();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        approvedMembers.push({ id: doc.id, ...data } as ApprovedMember);
        clubs.add(data.clubName);
      });

      setAllMembers(approvedMembers);
      setClubList(['All', ...Array.from(clubs)]);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching approved members: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredMembers = useMemo(() => {
    if (selectedClub === 'All') {
      return allMembers;
    }
    return allMembers.filter(member => member.clubName === selectedClub);
  }, [selectedClub, allMembers]);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">Club Members ({filteredMembers.length})</h2>
          <div className="flex items-center w-full sm:w-auto">
            <label htmlFor="clubFilter" className="text-sm font-medium text-gray-600 mr-3 whitespace-nowrap">Filter by Club:</label>
            <select
              id="clubFilter"
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-auto text-sm"
            >
              {clubList.map(club => (
                <option key={club} value={club}>{club}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading members...</p>
        ) : filteredMembers.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No approved members found for this selection.</p>
        ) : (
          <div>
            {/* ★★★ Mobile & Tablet View: 2-line Card Layout ★★★ */}
            <div className="block lg:hidden">
              <div className="divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="p-4 flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <Image 
                        src={`https://ui-avatars.com/api/?name=${member.studentName.replace(' ', '+')}&background=E9D5FF&color=6D28D9&bold=true`} 
                        width={48} 
                        height={48} 
                        alt="Avatar" 
                        className="rounded-full h-12 w-12"
                      />
                    </div>
                    {/* ★★★ পরিবর্তন: এখানে তথ্য ২ লাইনে দেখানো হয়েছে ★★★ */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-baseline gap-2">
                          <p className="font-bold text-gray-800 truncate">{member.studentName}</p>
                          <p className="text-sm text-purple-700 truncate">({member.clubName})</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                          {member.departmentId} &bull; Semester: {member.semester}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ★★★ Desktop View: Table Layout (Unchanged) ★★★ */}
            <div className="overflow-x-auto hidden lg:block">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <th className="px-5 py-3">Student Name</th>
                    <th className="px-5 py-3">Club Name</th>
                    <th className="px-5 py-3">Department</th>
                    <th className="px-5 py-3">Semester</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-5 py-4 text-sm">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10">
                              <Image src={`https://ui-avatars.com/api/?name=${member.studentName.replace(' ', '+')}&background=E9D5FF&color=6D28D9&bold=true`} width={40} height={40} alt="Avatar" className="rounded-full"/>
                          </div>
                          <p className="text-gray-900 ml-4 font-medium">{member.studentName}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm"><p className="text-gray-900">{member.clubName}</p></td>
                      <td className="px-5 py-4 text-sm"><p className="text-gray-900">{member.departmentId}</p></td>
                      <td className="px-5 py-4 text-sm"><p className="text-gray-900">{member.semester}</p></td>
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

export default MembersPage;