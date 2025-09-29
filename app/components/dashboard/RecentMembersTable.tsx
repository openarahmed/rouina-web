// File: app/components/dashboard/RecentMembersTable.tsx
import Image from 'next/image';

interface Member {
    id: string;
    studentName: string;
    clubName: string;
}

interface RecentMembersTableProps {
    members: Member[];
}

const RecentMembersTable: React.FC<RecentMembersTableProps> = ({ members }) => {
    return (
        <div className="col-span-12 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
             <h4 className="text-xl font-semibold text-black mb-4">
                Recently Approved Members
            </h4>
            <div className="flex flex-col">
                {members.map((member, key) => (
                    <div
                        className={`grid grid-cols-3 sm:grid-cols-4 rounded-sm p-2.5 ${key === members.length - 1 ? '' : 'border-b border-gray-100'}`}
                        key={key}
                    >
                        <div className="col-span-2 flex items-center">
                            <div className="flex-shrink-0">
                               <Image src={`https://ui-avatars.com/api/?name=${member.studentName.replace(' ', '+')}&background=E9D5FF&color=6D28D9`} width={40} height={40} alt="Brand" className="rounded-full"/>
                            </div>
                            <p className="hidden sm:block font-medium text-black ml-4">
                                {member.studentName}
                            </p>
                        </div>

                        <div className="col-span-1 flex items-center">
                            <p className="font-medium text-gray-700">{member.clubName}</p>
                        </div>
                        
                        <div className="col-span-1 hidden sm:flex items-center">
                            <p className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                Approved
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentMembersTable;