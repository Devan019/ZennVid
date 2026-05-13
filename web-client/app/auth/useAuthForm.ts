"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  checkUserWithOtp,
  loginWithCredentials,
  signUpWithCredentials,
} from "./api";
import { validateForm } from "./utils";
import { IFormData, IFormErrors } from "./types";
import { FRONTEND_ROUTES } from "@/constants/frontend_routes";

export const useAuthForm = () => {
  // State management
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [showPassword, setShowPassword] =
    useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] =
    useState<boolean>(false);
  const [openotp, setopenotp] = useState(false);
  const [otp, setotp] = useState<string>("");

  const [formData, setFormData] = useState<IFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });

  const [errors, setErrors] = useState<IFormErrors>({});

  // Mutations
  const credentialsMutation = useMutation({
    mutationFn: async () => {
      if (isSignUp) {
        const { email, password, username } = formData;

        return await signUpWithCredentials(
          email,
          password,
          username
        );
      } else {
        const { email, password } = formData;

        return await loginWithCredentials(
          email,
          password
        );
      }
    },

    onSuccess: (data) => {
      if (data.SUCCESS === false) {
        toast.error(data.MESSAGE);
        return;
      } else {
        if (!isSignUp) {
          setTimeout(() => {
            window.location.href =
              FRONTEND_ROUTES.HOME;
          }, 100);
        } else {
          setopenotp(true);
        }
      }
    },

    onError: (error) => {
      toast.error(
        `${isSignUp ? "Sign up" : "Sign in"} error:`,
      );

      const errorMessage =
        error?.message ||
        (isSignUp
          ? "Failed to create account. Please try again."
          : "Invalid credentials. Please check your email and password.");

      toast.error(errorMessage);
    },
  });

  // OTP Mutation
  const checkOtpMutation = useMutation({
    mutationFn: async (otp: string) => {
      const { email } = formData;

      return await checkUserWithOtp(email, otp);
    },

    onSuccess: () => {
      setTimeout(() => {
        window.location.href =
          FRONTEND_ROUTES.HOME;
      }, 1000);
    },

    onError: (error) => {
      toast.error(
        "Invalid OTP. Please try again."
      );
    },
  });

  // Event handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;

    const fieldName =
      name === "emailOrUsername"
        ? "email"
        : name;

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    if (
      errors[fieldName as keyof IFormErrors]
    ) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: undefined,
      }));
    }

    if (errors.general) {
      setErrors((prev) => ({
        ...prev,
        general: undefined,
      }));
    }
  };

  const handleSubmit = async (
    e?: React.FormEvent
  ) => {
    e?.preventDefault();

    const { isValid, errors: validationErrors } =
      validateForm(formData, isSignUp);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      await credentialsMutation.mutateAsync();
    } catch (error) {
      toast.error(
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (): void => {
    setIsSignUp(!isSignUp);

    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
    });

    setErrors({});

    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleOtpVerify = async () => {
    try {
      setIsLoading(true);
      await checkOtpMutation.mutateAsync(otp);
      setopenotp(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    isSignUp,
    showPassword,
    showConfirmPassword,
    isLoading,
    openotp,
    otp,
    formData,
    errors,

    // Setters
    setShowPassword,
    setShowConfirmPassword,
    setIsLoading,
    setopenotp,
    setotp,

    // Handlers
    handleInputChange,
    handleSubmit,
    switchMode,
    handleOtpVerify,
  };
};
