"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Video, Boxes, Brain, Headphones } from "lucide-react"

const tabs = [
  {
    id: "video",
    icon: Video,
    title: "Video Darslar",
    description: "Yuqori sifatli video darslar bilan nazariy bilimlarni o'zlashtirig. Non-skippable video tizimi sizni to'liq e'tibor bilan o'rganishga majbur qiladi.",
    features: [
      "HD sifatli video streaming",
      "Non-skippable video (o'tkazib yuborish mumkin emas)",
      "Progress auto-save (vaqtingiz saqlanadi)",
      "AI tarjima - chet tili muammo emas"
    ],
    preview: (
      <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
            <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-white ml-1" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center gap-3">
            <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-primary rounded-full" />
            </div>
            <span className="text-white text-sm">12:45 / 18:30</span>
          </div>
          <p className="text-white/80 text-sm mt-2">1-Mavzu: Raqamli texnologiyalar asoslari</p>
        </div>
      </div>
    )
  },
  {
    id: "3d",
    icon: Boxes,
    title: "3D Modellar",
    description: "Interaktiv 3D modellar orqali texnologiyalarning ichki tuzilishini o'rganing. Aylantirib ko'ring, zoom qiling, tafsilotlarni o'rganing.",
    features: [
      ".glb/.gltf format qo'llab-quvvatlash",
      "360° aylantirib ko'rish",
      "Zoom in/out imkoniyati",
      "Annotatsiyalar va izohlar"
    ],
    preview: (
      <div className="relative aspect-video bg-gradient-to-br from-indigo-950 to-purple-950 rounded-xl overflow-hidden flex items-center justify-center">
        <div className="relative">
          {/* Simplified 3D representation */}
          <motion.div
            animate={{ rotateY: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="relative w-40 h-40"
            style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
          >
            <div className="absolute inset-0 border-2 border-primary/50 rounded-xl bg-primary/10 backdrop-blur" 
                 style={{ transform: "rotateY(0deg) translateZ(40px)" }} />
            <div className="absolute inset-0 border-2 border-accent/50 rounded-xl bg-accent/10 backdrop-blur"
                 style={{ transform: "rotateY(90deg) translateZ(40px)" }} />
          </motion.div>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <span className="text-white/70 text-sm">Server arxitekturasi modeli</span>
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "ai",
    icon: Brain,
    title: "AI Yordamchi",
    description: "Gemini AI asosidagi shaxsiy tutor sizning barcha savollaringizga javob beradi. Tushunmagan joylaringizni so'rang - darhol yordam olasiz.",
    features: [
      "24/7 tayyor AI tutor",
      "O'zbek tilida to'liq yordam",
      "Dars bo'yicha kontekstli javoblar",
      "Qo'shimcha manbalarni taklif qilish"
    ],
    preview: (
      <div className="relative bg-gradient-to-br from-purple-950 to-pink-950 rounded-xl overflow-hidden p-4">
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">👤</div>
            <div className="bg-white/10 rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%]">
              <p className="text-white/90 text-sm">IoT nima va qanday ishlaydi?</p>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <div className="bg-gradient-to-r from-primary to-accent rounded-2xl rounded-tr-none px-4 py-2 max-w-[85%]">
              <p className="text-white text-sm">
                IoT (Internet of Things) - bu qurilmalarni internet orqali bog&apos;lash texnologiyasi. 
                Masalan, aqlli uy qurilmalari, sensorlar va h.k. Real vaqtda ma&apos;lumot almashadi...
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">👤</div>
            <div className="bg-white/10 rounded-2xl rounded-tl-none px-4 py-2">
              <p className="text-white/90 text-sm">Misol keltira olasizmi?</p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <input 
            type="text" 
            placeholder="Savolingizni yozing..." 
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/50 text-sm"
            readOnly
          />
          <button className="px-4 py-2 bg-primary rounded-xl text-white text-sm font-medium">
            Yuborish
          </button>
        </div>
      </div>
    )
  },
  {
    id: "audio",
    icon: Headphones,
    title: "Audio & Podkast",
    description: "Audio ma'ruzalar va podkastlar orqali yo'lda ham o'rganing. Ma'ruzalarni offline saqlash imkoniyati mavjud.",
    features: [
      "Audio ma'ruzalar",
      "Podcast formatdagi darslar",
      "Offline tinglash imkoniyati",
      "Tezlikni sozlash (0.5x - 2x)"
    ],
    preview: (
      <div className="relative bg-gradient-to-br from-teal-950 to-emerald-950 rounded-xl overflow-hidden p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
            <Headphones className="w-10 h-10 text-white" />
          </div>
          <div>
            <h4 className="text-white font-semibold">Ma&apos;ruza #5</h4>
            <p className="text-white/70 text-sm">Bulutli hisoblash texnologiyalari</p>
            <p className="text-white/50 text-xs mt-1">24:30 daqiqa</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full" />
          </div>
          <div className="flex items-center justify-between text-white/70 text-sm">
            <span>08:15</span>
            <span>24:30</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4 mt-6">
          <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
            </svg>
          </button>
          <button className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-teal-600 hover:scale-105 transition-transform">
            <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
            </svg>
          </button>
        </div>
      </div>
    )
  }
]

export function MultimodalSection() {
  const [activeTab, setActiveTab] = useState("video")
  const activeContent = tabs.find(t => t.id === activeTab)

  return (
    <section className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Multimodal Ta&apos;lim
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground">
            Har xil formatda o&apos;rganing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Video, 3D model, AI chat va audio - o&apos;zingizga qulay formatni tanlang
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-card border-primary/30 shadow-lg shadow-primary/10"
                    : "bg-card/50 border-border hover:bg-card hover:border-border"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}>
                    <tab.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold ${
                      activeTab === tab.id ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {tab.title}
                    </h3>
                    {activeTab === tab.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <p className="text-sm text-muted-foreground mt-1 mb-3">
                          {tab.description}
                        </p>
                        <ul className="space-y-1.5">
                          {tab.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <svg className="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </motion.div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="sticky top-24"
          >
            <div className="bg-card border border-border rounded-2xl p-4 shadow-xl">
              {activeContent?.preview}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
