import { motion } from "framer-motion"

export default function StatCard({ value, text, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ y: -6, scale: 1.018 }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 19,
      }}
      className="glass-card group relative overflow-hidden rounded-[1.7rem] px-5 py-4"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.7rem]">
        <div className="absolute -left-12 top-0 h-full w-20 rotate-12 bg-white/12 opacity-0 blur-2xl transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100 dark:bg-cyan-300/10" />
      </div>

      <div className="relative flex items-center gap-4">
        <motion.div
          whileHover={{ rotate: 6, scale: 1.06 }}
          transition={{ duration: 0.25 }}
          className="brand-icon grid h-12 w-12 shrink-0 place-items-center rounded-full text-white shadow-[0_10px_25px_rgba(5,169,157,0.25)]"
        >
          {icon}
        </motion.div>

        <div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05, duration: 0.45 }}
            className="text-2xl font-black leading-none tracking-tight text-[#12315c] dark:bg-gradient-to-r dark:from-[#58b4ff] dark:to-[#3ce6d8] dark:bg-clip-text dark:text-transparent dark:drop-shadow-[0_0_16px_rgba(5,169,157,0.18)]"
          >
            {value}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.45 }}
            className="mt-1 text-sm leading-5 text-slate-600 dark:text-white/72"
          >
            {text}
          </motion.p>
        </div>
      </div>
    </motion.div>
  )
}