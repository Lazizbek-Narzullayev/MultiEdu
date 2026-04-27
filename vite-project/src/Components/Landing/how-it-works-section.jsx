"use client"

import { motion } from "framer-motion"
import { UserPlus, BookOpen, Play, Award, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "Ro'yxatdan o'ting",
    description: "Email yoki Telegram orqali tez ro'yxatdan o'ting. Talaba yoki o'qituvchi sifatida kirish.",
    color: "from-blue-500 to-indigo-500"
  },
  {
    icon: BookOpen,
    title: "Kursga a'zo bo'ling",
    description: "\"Raqamli Texnologiyalar\" kursini tanlang va o'rganishni boshlang.",
    color: "from-emerald-500 to-teal-500"
  },
  {
    icon: Play,
    title: "Darslarni o'rganing",
    description: "Video, 3D model va AI yordamchi bilan interaktiv o'rganing. Progress avtomatik saqlanadi.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Award,
    title: "Sertifikat oling",
    description: "Barcha dars va testlarni muvaffaqiyatli topshirib, sertifikat oling.",
    color: "from-amber-500 to-orange-500"
  }
]

export function HowItWorksSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Qanday ishlaydi
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground">
            4 oddiy qadamda o&apos;rganishni boshlang
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Ro&apos;yxatdan o&apos;tishdan sertifikat olishgacha - hammasi oddiy va tushunarli
          </p>
        </motion.div>

        {/* Desktop Layout */}
        <div className="hidden lg:block relative">
          {/* Connection Line */}
          <div className="absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent" />
          
          <div className="grid grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-center">
                  {/* Step Number */}
                  <div className="relative inline-block mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-card border-2 border-border flex items-center justify-center text-sm font-bold text-foreground">
                      {index + 1}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                {/* Arrow */}
                {index < steps.length - 1 && (
                  <div className="absolute top-12 -right-4 text-muted-foreground/30">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex gap-4"
            >
              <div className="relative shrink-0">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-card border-2 border-border flex items-center justify-center text-xs font-bold text-foreground">
                  {index + 1}
                </div>
                {/* Vertical line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-14 left-1/2 w-0.5 h-10 bg-border -translate-x-1/2" />
                )}
              </div>
              
              <div className="flex-1 pb-6">
                <h3 className="font-semibold text-foreground mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
