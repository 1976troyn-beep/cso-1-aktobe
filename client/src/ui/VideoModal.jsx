import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

export default function VideoModal({
  isOpen,
  src,
  poster,
  onClose,
}) {
  return createPortal(
    <AnimatePresence>
      {isOpen && src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/70 p-5 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative w-full max-w-5xl overflow-hidden rounded-[1.6rem] border border-white/15 bg-black shadow-[0_35px_100px_rgba(0,0,0,0.65)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full bg-black/55 text-white backdrop-blur-md transition hover:bg-black/75"
            >
              <X size={20} />
            </button>

            <video
              src={src}
              poster={poster}
              controls
              autoPlay
              className="max-h-[82vh] w-full bg-black object-contain"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
