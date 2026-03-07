/**
 * handleInputChange — clears the error for the changed field and updates formData.
 * TForm and TErrors are intentionally separate so the form data shape and
 * the errors shape don't have to be identical (e.g. errors can have extra
 * fields like confirmPassword that don't exist in the API payload).
 */
export function handleInputChange<
  TForm extends Record<string, any>,
  TErrors extends Record<string, any> = TForm
>(
  e: React.ChangeEvent<HTMLInputElement>,
  setErrors: React.Dispatch<React.SetStateAction<TErrors>>,
  setFormData: React.Dispatch<React.SetStateAction<TForm>>
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

/**
 * handleCheckBox — clears the error for the checkbox field and updates formData.
 * TForm and TErrors are separate for the same reason as handleInputChange.
 */
export function handleCheckBox<
  TForm extends Record<string, any>,
  TErrors extends Record<string, any> = TForm
>(
  name: string,
  isChecked: boolean,
  setFormData: React.Dispatch<React.SetStateAction<TForm>>,
  setErrors: React.Dispatch<React.SetStateAction<TErrors>>
) {
  setErrors((error) => ({
    ...error,
    [name]: "",
  }));

  setFormData((data) => ({
    ...data,
    [name]: isChecked,
  }));
}
