import { motion } from "framer-motion"
import { Save, ImagePlus, FileText, MessageSquareCheck } from "lucide-react"

const cards = [
  {
    title: "Редактирование разделов",
    text: "Тексты, заголовки, фото и видео для каждого блока сайта.",
    icon: <ImagePlus size={22} />,
  },
  {
    title: "Документы",
    text: "Загрузка PDF/DOC файлов и управление порядком отображения.",
    icon: <FileText size={22} />,
  },
  {
    title: "Отзывы и заявки",
    text: "Подтверждение отзывов и обработка заявок на консультацию.",
    icon: <MessageSquareCheck size={22} />,
  },
]

export default function AdminDashboard() {
  return (
    <div>
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#05a99d]">
            Dashboard
          </p>

          <h1 className="mt-3 text-4xl font-black text-[#12315c]">
            Управление сайтом
          </h1>

          <p className="mt-4 max-w-2xl text-slate-600">
            Здесь будут разделы сайта в том же порядке, что и на главной странице.
            Администратор сможет менять тексты, загружать фото, видео и документы.
          </p>
        </div>

        <button className="brand-gradient brand-shadow inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-black text-white">
          <Save size={17} />
          Сохранить
        </button>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="glass-card rounded-[1.6rem] p-6"
          >
            <div className="brand-icon grid h-12 w-12 place-items-center rounded-xl text-white">
              {card.icon}
            </div>

            <h3 className="mt-5 text-xl font-black text-[#12315c]">
              {card.title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {card.text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}