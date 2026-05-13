"use client";

import { FRONTEND_ROUTES } from "@/constants/frontend_routes";
import { useUser } from "@/context/UserProvider";
import { Stats } from "@/lib/apiProvider";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  AudioLines,
  BookAIcon,
  Languages,
  Plus,
  Sparkles,
  Layers3,
  Cpu,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import CreateApp from "./components/CreateApp";
import CaptionGeneratorPage from "./components/CaptionGenerator";
import TextTranslatorPage from "./components/TextTranslator";
import TextToAudioPage from "./components/TextToAudio";

type OpenApiTab =
  | "dashboard"
  | "apps"
  | "caption-gen"
  | "text-translate"
  | "audio-gen";

const openApiTabs: OpenApiTab[] = [
  "dashboard",
  "apps",
  "caption-gen",
  "text-translate",
  "audio-gen",
];

const isOpenApiTab = (
  hash: string
): hash is OpenApiTab => {
  return openApiTabs.includes(
    hash as OpenApiTab
  );
};

const getTabFromHash =
  (): OpenApiTab => {
    if (
      typeof window === "undefined"
    ) {
      return "dashboard";
    }

    const hashValue =
      window.location.hash.replace(
        /^#/,
        ""
      );

    return isOpenApiTab(hashValue)
      ? hashValue
      : "dashboard";
  };

const apis = [
  {
    name: "Caption Generator",
    description:
      "Generate cinematic captions for videos & reels.",
    icon: BookAIcon,
    href:
      FRONTEND_ROUTES.CAPTION,
    glow:
      "from-blue-500/20 via-cyan-500/10 to-transparent",
    iconBg:
      "bg-gradient-to-br from-blue-500 to-cyan-400",
    tag: "CREATOR API",
  },

  {
    name: "Text Translator",
    description:
      "Translate content across multiple languages.",
    icon: Languages,
    href:
      FRONTEND_ROUTES.TRANSLATE,
    glow:
      "from-emerald-500/20 via-green-500/10 to-transparent",
    iconBg:
      "bg-gradient-to-br from-emerald-500 to-green-400",
    tag: "LANGUAGE AI",
  },

  {
    name: "Text to Audio",
    description:
      "Convert text into natural AI speech.",
    icon: AudioLines,
    href:
      FRONTEND_ROUTES.TEXT_AUDIO,
    glow:
      "from-orange-500/20 via-amber-500/10 to-transparent",
    iconBg:
      "bg-gradient-to-br from-orange-500 to-amber-400",
    tag: "VOICE ENGINE",
  },
];

interface StatsType {
  name: string;

  value: number;
}

function DashboardHome() {
  const [stats, setStats] =
    useState<
      StatsType[] | null
    >(null);

  const {
    isAuthenticated,
  } = useUser();

  const query = useQuery({
    queryKey: ["query"],

    queryFn: async () => {
      const data = await Stats();

      if (!data.SUCCESS) {
        toast.error(data.MESSAGE);

        return;
      }

      return data;
    },
  });

  async function setQuery() {
    let api = await query.data;

    if (!api) {
      api = (
        await query.refetch()
      ).data;
    }

    const sts: StatsType[] = [];

    Object.entries(
      api.DATA
    ).forEach((data) => {
      sts.push({
        name: data[0],

        value:
          Number(data[1]) ??
          0,
      });
    });

    setStats(sts);
  }

  useEffect(() => {
    if (
      isAuthenticated &&
      !stats
    ) {
      setQuery();
    }
  }, [isAuthenticated]);

  return (
    <div className="space-y-10">
      {/* HERO */}
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          relative
          overflow-hidden
          rounded-[40px]
          border
          border-black/10
          bg-white/70
          p-6
          backdrop-blur-xl

          md:p-10
          xl:p-14
        "
      >
        {/* BG */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="
              absolute
              left-[-10%]
              top-[-10%]
              h-[420px]
              w-[420px]
              rounded-full
              bg-black/[0.04]
              blur-[140px]
            "
          />

          <div
            className="
              absolute
              bottom-[-10%]
              right-[-10%]
              h-[420px]
              w-[420px]
              rounded-full
              bg-black/[0.03]
              blur-[140px]
            "
          />

          {/* GRID */}
          <div className="absolute inset-0 opacity-[0.04]">
            <div className="absolute left-1/3 top-0 h-full w-px bg-black" />
            <div className="absolute left-2/3 top-0 h-full w-px bg-black" />
            <div className="absolute left-0 top-1/3 h-px w-full bg-black" />
            <div className="absolute left-0 top-2/3 h-px w-full bg-black" />
          </div>
        </div>

        <div className="relative z-10">
          {/* TOP */}
          <div
            className="
              flex
              flex-col
              gap-10

              xl:flex-row
              xl:items-end
              xl:justify-between
            "
          >
            {/* LEFT */}
            <div className="max-w-4xl">
              <div
                className="
                  mb-6
                  inline-flex
                  items-center
                  gap-3
                  rounded-full
                  border
                  border-black/10
                  bg-black/[0.03]
                  px-5
                  py-3
                  text-[11px]
                  uppercase
                  tracking-[0.25em]
                  text-black/60
                "
              >
                <Sparkles className="h-4 w-4" />
                OPENAPI PLATFORM
              </div>

              <h1
                className="
                  text-[13vw]
                  font-medium
                  uppercase
                  leading-[0.9]
                  tracking-[-0.08em]
                  text-black

                  md:text-[8vw]
                  xl:text-[6vw]
                "
              >
                Build
                <br />
                AI APIs
              </h1>

              <p
                className="
                  mt-8
                  max-w-2xl
                  text-base
                  leading-relaxed
                  text-black/60

                  md:text-lg
                "
              >
                Deploy cinematic AI
                infrastructure with
                generation APIs,
                translation systems,
                audio pipelines, and
                intelligent workflows.
              </p>
            </div>

            {/* ACTIONS */}
            <div
              className="
                flex
                flex-col
                gap-4

                sm:flex-row
              "
            >
              <Link
                href={
                  FRONTEND_ROUTES.APPS
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  rounded-2xl
                  bg-black
                  px-7
                  py-5
                  text-sm
                  uppercase
                  tracking-[0.18em]
                  text-white
                  transition-all
                  duration-300
                  hover:scale-[1.02]
                "
              >
                <Plus className="h-4 w-4" />
                Create App
              </Link>

              <Link
                href={
                  FRONTEND_ROUTES.CAPTION
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  rounded-2xl
                  border
                  border-black/10
                  bg-white/50
                  px-7
                  py-5
                  text-sm
                  uppercase
                  tracking-[0.18em]
                  text-black
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:bg-black
                  hover:text-white
                "
              >
                Explore APIs

                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* FEATURE STRIP */}
          <div
            className="
              mt-12
              grid
              grid-cols-1
              gap-4

              md:grid-cols-3
            "
          >
            {[
              {
                icon: Cpu,
                title:
                  "AI Infrastructure",
              },

              {
                icon: Workflow,
                title:
                  "Workflow Automation",
              },

              {
                icon: Layers3,
                title:
                  "Scalable APIs",
              },
            ].map(
              (
                item,
                index
              ) => (
                <motion.div
                  key={item.title}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index * 0.08,
                  }}
                  className="
                    flex
                    items-center
                    gap-4
                    rounded-3xl
                    border
                    border-black/10
                    bg-white/60
                    p-5
                    backdrop-blur-xl
                  "
                >
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
                    <item.icon className="h-6 w-6" />
                  </div>

                  <div>
                    <p
                      className="
                        text-[11px]
                        uppercase
                        tracking-[0.18em]
                        text-black/40
                      "
                    >
                      System
                    </p>

                    <h3
                      className="
                        mt-1
                        text-lg
                        font-semibold
                        text-black
                      "
                    >
                      {item.title}
                    </h3>
                  </div>
                </motion.div>
              )
            )}
          </div>

          {/* STATS */}
          <div
            className="
              mt-12
              grid
              grid-cols-1
              gap-5

              sm:grid-cols-2
              xl:grid-cols-4
            "
          >
            {stats?.map(
              (
                stat,
                index
              ) => (
                <motion.div
                  key={stat.name}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index * 0.08,
                  }}
                  whileHover={{
                    y: -5,
                  }}
                  className="
                    relative
                    overflow-hidden
                    rounded-[30px]
                    border
                    border-black/10
                    bg-white/60
                    p-7
                    backdrop-blur-xl
                  "
                >
                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-br
                      from-black/[0.02]
                      to-transparent
                    "
                  />

                  <div className="relative z-10">
                    <p
                      className="
                        text-[11px]
                        uppercase
                        tracking-[0.2em]
                        text-black/40
                      "
                    >
                      {stat.name}
                    </p>

                    <h2
                      className="
                        mt-4
                        text-5xl
                        font-semibold
                        tracking-tight
                        text-black
                      "
                    >
                      {stat.value}
                    </h2>
                  </div>
                </motion.div>
              )
            )}
          </div>
        </div>
      </motion.div>

      {/* APIS */}
      <div>
        <div
          className="
            mb-8
            flex
            flex-col
            gap-3

            md:flex-row
            md:items-end
            md:justify-between
          "
        >
          <div>
            <div
              className="
                mb-3
                text-[11px]
                uppercase
                tracking-[0.3em]
                text-black/40
              "
            >
              AI TOOLING
            </div>

            <h2
              className="
                text-4xl
                font-semibold
                tracking-tight
                text-black
              "
            >
              Available APIs
            </h2>
          </div>

          <p
            className="
              max-w-md
              text-sm
              leading-relaxed
              text-black/50
            "
          >
            Powerful developer APIs
            designed for cinematic AI
            workflows and intelligent
            automation systems.
          </p>
        </div>

        <div
          className="
            grid
            grid-cols-1
            gap-6

            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {apis.map(
            (
              api,
              index
            ) => (
              <motion.div
                key={api.name}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    index * 0.1,
                }}
                whileHover={{
                  y: -6,
                }}
              >
                <Link
                  href={api.href}
                  className="
                    group
                    relative
                    block
                    overflow-hidden
                    rounded-[34px]
                    border
                    border-black/10
                    bg-white/70
                    p-8
                    backdrop-blur-xl
                    transition-all
                    duration-500

                    hover:shadow-2xl
                  "
                >
                  {/* GLOW */}
                  <div
                    className={`
                      absolute
                      inset-0
                      opacity-0
                      transition-opacity
                      duration-500
                      group-hover:opacity-100
                      bg-gradient-to-br
                      ${api.glow}
                    `}
                  />

                  <div className="relative z-10">
                    {/* TOP */}
                    <div
                      className="
                        flex
                        items-start
                        justify-between
                      "
                    >
                      <div
                        className={`
                          flex
                          h-16
                          w-16
                          items-center
                          justify-center
                          rounded-2xl
                          shadow-xl
                          ${api.iconBg}
                        `}
                      >
                        <api.icon className="h-7 w-7 text-white" />
                      </div>

                      <ArrowRight
                        className="
                          h-5
                          w-5
                          text-black/30
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                          group-hover:-translate-y-1
                        "
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="mt-10">
                      <div
                        className="
                          mb-3
                          text-[11px]
                          uppercase
                          tracking-[0.2em]
                          text-black/40
                        "
                      >
                        {api.tag}
                      </div>

                      <h3
                        className="
                          text-3xl
                          font-semibold
                          tracking-tight
                          text-black
                        "
                      >
                        {api.name}
                      </h3>

                      <p
                        className="
                          mt-4
                          text-sm
                          leading-7
                          text-black/60
                        "
                      >
                        {api.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default function OpenApiPage() {
  const [activeTab, setActiveTab] =
    useState<OpenApiTab>(
      getTabFromHash
    );

  useEffect(() => {
    const syncTabFromHash = () => {
      setActiveTab(
        getTabFromHash()
      );
    };

    syncTabFromHash();

    window.addEventListener(
      "hashchange",
      syncTabFromHash
    );

    return () => {
      window.removeEventListener(
        "hashchange",
        syncTabFromHash
      );
    };
  }, []);

  const pageMeta = useMemo(() => {
    switch (activeTab) {
      case "apps":
        return {
          eyebrow:
            "APP SYSTEM",
          title:
            "Create Apps",

          description:
            "Launch and manage AI-powered applications with cinematic workflows.",
        };

      case "caption-gen":
        return {
          eyebrow:
            "CAPTION ENGINE",

          title:
            "Caption Generator",

          description:
            "Generate cinematic captions and viral-ready content instantly.",
        };

      case "text-translate":
        return {
          eyebrow:
            "LANGUAGE SYSTEM",

          title:
            "Text Translator",

          description:
            "Translate content across multiple languages using AI.",
        };

      case "audio-gen":
        return {
          eyebrow:
            "VOICE ENGINE",

          title:
            "Text To Audio",

          description:
            "Convert text into natural cinematic AI speech.",
        };

      default:
        return {
          eyebrow:
            "OPENAPI PLATFORM",

          title:
            "OpenAPI",

          description:
            "Developer-first AI infrastructure and cinematic automation tools.",
        };
    }
  }, [activeTab]);

  const tabContent =
    activeTab === "apps" ? (
      <CreateApp />
    ) : activeTab ===
      "caption-gen" ? (
      <CaptionGeneratorPage />
    ) : activeTab ===
      "text-translate" ? (
      <TextTranslatorPage />
    ) : activeTab ===
      "audio-gen" ? (
      <TextToAudioPage />
    ) : (
      <DashboardHome />
    );

  return (
    <div
      className="
        relative
        min-h-screen
        overflow-hidden
      "
    >
      {/* BG */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            left-[10%]
            top-[5%]
            h-[420px]
            w-[420px]
            rounded-full
            bg-black/[0.03]
            blur-[140px]
          "
        />

        <div
          className="
            absolute
            bottom-[5%]
            right-[10%]
            h-[420px]
            w-[420px]
            rounded-full
            bg-black/[0.03]
            blur-[140px]
          "
        />

        {/* GRID */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute left-1/3 top-0 h-full w-px bg-black" />
          <div className="absolute left-2/3 top-0 h-full w-px bg-black" />
          <div className="absolute left-0 top-1/3 h-px w-full bg-black" />
          <div className="absolute left-0 top-2/3 h-px w-full bg-black" />
        </div>
      </div>

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1700px]
          px-4
          py-6

          sm:px-6
          lg:px-10
          xl:px-14
        "
      >
        {/* PAGE HERO */}
        {activeTab !==
          "dashboard" && (
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
              mb-10
              border-b
              border-black/10
              pb-10
            "
            >
              <div
                className="
                mb-5
                text-[11px]
                uppercase
                tracking-[0.35em]
                text-black/40
              "
              >
                {
                  pageMeta.eyebrow
                }
              </div>

              <h1
                className="
                text-[12vw]
                font-medium
                uppercase
                leading-[0.9]
                tracking-[-0.08em]
                text-black

                md:text-[7vw]
              "
              >
                {pageMeta.title}
              </h1>

              <p
                className="
                mt-6
                max-w-2xl
                text-base
                leading-relaxed
                text-black/60
                md:text-lg
              "
              >
                {
                  pageMeta.description
                }
              </p>
            </motion.div>
          )}

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{
              opacity: 0,
              y: 20,
              filter:
                "blur(10px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter:
                "blur(0px)",
            }}
            exit={{
              opacity: 0,
              y: -20,
              filter:
                "blur(10px)",
            }}
            transition={{
              duration: 0.45,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >
            {tabContent}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}