"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

interface OtpInputProps {
  length?: number;
  otp?: string;
  setOtp: (otp: string) => void;
}

export const OtpInput = ({
  length = 6,
  setOtp,
}: OtpInputProps) => {
  const inputsRef = useRef<
    (HTMLInputElement | null)[]
  >([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    // Allow only numbers
    if (value && !/^[0-9]$/.test(value)) {
      e.target.value = "";
      return;
    }

    // Move focus
    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    const newOtp = inputsRef.current
      .map((input) => input?.value || "")
      .join("");

    setOtp(newOtp);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Backspace focus
    if (
      e.key === "Backspace" &&
      !e.currentTarget.value &&
      index > 0
    ) {
      inputsRef.current[index - 1]?.focus();
    }

    // Enter submit
    if (e.key === "Enter") {
      e.preventDefault();

      const newOtp = inputsRef.current
        .map((input) => input?.value || "")
        .join("");

      setOtp(newOtp);
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    const pasteData = e.clipboardData
      .getData("text/plain")
      .slice(0, length);

    pasteData.split("").forEach((char, i) => {
      if (
        inputsRef.current[i] &&
        /^[0-9]$/.test(char)
      ) {
        inputsRef.current[i]!.value = char;

        if (i < length - 1) {
          inputsRef.current[i + 1]?.focus();
        }
      }
    });

    const newOtp = inputsRef.current
      .map((input) => input?.value || "")
      .join("");

    setOtp(newOtp);
  };

  return (
    <div
      className="
        flex
        w-full
        items-center
        justify-center
        gap-2
        overflow-x-auto
        px-1
        sm:gap-4
      "
    >
      {[...Array(length)].map((_, i) => (
        <motion.input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          autoFocus={i === 0}
          onChange={(e) =>
            handleChange(e, i)
          }
          onKeyDown={(e) =>
            handleKeyDown(e, i)
          }
          onPaste={handlePaste}
          whileFocus={{
            scale: 1.05,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          className="
            h-12
            w-12
            min-w-12
            rounded-2xl
            border
            border-black/10
            bg-black/[0.02]
            text-center
            text-lg
            font-semibold
            tracking-[0.08em]
            text-black
            outline-none
            transition-all
            duration-300
            focus:border-black
            focus:bg-white
            focus:shadow-[0_0_0_4px_rgba(0,0,0,0.04)]

            xs:h-14
            xs:w-14
            xs:min-w-14
            xs:text-xl

            sm:h-16
            sm:w-16
            sm:min-w-16
            sm:text-2xl

            md:h-20
            md:w-20
            md:min-w-20
            md:text-3xl
          "
        />
      ))}
    </div>
  );
};