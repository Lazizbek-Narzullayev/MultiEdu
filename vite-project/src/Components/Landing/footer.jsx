import { Link } from "react-router-dom"
import { GraduationCap, Send, Github, Instagram, Linkedin, Youtube } from "lucide-react"
import { Button } from "@/Components/ui/button"

const footerLinks = {
  platform: [
    { label: "Kurslar", href: "/courses" },
    { label: "Narxlar", href: "/pricing" },
    { label: "O'qituvchilarga", href: "/teachers" },
    { label: "FAQ", href: "/faq" }
  ],
  company: [
    { label: "Biz haqimizda", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Vakansiyalar", href: "/careers" },
    { label: "Aloqa", href: "/contact" }
  ],
  legal: [
    { label: "Maxfiylik siyosati", href: "/privacy" },
    { label: "Foydalanish shartlari", href: "/terms" },
    { label: "Cookie siyosati", href: "/cookies" }
  ]
}

const socialLinks = [
  { icon: Send, href: "https://t.me/multiedu", label: "Telegram" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" }
]

export function Footer() {
  return (
    <footer id="contact" className="bg-sidebar text-sidebar-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 lg:py-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold">
                  Multi<span className="text-primary">Edu</span>
                </span>
                <span className="text-[10px] text-sidebar-foreground/60 -mt-1">
                  Raqamli Ta&apos;lim
                </span>
              </div>
            </Link>
            
            <p className="text-sidebar-foreground/70 text-sm leading-relaxed mb-6 max-w-xs">
              Zamonaviy multimodal ta&apos;lim platformasi. Video darslar, 3D modellar va AI yordamchi bilan o&apos;qishni yangi bosqichga olib chiqing.
            </p>

            {/* Newsletter */}
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email manzilingiz"
                className="flex-1 bg-sidebar-accent/50 border border-sidebar-border rounded-lg px-4 py-2 text-sm text-sidebar-foreground placeholder-sidebar-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-sidebar-foreground mb-4">Platforma</h4>
            <ul className="space-y-2.5">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-sm text-sidebar-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-sidebar-foreground mb-4">Kompaniya</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-sm text-sidebar-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-sidebar-foreground mb-4">Huquqiy</h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-sm text-sidebar-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-sidebar-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-sidebar-foreground/60">
            © 2024 MultiEdu. Barcha huquqlar himoyalangan.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                to={social.href}
                className="w-9 h-9 rounded-lg bg-sidebar-accent/50 flex items-center justify-center text-sidebar-foreground/70 hover:bg-primary hover:text-white transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

