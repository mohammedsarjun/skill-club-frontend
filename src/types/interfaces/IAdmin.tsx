export interface IcategoryData {
  categoryName: string;
  categoryDescription: string;
  status: string;
}

export interface ISpeaciality{
  speacialityName:string,
  category:string,
  status:string
}

export interface ISkills{
    _id:string
    name: string;
    specialities:string[];
    status:string;
}