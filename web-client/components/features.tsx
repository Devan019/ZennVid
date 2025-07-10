"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, Brain, Palette, Clock, Download, Share2, Wand2, Video, Sparkles } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Generation",
    description: "Advanced machine learning algorithms create unique videos from your text descriptions.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate professional-quality videos in under 30 seconds with our optimized AI engine.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Palette,
    title: "Customizable Styles",
    description: "Choose from dozens of artistic styles, themes, and visual effects to match your brand.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Clock,
    title: "Perfect Length",
    description: "Automatically optimized for social media platforms with ideal duration and aspect ratios.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Download,
    title: "Multiple Formats",
    description: "Export in various formats and resolutions, from 4K to mobile-optimized versions.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Share2,
    title: "Direct Sharing",
    description: "Share directly to social platforms or collaborate with team members seamlessly.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Wand2,
    title: "Magic Effects",
    description: "Add stunning transitions, animations, and special effects with a single click.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Video,
    title: "HD Quality",
    description: "Crystal clear output with professional-grade video quality and smooth playback.",
    gradient: "from-teal-500 to-blue-500",
  },
  {
    icon: Sparkles,
    title: "Smart Editing",
    description: "AI automatically handles pacing, cuts, and timing for maximum engagement.",
    gradient: "from-yellow-500 to-orange-500",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6">
            Powerful Features for
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Creative Minds
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Everything you need to create professional videos with the power of artificial intelligence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-md border-gray-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-white/20 transition-all duration-300 h-full shadow-lg dark:shadow-none">
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Background Elements */}
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-200/30 dark:bg-pink-500/10 rounded-full blur-3xl -z-10" />
      </div>
    </section>
  )
}
