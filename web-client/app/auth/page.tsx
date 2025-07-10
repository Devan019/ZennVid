"use client"
import { Providers, signInSchema, signUpSchema } from "@/types/auth";
import { motion, AnimatePresence } from "framer-motion"
import { Mail, User, Shield, EyeOff, Eye, ArrowRight, Lock, InstagramIcon, Facebook } from "lucide-react"
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { z } from "zod";
import { toast } from "sonner"
import { FaApple, FaGoogle, FaInstagram, FaTwitter } from "react-icons/fa"
import { FaMeta, FaSquareXTwitter, FaX, FaXTwitter } from "react-icons/fa6"

export interface ConformUser {
  username: string;
  email: string;
  role: string;
  password: string;
}

interface IFormData {
  emailOrUsername: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface IFormErrors {
  emailOrUsername?: string;
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
}


type SignInData = z.infer<typeof signInSchema>;
type SignUpData = z.infer<typeof signUpSchema>;

const AuthPages: React.FC = () => {
  const router = useRouter();
  const [signInMode, setSignInMode] = useState<'email' | 'username'>('email')
  const [isSignUp, setIsSignUp] = useState<boolean>(false)
  const [iconError] = useState<string>("-translate-y-[110%]")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [formData, setFormData] = useState<IFormData>({
    emailOrUsername: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<IFormErrors>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name as keyof IFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    try {
      const schema = isSignUp ? signUpSchema : signInSchema
      // console.log(schema, formData)
      schema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: IFormErrors = {}
        error.errors.forEach(err => {
          const fieldName = err.path[0] as keyof IFormErrors
          newErrors[fieldName] = err.message
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      const submissionData = isSignUp
        ? formData as SignUpData
        : {
          email: formData.email,
          username: formData.username,
          password: formData.password,
        } as SignInData



      // Handle form submission here - you can call your API

      // Example: 
      if (isSignUp) {
        
      } else {
        "use server"
        try {
          console.log("get it")
          const result:any = {};

          if (result?.error) {
            // This will be "CredentialsSignin" when authorize returns null
            if (result.error === "CredentialsSignin") {
              toast.error("Invalid credentials. Please check your email/username and password.")
            } else {
              toast.error("An error occurred during sign in. Please try again.")
            }
          } else if (result?.ok) {
            // Success - redirect manually or handle success
            window.location.href = "/" // or use router.push()
          }
        } catch (error) {
          toast.error("user doesn't exit");
        }
      }

    }
  }

  const switchMode = (): void => {
    setIsSignUp(!isSignUp)
    setFormData({
      emailOrUsername: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    })
    setErrors({})
  }
  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = (): void => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  async function handleSocialLogin(name: Providers) {
    // await signIn(name, { redirect: true, callbackUrl: "/dashboard" });
  }

  const socialProviders = [
    { name: Providers.GOOGLE, icon: FaGoogle, color: 'from-red-500 to-yellow-500', hoverColor: 'hover:shadow-red-500/20' },
    { name: Providers.INSAGRAM, icon: FaInstagram, color: 'from-pink-500 to-purple-600', hoverColor: 'hover:shadow-pink-500/20' },
    { name: Providers.META, icon: FaMeta, color: 'from-blue-600 to-blue-700', hoverColor: 'hover:shadow-blue-500/20' },
    { name: Providers.X, icon: FaXTwitter, color: 'from-sky-400 to-sky-600', hoverColor: 'hover:shadow-sky-500/20' },
    { name: Providers.APPLE, icon: FaApple, color: 'from-gray-800 to-black', hoverColor: 'hover:shadow-gray-500/20' },
  ]

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
          <motion.div
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
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  className={`cursor-pointer p-3 rounded-xl bg-gradient-to-r ${provider.color} text-white flex items-center justify-center hover:shadow-lg ${provider.hoverColor} transition-all group relative overflow-hidden`}
                  aria-label={`Sign ${isSignUp ? 'up' : 'in'} with ${provider.name}`}
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.6 }}
                  >
                    <provider.icon className="w-5 h-5" />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 bg-white/20 rounded-xl"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
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
          </motion.div>

          {/* Sign In Mode Toggle */}
          {!isSignUp && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6"
            >
              <div className="flex bg-gray-800/50 rounded-xl p-1 border border-gray-600">
                <motion.button
                  type="button"
                  onClick={() => setSignInMode('email')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`cursor-pointer flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${signInMode === 'email'
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                    }`}
                >
                  Email
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setSignInMode('username')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`cursor-pointer flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${signInMode === 'username'
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                    }`}
                >
                  Username
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <div className="space-y-6">
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
                    <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${errors.email ? iconError : ""}`} />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.email
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-gray-600 focus:ring-purple-500/20 focus:border-purple-500'
                        }`}
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
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${errors.username ? iconError : ""}`} />
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.username
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-gray-600 focus:ring-purple-500/20 focus:border-purple-500'
                        }`}
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
                  key={`signin-${signInMode}`}
                  initial={{ opacity: 0, x: signInMode === 'email' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: signInMode === 'email' ? 20 : -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    {signInMode === 'email' ? (
                      <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${errors.emailOrUsername ? iconError : ""}`} />
                    ) : (
                      <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${errors.emailOrUsername ? iconError : ""}`} />
                    )}
                    <input
                      type={signInMode === 'email' ? 'email' : 'text'}
                      name="emailOrUsername"
                      placeholder={signInMode === 'email' ? 'Email address' : 'Username'}
                      value={formData.emailOrUsername}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.emailOrUsername
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-gray-600 focus:ring-purple-500/20 focus:border-purple-500'
                        }`}
                    />
                    {errors.emailOrUsername && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-1"
                      >
                        {errors.emailOrUsername}
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
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${errors.password ? iconError : ""}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.password
                    ? 'border-red-500 focus:ring-red-500/20'
                    : 'border-gray-600 focus:ring-purple-500/20 focus:border-purple-500'
                    }`}
                />
                <motion.button
                  type="button"
                  onClick={togglePasswordVisibility}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
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
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${errors.confirmPassword ? iconError : ""}`} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.confirmPassword
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-gray-600 focus:ring-purple-500/20 focus:border-purple-500'
                        }`}
                    />
                    <motion.button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
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

            {/* Submit Button */}
            <motion.button
              type="button"
              onClick={handleSubmit}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="cursor-pointer w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/20 transition-all group"
              aria-label={isSignUp ? 'Create new account' : 'Sign in to account'}
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
              <motion.div
                className="group-hover:translate-x-1 transition-transform"
                whileHover={{ x: 3 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.button>
          </div>

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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer text-purple-400 hover:text-purple-300 font-medium ml-2 transition-colors"
                aria-label={isSignUp ? 'Switch to sign in' : 'Switch to sign up'}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </motion.button>
            </p>
          </motion.div>
        </div>

      </motion.div>
    </div>
  )
}

export default AuthPages