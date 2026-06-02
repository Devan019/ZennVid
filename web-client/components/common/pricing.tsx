"use client";

import { paymentStream } from "@/constants/backend_routes";
import { useUser } from "@/context/UserProvider";
import { createOrder } from "@/lib/apiProvider";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Crown,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const plans = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    amount: 0,
    credits: 40,
    icon: Sparkles,
    description:
      "Start creating with 2 free AI video generations.",
    highlight: false,
    free: true,
  },

  {
    id: "starter",
    name: "Starter",
    price: "₹29",
    amount: 29,
    credits: 200,
    icon: Zap,
    description:
      "Perfect for trying cinematic AI generation.",
    highlight: false,
  },

  {
    id: "creator",
    name: "Creator",
    price: "₹79",
    amount: 79,
    credits: 500,
    icon: Sparkles,
    description:
      "Best for active creators generating regularly.",
    highlight: true,
  },

  {
    id: "pro",
    name: "Pro",
    price: "₹149",
    amount: 149,
    credits: 1000,
    icon: Crown,
    description:
      "For power users and cinematic workflows.",
    highlight: false,
  },
];

export default function PricingComponent() {
  const {
    isAuthenticated,
    user,
    resetUser,
  } = useUser();

  const [rzpInstance, setRzpInstance] =
    useState<any>(null);

  const [
    isVerifyingPayment,
    setIsVerifyingPayment,
  ] = useState(false);

  const orderMutation = useMutation({
    mutationKey: ["create-order"],

    mutationFn: async ({
      planId,
    }: {
      planId: string;
    }) => {
      return await createOrder({
        planId,
      });
    },
  });

  useEffect(() => {
    if (rzpInstance) {
      rzpInstance.open();
    }
  }, [rzpInstance]);

  useEffect(() => {
    const script =
      document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePurchase = async (
    plan: any
  ) => {
    if (!isAuthenticated) {
      return redirect("/auth");
    }

    // FREE PLAN
    if (plan.free) {
      toast.success(
        "40 free credits added successfully!"
      );

      return;
    }

    const response =
      await orderMutation.mutateAsync({
        planId: plan.id,
      });

    if (!response.SUCCESS) {
      toast.error(response.MESSAGE);

      return;
    }

    const { orderId, amount, currency } =
      response.DATA;

    const key =
      process.env.NEXT_PUBLIC_RAZORPAY_KEY;

    if (!key) return;

    const options = {
      key,
      amount,
      currency,
      order_id: orderId,

      name: "ZennVid",

      description: `${plan.credits} Credits Purchase`,

      theme: {
        color: "#000000",
      },

      prefill: {
        name:
          user?.username || "Customer",

        email:
          user?.email ||
          "customer@example.com",
      },

      handler: function (
        response: any
      ) {
        toast.success(
          "Payment successful. Updating credits..."
        );

        setIsVerifyingPayment(true);

        const paymentId =
          response.razorpay_payment_id;

        const eventSource =
          new EventSource(
            `${paymentStream}/${paymentId}`,
            {
              withCredentials: true,
            }
          );

        eventSource.onmessage =
          async (event) => {
            const data = JSON.parse(
              event.data
            );

            console.log(
              "SSE DATA:",
              data
            );

            if (data.success) {
              toast.success(
                "Credits updated successfully"
              );

              await resetUser();

              setIsVerifyingPayment(
                false
              );

              eventSource.close();
            } else {
              toast.error(
                "Payment verification failed"
              );

              setIsVerifyingPayment(
                false
              );

              eventSource.close();
            }
          };

        eventSource.onerror = () => {
          toast.error(
            "Connection lost while verifying payment"
          );

          setIsVerifyingPayment(
            false
          );

          eventSource.close();
        };
      },
    };

    const rzp =
      new window.Razorpay(options);

    rzp.on(
      "payment.failed",
      (response: { error: any }) => {
        console.error(response.error);

        toast.error(
          "Payment failed. Please try again."
        );
      }
    );

    setRzpInstance(rzp);
  };

  return (
    <div className="min-h-screen px-4 py-36">
      {/* PAYMENT LOADER */}
      {isVerifyingPayment && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-xl">
          <div className="flex w-[340px] flex-col items-center rounded-[32px] border border-white/10 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-2xl">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-white/10" />

              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-white" />

              <Sparkles className="h-6 w-6" />
            </div>

            <h2 className="mt-6 text-2xl font-semibold">
              Verifying Payment
            </h2>

            <p className="mt-3 text-center text-sm leading-relaxed text-white/70">
              Please wait while we securely
              verify your payment and update
              your credits.
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-10">
        {/* HERO */}
        <div className="overflow-hidden rounded-[30px] border border-black/10 bg-gradient-to-br from-white to-[#F8F6F1] p-7 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* LEFT */}
            <div className="max-w-xl">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                  <Sparkles className="h-4 w-4" />
                </div>

                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/50">
                  ZennVid Credits
                </p>
              </div>

              <h1 className="text-3xl font-semibold leading-tight text-black lg:text-4xl">
                AI Video Credits
              </h1>

              <p className="mt-3 max-w-lg text-sm leading-relaxed text-black/60 lg:text-base">
                Generate cinematic AI videos with
                flexible creator-friendly pricing.
              </p>

              {/* FREE BADGE */}
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs backdrop-blur-xl">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />

                <span className="font-medium text-black">
                  40 free credits for new users
                </span>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white/70 px-5 py-4 backdrop-blur-xl">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />

              <div>
                <p className="text-sm font-medium text-black">
                  Secure Payments
                </p>

                <p className="text-xs text-black/50">
                  Powered by Razorpay
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PLANS */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {plans.map((plan, index) => {
            const Icon = plan.icon;

            return (
              <motion.div
                key={plan.id}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.12,
                }}
                whileHover={{
                  y: -6,
                }}
                className={`relative overflow-hidden rounded-[32px] border p-8 backdrop-blur-xl transition-all duration-300 ${plan.highlight
                  ? "border-black bg-black text-white shadow-2xl"
                  : "border-black/10 bg-white/70"
                  }`}
              >
                {plan.highlight && (
                  <div className="absolute right-5 top-5 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-black">
                    Most Popular
                  </div>
                )}

                {/* ICON */}
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${plan.highlight
                    ? "bg-white/10"
                    : "bg-[#F8F6F1]"
                    }`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                {/* TITLE */}
                <div className="mt-8">
                  <h2 className="text-3xl font-semibold">
                    {plan.name}
                  </h2>

                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-5xl font-bold">
                      {plan.price}
                    </span>

                    <span
                      className={`pb-1 text-sm ${plan.highlight
                        ? "text-white/60"
                        : "text-black/50"
                        }`}
                    >
                      one-time
                    </span>
                  </div>

                  <p
                    className={`mt-5 leading-relaxed ${plan.highlight
                      ? "text-white/70"
                      : "text-black/60"
                      }`}
                  >
                    {plan.description}
                  </p>
                </div>

                {/* CREDITS */}
                <div
                  className={`mt-8 rounded-2xl border p-5 ${plan.highlight
                    ? "border-white/10 bg-white/5"
                    : "border-black/10 bg-[#F8F6F1]"
                    }`}
                >
                  <p
                    className={`text-xs uppercase tracking-[0.18em] ${plan.highlight
                      ? "text-white/50"
                      : "text-black/40"
                      }`}
                  >
                    Included Credits
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <Sparkles className="h-5 w-5" />

                    <span className="text-3xl font-bold">
                      {plan.credits}
                    </span>
                  </div>

                  <div
                    className={`mt-4 rounded-xl px-4 py-3 ${plan.highlight
                      ? "bg-white/5"
                      : "bg-black/[0.03]"
                      }`}
                  >
                    <p
                      className={`text-sm ${plan.highlight
                        ? "text-white/70"
                        : "text-black/60"
                        }`}
                    >
                      ~
                      <span className="font-semibold">
                        {Math.floor(
                          plan.credits / 20
                        )}
                      </span>{" "}
                      AI video generations
                    </p>

                    <p
                      className={`mt-1 text-xs ${plan.highlight
                        ? "text-white/40"
                        : "text-black/40"
                        }`}
                    >
                      20 credits per video
                    </p>
                  </div>
                </div>

                {/* BUTTON */}
                {plan.free ? (
                  <div
                    className="
      mt-10 flex h-14 w-full items-center justify-center
      rounded-2xl border border-emerald-200
      bg-emerald-50
      text-sm font-semibold uppercase tracking-[0.15em]
      text-emerald-700
    "
                  >
                    Free Credits Claimed
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      handlePurchase(plan)
                    }
                    className={`mt-10 h-14 w-full rounded-2xl text-sm font-semibold uppercase tracking-[0.15em] transition-all ${plan.highlight
                      ? "bg-white text-black hover:opacity-90"
                      : "border border-black/10 bg-black text-white hover:opacity-90"
                      }`}
                  >
                    {plan.free
                      ? "Claim Free Credits"
                      : "Buy Credits"}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* FOOTER NOTE */}
        <div className="flex items-center justify-center">
          <p className="text-center text-sm text-black/40">
            All prices are in INR. Taxes
            may apply depending on your
            region.
          </p>
        </div>
      </div>
    </div>
  );
}