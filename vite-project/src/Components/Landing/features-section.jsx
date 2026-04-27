"use client"

import { motion } from "framer-motion"
import { 
  Video, 
  Boxes, 
  Brain, 
  Lock, 
  BarChart3, 
  MessageCircle,
  Headphones,
  FileText,
  Zap
} from "lucide-react"

const features = [
  {
    icon: Video,
    title: "Video Darslar",
    description: "YouTube va server videolari bilan to'liq interaktiv darslar. Videoni o'tkazib yuborish imkoniyati yo'q - sifatli o'rganish kafolatlangan.",
    color: "bg-red-500/10 text-red-500",
    borderColor: "group-hover:border-red-500/30"
  },
  {
    icon: Boxes,
    title: "3D Modellar",
    description: ".glb/.gltf formatdagi 3D modellarni interaktiv aylantirib, ichiga kirib ko'ring. Texnologiyalarni vizual o'rganing.",
    color: "bg-blue-500/10 text-blue-500",
    borderColor: "group-hover:border-blue-500/30"
  },
  {
    icon: Brain,
    title: "AI Tutor",
    description: "Gemini AI asosidagi shaxsiy o'qituvchi. Har qanday savolingizga tezkor va aniq javob olasiz.",
    color: "bg-purple-500/10 text-purple-500",
    borderColor: "group-hover:border-purple-500/30"
  },
  {
    icon: Lock,
    title: "Sequential Learning",
    description: "Ketma-ket o'qitish tizimi. Oldingi darsni to'liq tugatmasdan keyingisiga o'ta olmaysiz.",
    color: "bg-amber-500/10 text-amber-500",
    borderColor: "group-hover:border-amber-500/30"
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Real vaqtda o'zlashtirish statistikasi. Qayerda turibsiz, nimani yaxshilash kerak - hammasi aniq.",
    color: "bg-emerald-500/10 text-emerald-500",
    borderColor: "group-hover:border-emerald-500/30"
  },
  {
    icon: MessageCircle,
    title: "AI Tarjima",
    description: "Chet tilidagi video transkriptlarini bir zumda o'zbek tiliga tarjima qiling. Til to'siq emas!",
    color: "bg-pink-500/10 text-pink-500",
    borderColor: "group-hover:border-pink-500/30"
  },
  {
    icon: Headphones,
    title: "Podkastlar",
    description: "Audio ma'ruzalar va podkastlar. Yo'lda, sport zalda - istalgan joyda o'rganing.",
    color: "bg-teal-500/10 text-teal-500",
    borderColor: "group-hover:border-teal-500/30"
  },
  {
    icon: FileText,
    title: "Topshiriqlar",
    description: "Amaliy vazifalar va testlar. Bilimlaringizni mustahkamlang va baholang.",
    color: "bg-orange-500/10 text-orange-500",
    borderColor: "group-hover:border-orange-500/30"
  },
  {
    icon: Zap,
    title: "Telegram Mini App",
    description: "Telegram ichida to'liq ishlash. Bildirishnomalar, avtomatik login - hammasi bir joyda.",
    color: "bg-indigo-500/10 text-indigo-500",
    borderColor: "group-hover:border-indigo-500/30"
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Xususiyatlar
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Zamonaviy ta&apos;lim uchun barcha imkoniyatlar
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            MultiEdu platformasi eng so&apos;nggi texnologiyalarni birlashtirgan holda ta&apos;lim jarayonini yangi bosqichga olib chiqadi
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group"
            >
              <div className={`h-full bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 ${feature.borderColor}`}>
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
