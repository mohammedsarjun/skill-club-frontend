export interface ICategory {
  _id: string;
  name: string;
}

export interface ISpeciality {
  _id: string;
  name: string;
  category: string;
}

export interface ISkill {
  _id: string;
  name: string;
  specialities: string[];
}

export interface ISpecialityWithSkills {
  _id: string;
  name: string;
  skills: ISkill[];
}

export interface IUpdateExpertise {
  category: string;
  specialities: string[];
  skills: string[];
}

export interface IExpertiseResponse {
  workCategory: string;
  specialties: string[];
  skills: string[];
}
