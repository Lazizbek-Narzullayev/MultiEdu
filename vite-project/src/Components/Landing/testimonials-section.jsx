"use client"

import { motion } from "framer-motion"
import { Quote } from "lucide-react"



export function TestimonialsSection({ reviews = [] }) {
  // Helper to get initials from name
  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // If no reviews from backend, show fallback empty state or pre-defined list
  // For this task, we assume the backend reviews are the priority
  const displayReviews = reviews.length > 0 ? reviews : [];

  return (
    <section id="community" className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Fikrlar
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground">
            O&apos;quvchilarimiz nima deyishadi
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            500+ o&apos;quvchi bizning platformadan foydalanib, yangi bilimlar egallashmoqda
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayReviews.map((review, index) => (
            <motion.div
              key={review._id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div className="h-full bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                {/* Quote Icon */}
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Quote className="w-5 h-5 text-primary" />
                </div>
                
                {/* Content */}
                <p className="text-muted-foreground leading-relaxed mb-6">
                  &quot;{review.comment}&quot;
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
                    {getInitials(review.user?.name || "O")}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {review.user?.name || "Foydalanuvchi"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {review.user?.role === 'student' ? 'Talaba' : 
                       review.user?.role === 'teacher' ? 'O\'qituvchi' : 
                       review.user?.role || 'Foydalanuvchi'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
