"use client";

import { motion } from "framer-motion";
import { PageMeta } from "../types";

interface PageHeaderProps {
  pageMeta: PageMeta;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  pageMeta,
}) => {
  return (
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
        mb-6
        border-b
        border-black/10
        pb-6
        md:mb-10
        md:pb-10
      "
    >
      {/* EYEBROW */}
      <div
        className="
          mb-4
          text-[10px]
          uppercase
          tracking-[0.35em]
          text-black/40
          md:text-[11px]
        "
      >
        {pageMeta.eyebrow}
      </div>

      {/* TITLE */}
      <h1
        className="
          max-w-5xl
          text-[14vw]
          font-medium
          uppercase
          leading-[0.9]
          tracking-[-0.08em]
          text-black

          sm:text-[10vw]
          md:text-[7vw]
          xl:text-[5vw]
        "
      >
        {pageMeta.title}
      </h1>

      {/* DESC */}
      <p
        className="
          mt-4
          max-w-2xl
          text-sm
          leading-relaxed
          text-black/60
          md:mt-6
          md:text-lg
        "
      >
        {pageMeta.description}
      </p>
    </motion.div>
  );
};

export default PageHeader;
