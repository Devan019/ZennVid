"use client";

import { motion } from "framer-motion";
import { useAuthForm } from "./useAuthForm";
import AuthHeader from "./components/AuthHeader";
import AuthFormContainer from "./components/AuthFormContainer";
import OTPVerification from "./components/OTPVerification";

const AuthPages: React.FC = () => {
  const {
    isSignUp,
    showPassword,
    showConfirmPassword,
    isLoading,
    openotp,
    otp,
    formData,
    errors,
    setShowPassword,
    setShowConfirmPassword,
    setIsLoading,
    setopenotp,
    setotp,
    handleInputChange,
    handleSubmit,
    switchMode
  } = useAuthForm();

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
          {/* LEFT - AUTH HEADER */}
          <AuthHeader />

          {/* RIGHT - AUTH FORM CONTAINER */}
          <AuthFormContainer
            isSignUp={isSignUp}
            formData={formData}
            errors={errors}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            isLoading={isLoading}
            setShowPassword={setShowPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onSwitchMode={switchMode}
            setIsLoading={setIsLoading}
          />
        </motion.div>
      </div>

      {/* OTP VERIFICATION DIALOG */}
      <OTPVerification
        open={openotp}
        email={formData.email}
        otp={otp}
        setOtp={setotp}
        onClose={() => setopenotp(false)}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AuthPages;