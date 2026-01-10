
import { z } from "zod";

export function tooLongInputError(fieldName: string, inputValue: string | number) {

  const valueAsString = String(inputValue);


  const tooLongSchema = z.string().max(100, `${fieldName} is too long`);

  const schemaResult = tooLongSchema.safeParse(valueAsString);


  if (schemaResult.success) {
    return { success: true };
  } else {
    return {
      success: false,
      errorMessage: schemaResult.error.issues[0].message,
    };
  }
}
