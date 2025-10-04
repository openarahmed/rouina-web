'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { db } from '../../lib/firebaseConfig';
import { collection, query, where, onSnapshot, Timestamp, orderBy } from 'firebase/firestore';
import Image from 'next/image';
import { Users as UsersIcon } from 'lucide-react';

// Member er jonno type
interface ApprovedMember {
  id: string;
  studentName: string;
  clubName: string;
  departmentId: string;
  semester: string;
  requestDate?: Timestamp; // Optional for data safety
}

// ★★★ NEW: Skeleton loader for the members page ★★★
const MemberListSkeleton = () => (
    <div className="animate-pulse">
        {/* Desktop Skeleton */}
        <div className="hidden lg:block">
            <div className="bg-slate-50 h-12 w-full rounded-t-lg"></div>
            <div className="divide-y divide-slate-200">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4">
                        <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                        <div className="flex-1 h-4 bg-slate-200 rounded w-1/4"></div>
                        <div className="flex-1 h-4 bg-slate-200 rounded w-1/4"></div>
                    </div>
                ))}
            </div>
        </div>
        {/* Mobile Skeleton */}
        <div className="block lg:hidden divide-y divide-slate-200">
             {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3">
                    <div className="h-12 w-12 bg-slate-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                        <div className="h-3 bg-slate-200 rounded w-full"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);


const MembersPage = () => {
  const [allMembers, setAllMembers] = useState<ApprovedMember[]>([]);
  const [clubList, setClubList] = useState<string[]>([]);
  const [selectedClub, setSelectedClub] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const membershipsRef = collection(db, 'clubMemberships');
    const q = query(membershipsRef, where('status', '==', 'approved'), orderBy('studentName'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const approvedMembers: ApprovedMember[] = [];
      const clubs = new Set<string>();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        approvedMembers.push({ id: doc.id, ...data } as ApprovedMember);
        clubs.add(data.clubName);
      });

      setAllMembers(approvedMembers);
      // Sort clubs alphabetically
      setClubList(['All', ...Array.from(clubs).sort()]);
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
    // ★★★ PAGE LAYOUT UPDATE: Consistent header and main content card ★★★
    <div className="w-full">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#4c0e4c]">Club Members</h1>
            <p className="text-slate-500 mt-1">View and filter all approved club members.</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-xl font-semibold text-[#4c0e4c] mb-4 sm:mb-0">
                    {selectedClub === 'All' ? 'All Members' : selectedClub} ({filteredMembers.length})
                </h2>
                <div className="flex items-center w-full sm:w-auto">
                    <label htmlFor="clubFilter" className="text-sm font-medium text-slate-600 mr-3 whitespace-nowrap">Filter by Club:</label>
                    <select
                        id="clubFilter"
                        value={selectedClub}
                        onChange={(e) => setSelectedClub(e.target.value)}
                        className="p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D46C1] bg-slate-50 text-black/50 w-full sm:w-auto text-sm transition"
                    >
                        {clubList.map(club => (
                            <option key={club} value={club}>{club}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <MemberListSkeleton />
            ) : filteredMembers.length === 0 ? (
                <div className="text-center py-16">
                    <UsersIcon size={48} className="mx-auto text-slate-300" />
                    <h3 className="mt-4 text-lg font-semibold text-slate-700">No Members Found</h3>
                    <p className="mt-1 text-slate-500">No approved members match the current filter.</p>
                </div>
            ) : (
                <div>
                    {/* Mobile & Tablet View */}
                    <div className="block lg:hidden">
                        <div className="divide-y divide-slate-100">
                            {filteredMembers.map((member) => (
                                <div key={member.id} className="p-3 flex items-center gap-4">
                                    <div className="flex-shrink-0">
                                        {/* ★★★ BRANDING: Avatar now uses primary brand colors ★★★ */}
                                        <Image 
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.studentName)}&background=6D46C1&color=FFFFFF&bold=true`} 
                                            width={48} 
                                            height={48} 
                                            alt="Avatar" 
                                            className="rounded-full h-12 w-12"
                                        />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-baseline gap-2">
                                            <p className="font-bold text-slate-800 truncate">{member.studentName}</p>
                                            <p className="text-sm text-[#6D46C1] truncate">({member.clubName})</p>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1 truncate">
                                            {member.departmentId} &bull; Semester: {member.semester}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Desktop View */}
                    <div className="overflow-x-auto hidden lg:block">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b-2 border-slate-200 bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    <th className="px-5 py-3">Student Name</th>
                                    <th className="px-5 py-3">Club Name</th>
                                    <th className="px-5 py-3">Department</th>
                                    <th className="px-5 py-3">Semester</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredMembers.map((member) => (
                                    <tr key={member.id} className="hover:bg-slate-50">
                                        <td className="px-5 py-4 text-sm">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 w-10 h-10">
                                                    <Image src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.studentName)}&background=6D46C1&color=FFFFFF&bold=true`} width={40} height={40} alt="Avatar" className="rounded-full"/>
                                                </div>
                                                <p className="text-slate-800 ml-4 font-medium">{member.studentName}</p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm"><p className="text-slate-700">{member.clubName}</p></td>
                                        <td className="px-5 py-4 text-sm"><p className="text-slate-700">{member.departmentId}</p></td>
                                        <td className="px-5 py-4 text-sm"><p className="text-slate-700">{member.semester}</p></td>
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