import React from 'react';
import { Skill, Speciality } from '@/types/interfaces/jobDetail';

interface Props {
  skills?: Skill[];
  specialities?: Speciality[];
}

export const SkillsList: React.FC<Props> = ({ skills = [], specialities = [] }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">Required Skills</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <span key={skill.skillId || skill.skillName} className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium border border-blue-200">
              {skill.skillName}
            </span>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No skills listed</p>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-3">Specialities</h3>
      <div className="flex flex-wrap gap-2">
        {specialities.length > 0 ? (
          specialities.map((spec) => (
            <span key={spec.specialityId || spec.specialityName} className="bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200">
              {spec.specialityName}
            </span>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No specialities listed</p>
        )}
      </div>
    </div>
  );
};

export default SkillsList;
