import { Providers, signInSchema, signUpSchema } from "@/types/auth";
import { z } from "zod";
import { IFormErrors, IFormData } from "./types";
import { toast } from "sonner";

export const INPUT_CLASS = `
  h-14
  w-full
  rounded-2xl
  border
  border-black/10
  bg-black/[0.02]
  pl-12
  pr-4
  text-black
  placeholder:text-black/30
  outline-none
  transition-all
  duration-300
  focus:border-black
  focus:bg-white
`;

export const validateForm = (
  formData: IFormData,
  isSignUp: boolean
): { isValid: boolean; errors: IFormErrors } => {
  try {
    const schema = isSignUp ? signUpSchema : signInSchema;

    const dataToValidate = isSignUp
      ? formData
      : {
        email: formData.email,
        password: formData.password,
      };

    schema.parse(dataToValidate);

    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const newErrors: IFormErrors = {};

      error.errors.forEach((err) => {
        const fieldName = err.path[0] as keyof IFormErrors;
        newErrors[fieldName] = err.message;
      });

      const allErrors = error.errors
        .map((err) => `• ${err.message}`)
        .join("\n");

      toast(allErrors);

      return { isValid: false, errors: newErrors };
    }

    return { isValid: false, errors: {} };
  }
};
