"use client";

import { motion } from "framer-motion";
import { Mail, Eye, EyeOff, Lock, ArrowRight } from "lucide-react";
import { IFormData, IFormErrors } from "../types";
import { INPUT_CLASS } from "../utils";

interface SignInFormProps {
  formData: IFormData;
  errors: IFormErrors;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const SignInForm: React.FC<SignInFormProps> = ({
  formData,
  errors,
  showPassword,
  setShowPassword,
  isLoading,
  onInputChange,
  onSubmit,
}) => {
  const fillDemoCredentials = () => {
    const emailEvent = {
      target: {
        name: "emailOrUsername",
        value: "23ceubs023@ddu.ac.in",
      },
    } as React.ChangeEvent<HTMLInputElement>;

    const passwordEvent = {
      target: {
        name: "password",
        value: "ddupassword",
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onInputChange(emailEvent);
    onInputChange(passwordEvent);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* EMAIL */}
      <div className="relative">
        <Mail
          className="
            absolute
            left-4
            top-1/2
            h-5
            w-5
            -translate-y-1/2
            text-black/30
          "
        />

        <input
          type="email"
          name="emailOrUsername"
          placeholder="Email address"
          value={formData.email}
          onChange={onInputChange}
          disabled={isLoading}
          className={inputClass}
        />

        {errors.email && (
          <p className="mt-2 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      {/* PASSWORD */}
      <div className="relative">
        <Lock
          className="
            absolute
            left-4
            top-1/2
            h-5
            w-5
            -translate-y-1/2
            text-black/30
          "
        />

        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={onInputChange}
          disabled={isLoading}
          className={INPUT_CLASS}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-black/30
            hover:text-black
          "
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>

        {errors.password && (
          <p className="mt-2 text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      {/* DEMO CREDENTIALS */}
      <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-black/60">
              Demo Account
            </p>
            <p className="mt-1 text-sm text-black/70">
              23ceubs023@ddu.ac.in
            </p>
            <p className="text-sm text-black/70">
              ddupassword
            </p>
          </div>

          <button
            type="button"
            onClick={fillDemoCredentials}
            disabled={isLoading}
            className="
              rounded-xl
              border
              border-black/10
              px-4
              py-2
              text-sm
              font-medium
              transition
              hover:bg-black
              hover:text-white
            "
          >
            Use Demo
          </button>
        </div>
      </div>

      {/* SUBMIT */}
      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{
          scale: 1.01,
        }}
        whileTap={{
          scale: 0.98,
        }}
        className="
          group
          flex
          h-14
          w-full
          items-center
          justify-center
          gap-3
          rounded-2xl
          bg-black
          text-sm
          font-medium
          uppercase
          tracking-[0.2em]
          text-white
          transition-all
          duration-300
          hover:bg-black/90
        "
      >
        {isLoading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            Loading...
          </>
        ) : (
          <>
            Sign In
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </motion.button>
    </form>
  );
};

const inputClass = INPUT_CLASS;

export default SignInForm;