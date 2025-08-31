"use client";
import { useUser } from "@/context/UserProvider";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";

const plans = [
  {
    name: "Micro",
    price: "₹100 (300 credits)",
    description: "A great starting point for small creators.",
    highlight: false,
    credits: 300,
  },
  {
    name: "Starter",
    price: "₹150 (510 credits)",
    description: "For those who need a little more power.",
    // features: [
    //   "17 videos",
    //   "All video styles",
    //   "Priority support",
    //   "Voice cloning (XTTS)",
    // ],
    highlight: true,
  },
  {
    name: "Pro Lite",
    price: "₹200 (600 credits)",
    description: "For serious creators who need a little more flexibility.",
    // features: [
    //   "30 videos",
    //   "All video styles",
    //   "Priority support",
    //   "Voice cloning (XTTS)",
    //   "Dedicated server",
    // ],
    highlight: false,
  },
];

export default function PricingComponent() {

  const {isAuthenticated}  =useUser()

  const handlePurchase = (plan:any) => {
    if(!isAuthenticated){
      return redirect("/auth")
    }

    // Integrate RazorPay payment gateway
    fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: plan.price.replace("₹", "").split(".")[0] * 100,
        currency_id: "INR",
        payment_id: Math.random().toString(36).substr(2, 10),
        order_id: Math.random().toString(36).substr(2, 10),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle successful payment
        console.log(data);
        alert("Payment successful!");
      })
      .catch((error) => {
        // Handle failed payment
        console.error(error);
        alert("Payment failed. Please try again.");
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <motion.h1
          className="text-4xl font-extrabold text-gray-800 dark:text-white mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Pricing Plans
        </motion.h1>
        <motion.p
          className="text-lg text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Choose the plan that fits your needs. Upgrade or downgrade anytime.
        </motion.p>
      </div>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            className={`flex-1 rounded-2xl shadow-xl p-8 flex flex-col border-2 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-gray-100 dark:border-gray-700 transition-all duration-300 ${plan.highlight
                ? "border-purple-500 scale-105 z-10 shadow-2xl dark:shadow-purple-900/30"
                : ""
              }`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + plans.indexOf(plan) * 0.15, duration: 0.5 }}
            whileHover={{
              scale: 1.045,
              boxShadow: "0 8px 32px rgba(120,0,200,0.16)",
            }}
          >
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
              {plan.name}
            </h2>
            <div className="text-3xl font-extrabold mb-4 text-purple-600 dark:text-purple-400">
              {plan.price}
            </div>
            <p className="mb-6 text-gray-500 dark:text-gray-300">
              {plan.description}
            </p>
            <ul className="mb-8 space-y-2 text-left">
              {/* {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <span className="inline-block w-2 h-2 bg-purple-400 dark:bg-purple-500 rounded-full mr-3" />
                  <span className="text-gray-700 dark:text-gray-200">
                    {feature}
                  </span>
                </li>
              ))} */}
            </ul>
            <button
              className={`mt-auto px-6 py-2 rounded-lg font-semibold transition text-base shadow-sm ${plan.price.toString() === plan.credits?.toString()
                  ? "bg-gradient-to-r from-purple-600 to-indigo-500 text-white hover:from-purple-700 hover:to-indigo-600"
                  : plan.highlight
                      ? "bg-purple-400 scale-105 z-10 shadow-2xl dark:shadow-purple-900/30"
                      : ""
                }`}
              onClick={() => handlePurchase(plan)}
            >
              {plan.price.toString() === plan.credits?.toString()
                ? "Get Credits"
                : plan.price === "₹0"
                  ? "Claim Free Credits"
                  : "Choose Pro"}
            </button>
          </motion.div>
        ))}
      </div>
      <div className="mt-16 flex justify-center">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          All prices in Indian Rupees. Taxes may apply. Contact us for enterprise details.
        </span>
      </div>
    </div>
  );
}
