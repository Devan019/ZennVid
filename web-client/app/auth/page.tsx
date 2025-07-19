"use client"
import { Providers, signInSchema, signUpSchema } from "@/types/auth";
import { motion, AnimatePresence } from "framer-motion"
import { Mail, User, Shield, EyeOff, Eye, ArrowRight, Lock, InstagramIcon, Facebook } from "lucide-react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { z } from "zod";
import { FaApple, FaGoogle, FaInstagram, FaTwitter } from "react-icons/fa"
import { FaMeta, FaSquareXTwitter, FaX, FaXTwitter } from "react-icons/fa6"
import { useMutation } from "@tanstack/react-query";
import { checkUserWithOtp, loginWithCredentials, loginWithGoogle, signUpWithCredentials } from "@/lib/apiProvider";
import { toast } from "sonner";
import { useAuthStore } from "@/store/UserStore";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { OtpInput } from "@/components/OtpInput";


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

type SignInData = z.infer<typeof signInSchema>;
type SignUpData = z.infer<typeof signUpSchema>;

const AuthPages: React.FC = () => {
  const router = useRouter();

  // State management
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login } = useAuthStore();

  const [openotp, setopenotp] = useState(false)
  const [otp, setotp] = useState<string>("")

  const [formData, setFormData] = useState<IFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });

  const [errors, setErrors] = useState<IFormErrors>({});

  // Mutations
  //google login
  const googleMutation = useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: (redirectUrl) => {
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    },
    onError: (error: any) => {
      console.error("Google login error:", error);
      toast.error("Failed to login with Google. Please try again.");
    },
  });

  // Credentials mutation for sign in and sign up
  const credentialsMutation = useMutation({
    mutationFn: async () => {
      if (isSignUp) {
        // For sign up
        const { email, password, username } = formData;
        return await signUpWithCredentials(email, password, username);
      } else {
        // For sign in
        const { email, password } = formData;
        return await loginWithCredentials(email, password);
      }
    },
    onSuccess: (data) => {
      console.log(`${isSignUp ? 'Sign up' : 'Sign in'} successful:`, data);
      toast.success(`${isSignUp ? 'Send OTP' : 'Welcome back'}!`);
      if (!isSignUp) {
        login(data?.DATA?.user);
        console.log("Redirecting to dashboard...");
        setTimeout(() => {
          router.push("/dashboard");
        },1500);
      } else {
        setopenotp(true)
      }

      // Redirect to dashboard or appropriate page
    },
    onError: (error: any) => {
      console.error(`${isSignUp ? 'Sign up' : 'Sign in'} error:`, error);
      const errorMessage = error?.message ||
        (isSignUp ? "Failed to create account. Please try again." :
          "Invalid credentials. Please check your email and password.");
      toast.error(errorMessage);
    },
  });

  //check otp mutation
  const checkOtpMutation = useMutation({
    mutationFn: async (otp: string) => {
      const { email } = formData;
      return await checkUserWithOtp(email, otp);
    },
    onSuccess: (data) => {
      console.log("OTP verification successful:", data);
      toast.success("OTP verified successfully! redirecting to home page...");
      login(data?.DATA?.user);
      setTimeout(() => {
          router.push("/dashboard");
        },1500);
    },
    onError: (error: any) => {
      console.error("OTP verification error:", error);
      toast.error("Invalid OTP. Please try again.");
    },
  });




  // Event handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    // Handle emailOrUsername for sign in
    const fieldName = name === 'emailOrUsername' ? 'email' : name;

    setFormData(prev => ({ ...prev, [fieldName]: value }));

    // Clear specific field error when user starts typing
    if (errors[fieldName as keyof IFormErrors]) {
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    }

    // Clear general error
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
    }
  };

  const validateForm = (): boolean => {
    try {
      const schema = isSignUp ? signUpSchema : signInSchema;

      // Prepare data for validation
      const dataToValidate = isSignUp
        ? formData
        : { email: formData.email, password: formData.password };

      schema.parse(dataToValidate);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: IFormErrors = {};
        error.errors.forEach(err => {
          const fieldName = err.path[0] as keyof IFormErrors;
          newErrors[fieldName] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await credentialsMutation.mutateAsync();
    } catch (error) {
      // Error is already handled in the mutation
      console.error('Submit error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (): void => {
    setIsSignUp(!isSignUp);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      username: '',
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = (): void => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSocialLogin = async (provider: Providers) => {
    try {
      setIsLoading(true);

      switch (provider) {
        case Providers.GOOGLE:
          await googleMutation.mutateAsync();
          break;
        default:
          toast.error(`${provider} login is not implemented yet.`);
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Social providers configuration
  const socialProviders = [
    {
      name: Providers.GOOGLE,
      icon: FaGoogle,
      color: 'from-red-500 to-yellow-500',
      hoverColor: 'hover:shadow-red-500/20',
      enabled: true
    },
    {
      name: Providers.INSAGRAM,
      icon: FaInstagram,
      color: 'from-pink-500 to-purple-600',
      hoverColor: 'hover:shadow-pink-500/20',
      enabled: false
    },
    {
      name: Providers.META,
      icon: FaMeta,
      color: 'from-blue-600 to-blue-700',
      hoverColor: 'hover:shadow-blue-500/20',
      enabled: false
    },
    {
      name: Providers.X,
      icon: FaXTwitter,
      color: 'from-sky-400 to-sky-600',
      hoverColor: 'hover:shadow-sky-500/20',
      enabled: false
    },
    {
      name: Providers.APPLE,
      icon: FaApple,
      color: 'from-gray-800 to-black',
      hoverColor: 'hover:shadow-gray-500/20',
      enabled: false
    },
  ];

  const iconErrorClass = "-translate-y-[110%]";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl opacity-20"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/4 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl opacity-20"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-1/3 w-64 h-64 bg-pink-500 rounded-full filter blur-3xl opacity-15"
        />
      </div>

      {/* Auth Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500 mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-400">
              {isSignUp
                ? 'Join us and start your creative journey'
                : 'Sign in to access your dashboard'
              }
            </p>
          </motion.div>

          {/* Social Login Buttons */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-8"
          >
            <div className="grid grid-cols-5 gap-3">
              {socialProviders.map((provider, index) => (
                <motion.button
                  key={provider.name}
                  type="button"
                  onClick={() => handleSocialLogin(provider.name)}
                  disabled={!provider.enabled || isLoading}
                  whileHover={provider.enabled && !isLoading ? { scale: 1.05, y: -2 } : {}}
                  whileTap={provider.enabled && !isLoading ? { scale: 0.95 } : {}}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  className={`p-3 rounded-xl bg-gradient-to-r ${provider.color} text-white flex items-center justify-center hover:shadow-lg ${provider.hoverColor} transition-all group relative overflow-hidden ${
                    provider.enabled && !isLoading 
                      ? 'cursor-pointer' 
                      : 'cursor-not-allowed opacity-50'
                  }`}
                  aria-label={`Sign ${isSignUp ? 'up' : 'in'} with ${provider.name}`}
                >
                  <motion.div
                    whileHover={provider.enabled && !isLoading ? { rotate: [0, -10, 10, 0] } : {}}
                    transition={{ duration: 0.6 }}
                  >
                    <provider.icon className="w-5 h-5" />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 bg-white/20 rounded-xl"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={provider.enabled && !isLoading ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              ))}
            </div>

            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gray-600"></div>
              <span className="px-4 text-gray-400 text-sm">or continue with</span>
              <div className="flex-1 h-px bg-gray-600"></div>
            </div>
          </motion.div> */}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field for Sign Up */}
            <AnimatePresence mode="wait">
              {isSignUp && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${errors.email ? iconErrorClass : ""}`} />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.email
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-gray-600 focus:ring-purple-500/20 focus:border-purple-500'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-1"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Username Field for Sign Up */}
            <AnimatePresence mode="wait">
              {isSignUp && (
                <motion.div
                  key="username-signup"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${errors.username ? iconErrorClass : ""}`} />
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.username
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-gray-600 focus:ring-purple-500/20 focus:border-purple-500'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                    {errors.username && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-1"
                      >
                        {errors.username}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email/Username Field for Sign In */}
            <AnimatePresence mode="wait">
              {!isSignUp && (
                <motion.div
                  key="signin-email"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${errors.email ? iconErrorClass : ""}`} />
                    <input
                      type="email"
                      name="emailOrUsername"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.email
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-gray-600 focus:ring-purple-500/20 focus:border-purple-500'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-1"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${errors.password ? iconErrorClass : ""}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.password
                    ? 'border-red-500 focus:ring-red-500/20'
                    : 'border-gray-600 focus:ring-purple-500/20 focus:border-purple-500'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                <motion.button
                  type="button"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                  whileHover={!isLoading ? { scale: 1.1 } : {}}
                  whileTap={!isLoading ? { scale: 0.9 } : {}}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Confirm Password Field for Sign Up */}
            <AnimatePresence mode="wait">
              {isSignUp && (
                <motion.div
                  key="confirmPassword"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${errors.confirmPassword ? iconErrorClass : ""}`} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.confirmPassword
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-gray-600 focus:ring-purple-500/20 focus:border-purple-500'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                    <motion.button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      disabled={isLoading}
                      whileHover={!isLoading ? { scale: 1.1 } : {}}
                      whileTap={!isLoading ? { scale: 0.9 } : {}}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </motion.button>
                    {errors.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-1"
                      >
                        {errors.confirmPassword}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* General Error Message */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3"
              >
                {errors.general}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={`w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/20 transition-all group ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              aria-label={isSignUp ? 'Create new account' : 'Sign in to account'}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <motion.div
                    className="group-hover:translate-x-1 transition-transform"
                    whileHover={{ x: 3 }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </>
              )}
            </motion.button>
          </form>

          {/* Switch Mode */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mt-6"
          >
            <p className="text-gray-400">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <motion.button
                type="button"
                onClick={switchMode}
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.05 } : {}}
                whileTap={!isLoading ? { scale: 0.95 } : {}}
                className={`font-medium ml-2 transition-colors ${isLoading
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-purple-400 hover:text-purple-300 cursor-pointer'
                  }`}
                aria-label={isSignUp ? 'Switch to sign in' : 'Switch to sign up'}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </motion.button>
            </p>
          </motion.div>

          {/* dialog for otp */}
          <Dialog open={openotp} >
            <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <DialogContent className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Verify Your Email
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 text-gray-600 dark:text-gray-300">
                <p className="mb-3">
                  We sent a 6-digit code to <span className="font-medium text-gray-900 dark:text-white">{formData.email}</span>
                </p>
                <p className="mb-6">Please enter it below to continue.</p>

                <div className="flex justify-center gap-3 mb-6">
                  <OtpInput setOtp={setotp} otp={otp} length={6} />
                </div>
              </div>

              <DialogFooter>

                <DialogClose asChild>
                  <button
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"

                    onClick={async () => {
                      await checkOtpMutation.mutateAsync(otp);
                      setopenotp(false);
                    }}
                  >
                    Verify
                  </button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPages;