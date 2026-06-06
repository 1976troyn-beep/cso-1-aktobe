import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

export default function ImageModal({
  isOpen,
  images = [],
  activeIndex = 0,
  title,
  onClose,
  onPrev,
  onNext,
}) {
  if (typeof document === "undefined") {
    return null
  }

  const activeImage = images[activeIndex]

  return createPortal(
    <AnimatePresence>
      {isOpen && activeImage?.src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/75 p-5 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative flex max-h-[88vh] w-full max-w-6xl items-center justify-center overflow-hidden rounded-[1.6rem] border border-white/15 bg-black shadow-[0_35px_100px_rgba(0,0,0,0.7)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-30 grid h-11 w-11 place-items-center rounded-full bg-black/55 text-white backdrop-blur-md transition hover:bg-black/75"
            >
              <X size={20} />
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={onPrev}
                  className="absolute left-4 top-1/2 z-30 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white backdrop-blur-md transition hover:bg-black/70"
                >
                  <ChevronLeft size={28} />
                </button>

                <button
                  type="button"
                  onClick={onNext}
                  className="absolute right-4 top-1/2 z-30 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white backdrop-blur-md transition hover:bg-black/70"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            <>
              <div
                className="absolute inset-0 scale-110 blur-3xl opacity-40"
                style={{
                  backgroundImage: `url(${activeImage.src})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              />

              <img
                src={activeImage.src}
                alt={title || ""}
                className="relative z-10 max-h-[88vh] w-full object-contain"
              />
            </>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}