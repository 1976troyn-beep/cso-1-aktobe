import ImageModal from "./ImageModal"
import VideoModal from "./VideoModal"
import { useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Play,
  Maximize2,
} from "lucide-react"

export default function MediaSlider({
  images = [],
  media,
  title,
  text,
  className = "",
  enableImageModal = false,
}) {
  const videoRef = useRef(null)

  const preparedMedia =
    media && media.length > 0
      ? media
      : images.map((src) => ({
          type: "image",
          src,
        }))

  const [activeIndex, setActiveIndex] = useState(0)
  const [initialLoaded, setInitialLoaded] = useState(false)

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  const hasMedia = preparedMedia.length > 0
  const hasMultiple = preparedMedia.length > 1
  const activeMedia = preparedMedia[activeIndex]

  function goToSlide(index) {
    setActiveIndex(index)
  }

  function prevSlide() {
    setActiveIndex((current) =>
      current === 0 ? preparedMedia.length - 1 : current - 1
    )
  }

  function nextSlide() {
    setActiveIndex((current) =>
      current === preparedMedia.length - 1 ? 0 : current + 1
    )
  }

  function handleMediaTap() {
    if (
      typeof window !== "undefined" &&
      window.innerWidth < 768 &&
      hasMultiple &&
      activeMedia?.type !== "video"
    ) {
      nextSlide()
    }
  }

  function handleDragEnd(_, info) {
    if (!hasMultiple) return

    if (info.offset.x < -45 || info.velocity.x < -420) {
      nextSlide()
    }

    if (info.offset.x > 45 || info.velocity.x > 420) {
      prevSlide()
    }
  }

  function openFullscreen() {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      const video = videoRef.current
      if (!video) return

      if (video.requestFullscreen) {
        video.requestFullscreen()
      } else if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen()
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen()
      }

      return
    }

    setIsVideoModalOpen(true)
  }

  const instantVariants = {
    initial: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.24 }}
      className={`group overflow-hidden rounded-[1.25rem] border border-white/65 bg-white/78 shadow-[0_18px_52px_rgba(18,49,92,0.12)] backdrop-blur-[18px] transition dark:border-white/10 dark:bg-[#081826]/82 dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)] md:rounded-[2rem] ${className}`}
    >
      <motion.div
        drag={hasMultiple ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.08}
        onDragEnd={handleDragEnd}
        onClick={handleMediaTap}
        className="relative h-[300px] touch-pan-y overflow-hidden sm:h-[340px] md:h-[390px]"
      >
        {!initialLoaded && hasMedia && (
          <div className="absolute inset-0 z-10 overflow-hidden bg-[#071827]">
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent" />
          </div>
        )}

        {hasMedia ? (
          <AnimatePresence mode="sync" initial={false}>
            {activeMedia.type === "video" ? (
              <motion.div
                key={activeMedia.src}
                variants={instantVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0, ease: "linear" }}
                className="relative h-full w-full"
              >
                <video
                  ref={videoRef}
                  key={activeMedia.src}
                  src={activeMedia.src}
                  className="!h-full !w-full object-cover"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  webkit-playsinline="true"
                  preload="auto"
                  poster={activeMedia.preview || activeMedia.src}
                  onCanPlay={() => setInitialLoaded(true)}
                  onLoadedData={() => setInitialLoaded(true)}
                />

                <div className="absolute right-4 top-4 z-20 inline-flex items-center gap-2 rounded-full bg-black/35 px-3 py-1 text-[10px] font-black text-white backdrop-blur-md">
                  <Play size={11} />
                  Видео
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (activeMedia?.type === "video") {
                      openFullscreen()
                      return
                    }

                    if (enableImageModal && window.innerWidth >= 768) {
                      setIsImageModalOpen(true)
                    }
                  }}
                  className="absolute left-4 top-4 z-30 grid h-10 w-10 place-items-center rounded-full bg-black/35 text-white backdrop-blur-md transition hover:bg-black/50"
                >
                  <Maximize2 size={17} />
                </button>
              </motion.div>
            ) : (
              <motion.img
                key={activeMedia.src}
                src={activeMedia.src}
                alt={title}
                variants={instantVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0, ease: "linear" }}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                draggable={false}
                onDragStart={(event) => event.preventDefault()}
                onLoad={() => setInitialLoaded(true)}
                className="pointer-events-none !h-full !w-full select-none object-cover object-center transition-transform duration-700 group-hover:scale-[1.025]"
              />
            )}
          </AnimatePresence>
        ) : (
          <div className="brand-gradient flex h-full w-full flex-col items-center justify-center gap-3 text-white">
            <ImagePlus size={50} className="opacity-80" />
            <span className="text-xs font-bold text-white/75">
              Медиа будет добавлено из админ-панели
            </span>
          </div>
        )}
        {enableImageModal && activeMedia?.type !== "video" && (
          <button
            type="button"
            onClick={() => setIsImageModalOpen(true)}
            className="absolute left-3 top-3 z-30 hidden h-8 w-8 place-items-center rounded-full bg-black/15 text-white/65 backdrop-blur-sm transition hover:bg-black/30 hover:text-white md:grid"
          >
            <Maximize2 size={13} />
          </button>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-[#071827]/92 via-[#071827]/45 to-transparent" />

        <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/6 via-transparent to-blue-500/6" />
        </div>

        {hasMultiple && (
          <>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={prevSlide}
              className="absolute left-3 top-1/2 z-30 hidden -translate-y-1/2 rounded-full bg-black/10 p-1 text-white/55 backdrop-blur transition hover:bg-black/18 hover:text-cyan-300 md:block"
            >
              <ChevronLeft size={28} strokeWidth={2.2} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={nextSlide}
              className="absolute right-3 top-1/2 z-30 hidden -translate-y-1/2 rounded-full bg-black/10 p-1 text-white/55 backdrop-blur transition hover:bg-black/18 hover:text-cyan-300 md:block"
            >
              <ChevronRight size={28} strokeWidth={2.2} />
            </motion.button>

            <div className="absolute right-4 top-4 z-30 rounded-full bg-black/35 px-2.5 py-1 text-[10px] font-black text-white backdrop-blur-md">
              {activeIndex + 1} / {preparedMedia.length}
            </div>
          </>
        )}

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-4 pt-4 text-white sm:p-5 sm:pt-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="translate-y-0"
          >
           <h3 className="text-[0.98rem] font-black leading-none sm:text-[1.15rem]">
              {title}
            </h3>

            <p className="mt-2 line-clamp-2 text-[12px] leading-[1.15] text-white/82 sm:text-sm sm:leading-[1.18]">
              {text}
            </p>

            {hasMultiple ? (
              <div className="pointer-events-auto mt-4 flex gap-2 pb-1">
                {preparedMedia.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      goToSlide(index)
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeIndex === index
                        ? "w-7 bg-white"
                        : "w-2 bg-white/34"
                    }`}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-5 mb-2 h-[2px] w-10 rounded-full bg-white/55 transition-all duration-500 group-hover:w-16" />
            )}
          </motion.div>
        </div>
      </motion.div>

      <VideoModal
        isOpen={isVideoModalOpen}
        src={activeMedia?.src}
        poster={activeMedia?.preview || activeMedia?.src}
        onClose={() => setIsVideoModalOpen(false)}
      />
      <ImageModal
        isOpen={isImageModalOpen}
        images={preparedMedia.filter(
          (item) => item.type !== "video"
        )}
        activeIndex={activeIndex}
        title={title}
        onClose={() => setIsImageModalOpen(false)}
        onPrev={prevSlide}
        onNext={nextSlide}
      />
    </motion.div>
  )
}
