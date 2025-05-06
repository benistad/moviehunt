import React from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/services/tmdb';
import { CastMember, CrewMember } from '@/types/tmdb';

type StaffMemberProps = {
  member: (CastMember | CrewMember) & { type?: 'cast' | 'crew' };
};

const StaffMember = ({ member }: StaffMemberProps) => {
  const isCast = 'character' in member || member.type === 'cast';
  const role = isCast 
    ? (member as CastMember).character 
    : (member as CrewMember).job;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-32 w-32 overflow-hidden rounded-full">
        <Image
          src={getImageUrl(member.profile_path, 'w185')}
          alt={member.name}
          fill
          className="object-cover"
          sizes="128px"
        />
      </div>
      <h3 className="mt-2 text-center font-semibold">{member.name}</h3>
      <p className="text-center text-sm text-gray-400">{role}</p>
    </div>
  );
};

export default StaffMember;
