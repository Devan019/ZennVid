"use client";

import { motion } from "framer-motion";
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
import { OTPDialogProps } from "../types";

const OTPVerification: React.FC<OTPDialogProps> = ({
  open,
  email,
  otp,
  setOtp,
  isLoading,
}) => {
  return (
    <Dialog open={open}>
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
                {email}
              </p>
            </div>
          </DialogHeader>

          {/* OTP */}
          <div className="mt-10">
            <OtpInput setOtp={setOtp} otp={otp} length={6} />
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
                disabled={isLoading}
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
              disabled:opacity-50
            "
              >
                {isLoading ? "Verifying..." : "Verify"}
              </motion.button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OTPVerification;
