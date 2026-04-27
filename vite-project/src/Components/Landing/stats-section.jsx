"use client"

import { motion } from "framer-motion"
import { Users, BookOpen, Award, Clock } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "500+",
    label: "Faol o'quvchilar",
    description: "Platformada o'qiyotgan talabalar",
    color: "from-blue-500 to-indigo-500"
  },
  {
    icon: BookOpen,
    value: "12",
    label: "Mavzular soni",
    description: "To'liq multimodal darslar",
    color: "from-teal-500 to-emerald-500"
  },
  {
    icon: Award,
    value: "95%",
    label: "Muvaffaqiyat darajasi",
    description: "Kursni muvaffaqiyatli tugatganlar",
    color: "from-amber-500 to-orange-500"
  },
  {
    icon: Clock,
    value: "24/7",
    label: "AI Yordam",
    description: "Har doim tayyor AI tutor",
    color: "from-purple-500 to-pink-500"
  }
]

export function StatsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground">
            Raqamlarda natijalar
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Platformamiz o&apos;quvchilarga yuqori sifatli ta&apos;lim berish orqali real natijalarni ko&apos;rsatmoqda
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl -z-10" 
                     style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
                
                <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-3xl lg:text-4xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {stat.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
