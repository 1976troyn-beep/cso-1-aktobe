import { motion } from "framer-motion"

export default function SkeletonCard({
  height = "h-[280px]",
  className = "",
}) {
  return (
    <div
      className={`glass-card overflow-hidden rounded-[2rem] ${height} ${className}`}
    >
      <div className="relative h-full overflow-hidden bg-slate-200/70 dark:bg-[#102030]">
        <motion.div
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent dark:via-white/6"
        />

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="h-5 w-40 rounded-full bg-white/40 dark:bg-white/10" />

          <div className="mt-4 h-3 w-full rounded-full bg-white/30 dark:bg-white/8" />

          <div className="mt-2 h-3 w-[82%] rounded-full bg-white/30 dark:bg-white/8" />

          <div className="mt-2 h-3 w-[60%] rounded-full bg-white/30 dark:bg-white/8" />

          <div className="mt-5 h-[2px] w-14 rounded-full bg-white/40 dark:bg-white/10" />
        </div>
      </div>
    </div>
  )
}