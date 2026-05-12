"use client";

import { Providers, signInSchema, signUpSchema } from "@/types/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  User,
  EyeOff,
  Eye,
  ArrowRight,
  Lock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { FaGoogle } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import {
  checkUserWithOtp,
  loginWithCredentials,
  signUpWithCredentials,
} from "./api";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { OtpInput } from "@/components/common/OtpInput";
import { AUTH_GOOGLE_OAUTH_URI } from "@/constants/backend_routes";
import { FRONTEND_ROUTES } from "@/constants/frontend_routes";

// Types
export interface ConformUser {
  email: string;
  role: string;
  password: string;
  username?: string;
}

interface IFormData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
}

interface IFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  username?: string;
  general?: string;
}

const AuthPages: React.FC = () => {
  const router = useRouter();

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
          }, 1000);
        } else {
          setopenotp(true);
        }
      }
    },

    onError: (error) => {
      console.error(
        `${isSignUp ? "Sign up" : "Sign in"} error:`,
        error
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
      console.error(
        "OTP verification error:",
        error
      );

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

  const validateForm = (): boolean => {
    try {
      const schema = isSignUp
        ? signUpSchema
        : signInSchema;

      const dataToValidate = isSignUp
        ? formData
        : {
          email: formData.email,
          password: formData.password,
        };

      schema.parse(dataToValidate);

      setErrors({});

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: IFormErrors = {};

        error.errors.forEach((err) => {
          const fieldName =
            err.path[0] as keyof IFormErrors;

          newErrors[fieldName] =
            err.message;
        });

        setErrors(newErrors);
      }

      return false;
    }
  };

  const handleSubmit = async (
    e?: React.FormEvent
  ) => {
    e?.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await credentialsMutation.mutateAsync();
    } catch (error) {
      console.error(
        "Submit error:",
        error
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

  const socialProviders = [
    {
      name: Providers.GOOGLE,
      icon: FaGoogle,
      enabled: true,
      redirectUrl: `${AUTH_GOOGLE_OAUTH_URI}`,
    },
  ];

  const handleSocialLogin = async (
    provider: Providers
  ) => {
    try {
      setIsLoading(true);

      const socialProvider =
        socialProviders.find(
          (p) => p.name === provider
        );

      switch (provider) {
        case Providers.GOOGLE:
          if (socialProvider?.redirectUrl) {
            router.push(
              socialProvider.redirectUrl
            );
          }
          break;

        default:
          toast.error(
            `${provider} login is not implemented yet.`
          );
      }
    } catch (error) {
      console.error(
        `${provider} login error:`,
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = `
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-black">
      {/* GRID */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.03]
          [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)]
          [background-size:60px_60px]
        "
      />

      {/* TOP LIGHT */}
      <div
        className="
          absolute
          left-1/2
          top-[-20%]
          h-[600px]
          w-[600px]
          -translate-x-1/2
          rounded-full
          bg-black/5
          blur-3xl
        "
      />

      {/* BOTTOM LIGHT */}
      <div
        className="
          absolute
          bottom-[-10%]
          right-[-10%]
          h-[500px]
          w-[500px]
          rounded-full
          bg-black/5
          blur-3xl
        "
      />

      {/* CONTAINER */}
      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-screen
          w-full
          max-w-7xl
          items-center
          justify-center
          px-6
          py-10
        "
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="
            relative
            grid
            w-full
            max-w-6xl
            overflow-hidden
            rounded-[40px]
            border
            border-black/10
            bg-white/70
            backdrop-blur-2xl
            lg:grid-cols-2
          "
        >
          {/* LEFT */}
          <div
            className="
              relative
              hidden
              flex-col
              justify-between
              overflow-hidden
              border-r
              border-white/10
              bg-black
              p-14
              text-white
              lg:flex
            "
          >
            <div>
              <h1
                className="
                  text-sm
                  font-medium
                  uppercase
                  tracking-[0.4em]
                  text-white/60
                "
              >
                ZENNVID
              </h1>
            </div>

            <div className="max-w-lg">
              <h2
                className="
                  text-6xl
                  font-semibold
                  leading-[0.95]
                  tracking-[-0.05em]
                "
              >
                Create cinematic AI videos.
              </h2>

              <p
                className="
                  mt-6
                  text-lg
                  leading-relaxed
                  text-white/60
                "
              >
                Generate premium AI visuals,
                cinematic edits, and modern
                storytelling workflows.
              </p>
            </div>

            <div
              className="
                flex
                items-center
                gap-3
                text-sm
                text-white/40
              "
            >
              <div className="h-2 w-2 rounded-full bg-white" />
              Trusted by modern creators
            </div>

            <div
              className="
                absolute
                bottom-[-20%]
                left-1/2
                h-[400px]
                w-[400px]
                -translate-x-1/2
                rounded-full
                bg-white/10
                blur-3xl
              "
            />
          </div>

          {/* RIGHT */}
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
                {isSignUp
                  ? "Create account"
                  : "Welcome back"}
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

            {/* SOCIAL */}
            <div className="mb-8">
              {socialProviders.map(
                (provider) => (
                  <motion.button
                    key={provider.name}
                    type="button"
                    onClick={() =>
                      handleSocialLogin(
                        provider.name
                      )
                    }
                    disabled={
                      !provider.enabled ||
                      isLoading
                    }
                    whileHover={{
                      scale: 1.01,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    className="
                      flex
                      h-14
                      w-full
                      items-center
                      justify-center
                      gap-3
                      rounded-2xl
                      border
                      border-black/10
                      bg-white
                      text-sm
                      font-medium
                      text-black
                      transition-all
                      duration-300
                      hover:border-black
                      hover:bg-black
                      hover:text-white
                    "
                  >
                    <provider.icon className="h-5 w-5" />

                    Continue with Google
                  </motion.button>
                )
              )}

              <div className="my-8 flex items-center">
                <div className="h-px flex-1 bg-black/10" />

                <span className="px-4 text-sm text-black/40">
                  or continue with email
                </span>

                <div className="h-px flex-1 bg-black/10" />
              </div>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* EMAIL SIGNUP */}
              <AnimatePresence>
                {isSignUp && (
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
                        onChange={
                          handleInputChange
                        }
                        disabled={isLoading}
                        className={inputClass}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* USERNAME */}
              <AnimatePresence>
                {isSignUp && (
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
                        onChange={
                          handleInputChange
                        }
                        disabled={isLoading}
                        className={inputClass}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* LOGIN EMAIL */}
              {!isSignUp && (
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
                    onChange={
                      handleInputChange
                    }
                    disabled={isLoading}
                    className={inputClass}
                  />
                </div>
              )}

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
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={
                    handleInputChange
                  }
                  disabled={isLoading}
                  className={inputClass}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
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
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* CONFIRM PASSWORD */}
              <AnimatePresence>
                {isSignUp && (
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
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={
                          formData.confirmPassword
                        }
                        onChange={
                          handleInputChange
                        }
                        disabled={isLoading}
                        className={inputClass}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
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
                )}
              </AnimatePresence>

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
                    {isSignUp
                      ? "Create Account"
                      : "Sign In"}

                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>
            </form>

            {/* SWITCH */}
            <div className="mt-8 text-center">
              <p className="text-black/50">
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}

                <button
                  type="button"
                  onClick={switchMode}
                  className="
                    ml-2
                    font-medium
                    text-black
                    transition-opacity
                    hover:opacity-60
                  "
                >
                  {isSignUp
                    ? "Sign In"
                    : "Sign Up"}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* OTP DIALOG */}
      <Dialog open={openotp}>
        {/* OVERLAY */}
        <DialogOverlay
          className="
      fixed
      inset-0
      z-[100]
      bg-black/50
      backdrop-blur-xl
    "
        />

        {/* DIALOG */}
        <DialogContent
          className="
      z-[101]
      w-[92vw]
      max-w-[620px]
      overflow-hidden
      rounded-[32px]
      border
      border-black/10
      bg-white
      p-0
      shadow-[0_40px_120px_rgba(0,0,0,0.25)]
    "
        >
          {/* TOP LIGHT */}
          <div
            className="
        pointer-events-none
        absolute
        inset-x-0
        top-0
        h-[180px]
        bg-gradient-to-b
        from-black/[0.03]
        to-transparent
      "
          />

          {/* BODY */}
          <div
            className="
        relative
        overflow-visible
        sm:px-10
        sm:py-12
       
      "
          >
            {/* HEADER */}
            <DialogHeader className="space-y-5 text-left">
              {/* ICON */}
              <div
                className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-black
            text-white
          "
              >
                <span className="text-xl font-semibold">
                  ✦
                </span>
              </div>

              {/* TITLE */}
              <div>
                <DialogTitle
                  className="
              text-4xl
              font-semibold
              tracking-[-0.06em]
              text-black
            "
                >
                  Verify your email
                </DialogTitle>

                <p
                  className="
              mt-4
              text-base
              leading-relaxed
              text-black/50
            "
                >
                  We sent a 6-digit verification code to
                </p>

                <p
                  className="
              mt-2
              break-all
              text-sm
              font-medium
              text-black
            "
                >
                  {formData.email}
                </p>
              </div>
            </DialogHeader>

            {/* OTP */}
            <div className="mt-10">
              <OtpInput
                setOtp={setotp}
                otp={otp}
                length={6}
              />
            </div>

            {/* INFO */}
            <div
              className="
          mt-7
          flex
          items-center
          justify-center
          gap-2
          text-sm
          text-black/40
        "
            >
              <div className="h-2 w-2 rounded-full bg-black/30" />
              Code expires in 10 minutes
            </div>

            {/* BUTTON */}
            <DialogFooter className="mt-10 w-full">
              <DialogClose asChild>
                <motion.button
                  whileHover={{
                    scale: 1.01,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  onClick={async () => {
                    await checkOtpMutation.mutateAsync(
                      otp
                    );

                    setopenotp(false);
                  }}
                  className="
              flex
              h-14
              w-full
              items-center
              justify-center
              rounded-2xl
              bg-black
              text-sm
              font-medium
              uppercase
              tracking-[0.25em]
              text-white
              transition-all
              duration-300
              hover:bg-black/90
            "
                >
                  Verify
                </motion.button>
              </DialogClose>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuthPages;