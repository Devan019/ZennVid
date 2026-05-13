"use client";

import { motion } from "framer-motion";
import { Mail, User, Eye, EyeOff, Lock, ArrowRight } from "lucide-react";
import { IFormData, IFormErrors } from "../types";
import { INPUT_CLASS } from "../utils";

interface SignUpFormProps {
  formData: IFormData;
  errors: IFormErrors;
  showPassword: boolean;
  showConfirmPassword: boolean;
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  formData,
  showPassword,
  showConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
  isLoading,
  onInputChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* EMAIL */}
      <motion.div
        initial={{
          opacity: 0,
          height: 0,
        }}
        animate={{
          opacity: 1,
          height: "auto",
        }}
        exit={{
          opacity: 0,
          height: 0,
        }}
      >
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
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={onInputChange}
            disabled={isLoading}
            className={INPUT_CLASS}
          />
        </div>
      </motion.div>

      {/* USERNAME */}
      <motion.div
        initial={{
          opacity: 0,
          height: 0,
        }}
        animate={{
          opacity: 1,
          height: "auto",
        }}
        exit={{
          opacity: 0,
          height: 0,
        }}
      >
        <div className="relative">
          <User
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
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={onInputChange}
            disabled={isLoading}
            className={INPUT_CLASS}
          />
        </div>
      </motion.div>

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
      </div>

      {/* CONFIRM PASSWORD */}
      <motion.div
        initial={{
          opacity: 0,
          height: 0,
        }}
        animate={{
          opacity: 1,
          height: "auto",
        }}
        exit={{
          opacity: 0,
          height: 0,
        }}
      >
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
            type={
              showConfirmPassword ? "text" : "password"
            }
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={onInputChange}
            disabled={isLoading}
            className={INPUT_CLASS}
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-black/30
              hover:text-black
            "
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </motion.div>

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
            Create Account
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </motion.button>
    </form>
  );
};

export default SignUpForm;
