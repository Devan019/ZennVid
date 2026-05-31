"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { FRONTEND_ROUTES } from "@/constants/frontend_routes";
import Link from "next/link";

export function Footer() {
  const productItems = [
    {
      label: "Magic Studio",
      href: FRONTEND_ROUTES.MAGICSTUDIO,
    },
    {
      label: "Sync Studio",
      href: FRONTEND_ROUTES.SYNCSTUDIO,
    },
    {
      label: "Anime Twin",
      href: FRONTEND_ROUTES.ANIMETWIN,
    },
    {
      label: "Feed",
      href: FRONTEND_ROUTES.FEED,
    },
    {
      label: "Openapi",
      href: FRONTEND_ROUTES.OPENAPI,
    },
  ];


  const companyItems = [
    {
      label: "About",
      href: FRONTEND_ROUTES.About,
    },
    {
      label: "Contact",
      href: FRONTEND_ROUTES.Contact,
    },
  ];
  return (
    <footer className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* BACKGROUND GLOW */}
      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[700px]
          w-[700px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-blue-500/10
          blur-[180px]
        "
      />

      {/* GRID */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-[5%] top-0 h-full w-px border-l border-dashed border-white/10" />
        <div className="absolute right-[5%] top-0 h-full w-px border-l border-dashed border-white/10" />
        <div className="absolute top-[20%] left-0 h-px w-full border-t border-dashed border-white/10" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex min-h-screen flex-col justify-between px-6 py-20 md:px-10">
        {/* TOP */}
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-4">
          {/* BRAND */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >

            <div>
              <h2 className="text-3xl font-semibold uppercase tracking-tight">
                Zennvid
              </h2>

              <p className="mt-6 max-w-sm text-lg leading-relaxed text-white/50">
                Cinematic AI video generation
                for creators, dreamers,
                and impossible ideas.
              </p>
            </div>

            {/* SOCIALS */}
            {/* <div className="flex gap-4">

              {[
                Twitter,
                Instagram,
                Youtube,
                Linkedin,
              ].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{
                    scale: 1.1,
                    y: -4,
                  }}
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    backdrop-blur-xl
                    transition-all
                    duration-500
                    hover:border-white/20
                    hover:bg-white/10
                  "
                >
                  <Icon className="h-5 w-5 text-white/70" />
                </motion.a>
              ))}
            </div> */}
          </motion.div>

          {/* PRODUCT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.1,
            }}
            viewport={{ once: true }}
          >

            <h3 className="mb-8 text-sm uppercase tracking-[0.3em] text-white/40">
              Product
            </h3>

            <ul className="space-y-5 text-lg text-white/70">
              {productItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="
          transition-all
          duration-300
          hover:text-white
        "
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* COMPANY */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.2,
            }}
            viewport={{ once: true }}
          >

            <h3 className="mb-8 text-sm uppercase tracking-[0.3em] text-white/40">
              Company
            </h3>

            <ul className="space-y-5 text-lg text-white/70">
              {companyItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="
          transition-all
          duration-300
          hover:text-white
        "
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* NEWSLETTER */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.3,
            }}
            viewport={{ once: true }}
            className="space-y-8"
          >

            <div>

              <h3 className="text-sm uppercase tracking-[0.3em] text-white/40">
                Stay Updated
              </h3>

              <p className="mt-6 text-lg leading-relaxed text-white/50">
                Get updates about AI video,
                cinematic tools, and future releases.
              </p>
            </div>

            {/* INPUT */}
            <div className="space-y-4">
              <Input
                placeholder="Enter your email"
                className="
                  h-14
                  rounded-2xl
                  border-white/10
                  bg-white/5
                  text-white
                  placeholder:text-white/30
                "
              />

              <Button
                className="
                  h-14
                  w-full
                  rounded-2xl
                  bg-white
                  text-black
                  transition-all
                  duration-500
                  hover:scale-[1.02]
                  hover:bg-white/90
                "
              >
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>

        {/* CONTACT */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{
            duration: 1,
            delay: 0.4,
          }}
          viewport={{ once: true }}
          className="
            mt-20
            flex
            flex-col
            gap-6
            border-t
            border-white/10
            py-10
            text-white/50
            md:flex-row
            md:items-center
            md:justify-between
          "
        >

          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5" />
            <span>devanchauhan012@gmail.com</span>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5" />
            <span>+91 90232 40018</span>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5" />
            <span>Nadiad, Gujarat, India</span>
          </div>
        </motion.div>

        {/* HUGE TEXT */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          viewport={{ once: true }}
          className="relative mt-10"
        >

          <h1
            className="
              text-center
              text-[22vw]
              font-black
              uppercase
              leading-none
              tracking-[-0.08em]
              text-white
            "
          >
            ZENNVID
          </h1>
        </motion.div>

        {/* BOTTOM */}
        <div
          className="
            mt-6
            flex
            flex-col
            items-center
            justify-between
            gap-4
            border-t
            border-white/10
            pt-6
            text-sm
            uppercase
            tracking-[0.2em]
            text-white/30
            md:flex-row
          "
        >

          <p>© 2026 Zennvid. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}