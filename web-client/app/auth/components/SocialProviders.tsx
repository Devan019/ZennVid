"use client";

import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AUTH_GOOGLE_OAUTH_URI } from "@/constants/backend_routes";
import { Providers } from "@/types/auth";
import { SocialProvider } from "../types";

interface SocialProvidersProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const SocialProviders: React.FC<SocialProvidersProps> = ({
  isLoading,
  setIsLoading,
}) => {
  const router = useRouter();

  const socialProviders: SocialProvider[] = [
    {
      name: "google" as any,
      label: "Continue with Google",
      enabled: true,
      redirectUrl: AUTH_GOOGLE_OAUTH_URI,
    },
  ];

  const handleSocialLogin = async (provider: Providers) => {
    try {
      setIsLoading(true);

      const socialProvider = socialProviders.find(
        (p) => p.name === provider
      );

      switch (provider) {
        case Providers.GOOGLE:
          if (socialProvider?.redirectUrl) {
            router.push(socialProvider.redirectUrl);
          }
          break;

        default:
          toast.error(
            `${provider} login is not implemented yet.`
          );
      }
    } catch (error) {
      toast.error(
        `Failed to login with ${provider}. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8">
      {socialProviders.map((provider) => (
        <motion.button
          key={provider.name}
          type="button"
          onClick={() => handleSocialLogin(provider.name as any)}
          disabled={!provider.enabled || isLoading}
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
          <FaGoogle className="h-5 w-5" />
          {provider.label}
        </motion.button>
      ))}

      <div className="my-8 flex items-center">
        <div className="h-px flex-1 bg-black/10" />

        <span className="px-4 text-sm text-black/40">
          or continue with email
        </span>

        <div className="h-px flex-1 bg-black/10" />
      </div>
    </div>
  );
};

export default SocialProviders;
