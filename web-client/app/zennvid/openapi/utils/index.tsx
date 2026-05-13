"use client";

import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  ChevronDownIcon,
  ChevronRightIcon,
  Sparkles,
  Terminal,
  Shield,
  Zap,
} from "lucide-react";

interface ApiEndpoint {
  method: string;

  endpoint: string;

  description: string;

  credits: number;

  sampleRequest: object;

  sampleResponse: object;
}

interface ApiDocumentationProps {
  title: string;

  description: string;

  endpoints: ApiEndpoint[];
}

export default function ApiDocumentation({
  title,
  description,
  endpoints,
}: ApiDocumentationProps) {
  const [
    expandedEndpoint,
    setExpandedEndpoint,
  ] = useState<number | null>(
    null
  );

  const headers = {
    "x-app-name":
      "YourAppName",

    Authorization:
      "Bearer YOUR_API_KEY",
  };

  return (
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
        overflow-hidden
        rounded-[40px]
        border
        border-black/10
        bg-white/70
        backdrop-blur-xl
      "
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="
            absolute
            left-[-10%]
            top-[-10%]
            h-[320px]
            w-[320px]
            rounded-full
            bg-black/[0.03]
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            bottom-[-10%]
            right-[-10%]
            h-[320px]
            w-[320px]
            rounded-full
            bg-black/[0.02]
            blur-[120px]
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

      <div className="relative z-10 p-6 md:p-10">
        {/* HEADER */}
        <div
          className="
            mb-10
            border-b
            border-black/10
            pb-8
          "
        >
          <div
            className="
              mb-5
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
              tracking-[0.28em]
              text-black/60
            "
          >
            <Sparkles className="h-4 w-4" />
            API DOCUMENTATION
          </div>

          <p
            className="
              mt-6
              max-w-3xl
              text-base
              leading-relaxed
              text-black/60

              md:text-lg
            "
          >
            {description}
          </p>
        </div>

        {/* ENDPOINTS */}
        <div className="space-y-5">
          {endpoints.map(
            (
              endpoint,
              index
            ) => (
              <motion.div
                key={index}
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
                  overflow-hidden
                  rounded-[30px]
                  border
                  border-black/10
                  bg-white/60
                  backdrop-blur-xl
                "
              >
                {/* TOP */}
                <button
                  onClick={() =>
                    setExpandedEndpoint(
                      expandedEndpoint ===
                        index
                        ? null
                        : index
                    )
                  }
                  className="
                    flex
                    w-full
                    flex-col
                    gap-5
                    p-6
                    text-left
                    transition-all
                    duration-300

                    hover:bg-black/[0.02]

                    md:flex-row
                    md:items-center
                    md:justify-between
                  "
                >
                  {/* LEFT */}
                  <div
                    className="
                      flex
                      flex-col
                      gap-4

                      md:flex-row
                      md:items-center
                    "
                  >
                    {/* METHOD */}
                    <div
                      className={`
                        inline-flex
                        w-fit
                        items-center
                        justify-center
                        rounded-full
                        px-4
                        py-2
                        text-[11px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]

                        ${
                          endpoint.method ===
                          "POST"
                            ? "bg-green-500 text-white"
                            : endpoint.method ===
                                "GET"
                              ? "bg-blue-500 text-white"
                              : "bg-black text-white"
                        }
                      `}
                    >
                      {
                        endpoint.method
                      }
                    </div>

                    {/* INFO */}
                    <div>
                      <code
                        className="
                          break-all
                          text-sm
                          font-medium
                          text-black

                          md:text-base
                        "
                      >
                        {
                          endpoint.endpoint
                        }
                      </code>

                      <p
                        className="
                          mt-2
                          text-sm
                          text-black/50
                        "
                      >
                        {
                          endpoint.description
                        }
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4

                      md:justify-end
                    "
                  >
                    <div
                      className="
                        rounded-full
                        border
                        border-black/10
                        bg-black/[0.03]
                        px-4
                        py-2
                        text-[11px]
                        uppercase
                        tracking-[0.18em]
                        text-black/60
                      "
                    >
                      {
                        endpoint.credits
                      }{" "}
                      Credits
                    </div>

                    {expandedEndpoint ===
                    index ? (
                      <ChevronDownIcon
                        className="
                          h-5
                          w-5
                          text-black/50
                        "
                      />
                    ) : (
                      <ChevronRightIcon
                        className="
                          h-5
                          w-5
                          text-black/50
                        "
                      />
                    )}
                  </div>
                </button>

                {/* EXPANDED */}
                <AnimatePresence>
                  {expandedEndpoint ===
                    index && (
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
                      transition={{
                        duration: 0.3,
                      }}
                      className="
                        border-t
                        border-black/10
                      "
                    >
                      <div className="p-6 md:p-8">
                        {/* DETAILS */}
                        <div
                          className="
                            mb-8
                            grid
                            grid-cols-1
                            gap-5

                            lg:grid-cols-3
                          "
                        >
                          {/* HEADER */}
                          <div
                            className="
                              rounded-3xl
                              border
                              border-black/10
                              bg-white/60
                              p-5
                            "
                          >
                            <div
                              className="
                                mb-3
                                text-[11px]
                                uppercase
                                tracking-[0.25em]
                                text-black/40
                              "
                            >
                              Headers
                            </div>

                            <pre
                              className="
                                overflow-x-auto
                                text-xs
                                leading-7
                                text-black/70
                              "
                            >
                              <code>
                                {JSON.stringify(
                                  headers,
                                  null,
                                  2
                                )}
                              </code>
                            </pre>
                          </div>

                          {/* REQUEST */}
                          <div
                            className="
                              rounded-3xl
                              border
                              border-black/10
                              bg-black
                              p-5
                              text-white
                            "
                          >
                            <div
                              className="
                                mb-3
                                text-[11px]
                                uppercase
                                tracking-[0.25em]
                                text-white/40
                              "
                            >
                              Request
                            </div>

                            <pre
                              className="
                                overflow-x-auto
                                text-xs
                                leading-7
                                text-white/80
                              "
                            >
                              <code>
                                {JSON.stringify(
                                  endpoint.sampleRequest,
                                  null,
                                  2
                                )}
                              </code>
                            </pre>
                          </div>

                          {/* RESPONSE */}
                          <div
                            className="
                              rounded-3xl
                              border
                              border-black/10
                              bg-[#0D0D0D]
                              p-5
                              text-white
                            "
                          >
                            <div
                              className="
                                mb-3
                                text-[11px]
                                uppercase
                                tracking-[0.25em]
                                text-white/40
                              "
                            >
                              Response
                            </div>

                            <pre
                              className="
                                overflow-x-auto
                                text-xs
                                leading-7
                                text-white/80
                              "
                            >
                              <code>
                                {JSON.stringify(
                                  endpoint.sampleResponse,
                                  null,
                                  2
                                )}
                              </code>
                            </pre>
                          </div>
                        </div>

                        {/* CURL */}
                        <div
                          className="
                            overflow-hidden
                            rounded-[28px]
                            border
                            border-black/10
                            bg-black
                          "
                        >
                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              border-b
                              border-white/10
                              px-5
                              py-4
                            "
                          >
                            <div
                              className="
                                text-[11px]
                                uppercase
                                tracking-[0.25em]
                                text-white/50
                              "
                            >
                              Example Request
                            </div>

                            <div
                              className="
                                rounded-full
                                bg-white/10
                                px-3
                                py-1
                                text-[10px]
                                uppercase
                                tracking-[0.18em]
                                text-white/60
                              "
                            >
                              CURL
                            </div>
                          </div>

                          <pre
                            className="
                              overflow-x-auto
                              p-5
                              text-xs
                              leading-7
                              text-white/80
                            "
                          >
                            <code>{`curl -X ${endpoint.method} "${endpoint.endpoint}" \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "x-app-name: YourAppName"`}</code>
                          </pre>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}