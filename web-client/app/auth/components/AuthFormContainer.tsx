"use client";

import { motion, AnimatePresence } from "framer-motion";
import SocialProviders from "./SocialProviders";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import FormToggle from "./FormToggle";
import { IFormData, IFormErrors } from "../types";

interface AuthFormContainerProps {
  isSignUp: boolean;
  formData: IFormData;
  errors: IFormErrors;
  showPassword: boolean;
  showConfirmPassword: boolean;
  isLoading: boolean;
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onSwitchMode: () => void;
  setIsLoading: (loading: boolean) => void;
}

const AuthFormContainer: React.FC<AuthFormContainerProps> = ({
  isSignUp,
  formData,
  errors,
  showPassword,
  showConfirmPassword,
  isLoading,
  setShowPassword,
  setShowConfirmPassword,
  onInputChange,
  onSubmit,
  onSwitchMode,
  setIsLoading,
}) => {
  return (
    <div
      className="
        flex
        flex-col
        justify-center
        px-8
        py-16
        sm:px-14
      "
    >
      {/* HEADING */}
      <div className="mb-10">
        <motion.h1
          layout
          className="
            text-5xl
            font-semibold
            tracking-[-0.05em]
            text-black
          "
        >
          {isSignUp ? "Create account" : "Welcome back"}
        </motion.h1>

        <p
          className="
            mt-4
            max-w-md
            text-base
            leading-relaxed
            text-black/50
          "
        >
          {isSignUp
            ? "Start creating cinematic AI content in minutes."
            : "Continue building with Zennvid."}
        </p>
      </div>

      {/* SOCIAL PROVIDERS */}
      <SocialProviders
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />

      {/* FORMS */}
      <AnimatePresence mode="wait">
        {isSignUp ? (
          <SignUpForm
            key="signup"
            formData={formData}
            errors={errors}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            setShowPassword={setShowPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            isLoading={isLoading}
            onInputChange={onInputChange}
            onSubmit={onSubmit}
          />
        ) : (
          <SignInForm
            key="signin"
            formData={formData}
            errors={errors}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            isLoading={isLoading}
            onInputChange={onInputChange}
            onSubmit={onSubmit}
          />
        )}
      </AnimatePresence>

      {/* FORM TOGGLE */}
      <FormToggle isSignUp={isSignUp} onToggle={onSwitchMode} />
    </div>
  );
};

export default AuthFormContainer;
