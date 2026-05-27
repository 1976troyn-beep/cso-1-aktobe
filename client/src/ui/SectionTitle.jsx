import { motion } from "framer-motion"

export default function SectionTitle({
  badge,
  title,
  text,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 28,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.28,
      }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      className="relative max-w-3xl"
    >
      {/* AMBIENT */}

      <div className="pointer-events-none absolute -left-10 top-0 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-400/6" />

      {/* BADGE */}

      <motion.div
        initial={{
          opacity: 0,
          y: 10,
          scale: 0.96,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.42,
          ease: "easeOut",
        }}
        whileHover={{
          y: -2,
          scale: 1.02,
        }}
        className="group relative inline-flex overflow-hidden rounded-full border border-cyan-200/70 bg-gradient-to-br from-cyan-50 via-cyan-50 to-cyan-100 px-4 py-2 text-sm font-black text-[#0b5cab] shadow-[0_6px_18px_rgba(11,92,171,0.08)] dark:border-cyan-400/10 dark:from-cyan-400/10 dark:via-cyan-400/5 dark:to-blue-500/10 dark:text-cyan-200 dark:shadow-none"
      >
        {/* LIGHT SWEEP */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          <div className="absolute -left-10 top-0 h-full w-8 rotate-12 bg-white/40 opacity-0 blur-xl transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100 dark:bg-cyan-200/10" />
        </div>

        <span className="relative z-10">
          {badge}
        </span>
      </motion.div>

      {/* TITLE */}

      <motion.h2
        initial={{
          opacity: 0,
          y: 16,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.55,
          delay: 0.08,
          ease: "easeOut",
        }}
        className="mt-5 text-[2.2rem] font-black leading-[0.96] tracking-[-0.05em] text-[#12315c] md:mt-6 md:text-5xl dark:text-white"
      >
        <span className="dark:bg-gradient-to-r dark:from-white dark:via-cyan-100 dark:to-cyan-300 dark:bg-clip-text dark:text-transparent">
          {title}
        </span>
      </motion.h2>

      {/* TEXT */}

      <motion.p
        initial={{
          opacity: 0,
          y: 12,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.5,
          delay: 0.14,
          ease: "easeOut",
        }}
        className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-white/70 md:mt-5 md:text-lg md:leading-8"
      >
        {text}
      </motion.p>

      {/* GRADIENT LINE */}

      <motion.div
        initial={{
          opacity: 0,
          scaleX: 0.6,
        }}
        whileInView={{
          opacity: 1,
          scaleX: 1,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.55,
          delay: 0.18,
          ease: "easeOut",
        }}
        className="mt-6 h-[2px] w-16 origin-left rounded-full brand-gradient md:mt-7 md:w-20"
      />
    </motion.div>
  )
}