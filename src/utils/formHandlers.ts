import { SignUpData } from "@/api/authApi";

export function handleInputChange<T extends Record<string, any>>(
  e: React.ChangeEvent<HTMLInputElement>,
  setErrors: React.Dispatch<React.SetStateAction<T>>,
  setFormData: React.Dispatch<React.SetStateAction<T>>
) {
  setErrors((error) => ({
    ...error,
    [e.target.name]: "",
  }));

  setFormData((data) => ({
    ...data,
    [e.target.name]: e.target.value,
  }));
}

export function handleCheckBox<T extends Record<string, any>>(
  name:string,  
  isChecked:boolean ,
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  setErrors: React.Dispatch<React.SetStateAction<T>>,
) {
  console.log(isChecked)

      setErrors((error) => ({
    ...error,
    [name]: "",
  }));

  setFormData((data) => ({
    ...data,
    [name]:isChecked,
  }));

}

