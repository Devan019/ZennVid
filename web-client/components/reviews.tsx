"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const reviews = [
  {
    name: "Sarah Chen",
    role: "Content Creator",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    review:
      "VideoAI has completely transformed my content creation process. I can now produce high-quality videos in minutes instead of hours!",
  },
  {
    name: "Marcus Rodriguez",
    role: "Marketing Director",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    review:
      "The AI understands exactly what I want to convey. Our social media engagement has increased by 300% since using VideoAI.",
  },
  {
    name: "Emily Watson",
    role: "Small Business Owner",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    review:
      "As someone with zero video editing experience, VideoAI made it possible for me to create professional marketing videos for my business.",
  },
  {
    name: "David Kim",
    role: "YouTuber",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    review:
      "The quality is incredible and the speed is unmatched. I've been able to triple my content output while maintaining high standards.",
  },
  {
    name: "Lisa Thompson",
    role: "Social Media Manager",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    review:
      "VideoAI's ability to create platform-specific content is amazing. Each video is perfectly optimized for its intended platform.",
  },
  {
    name: "Alex Johnson",
    role: "Freelance Designer",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    review:
      "I can now offer video services to my clients without learning complex editing software. VideoAI handles everything beautifully.",
  },
]

export function Reviews() {
  return (
    <section id="reviews" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6">
            Loved by
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Creators Worldwide
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of satisfied creators who have transformed their content with VideoAI
          </p>
        </motion.div>

        {/* Infinite Scrolling Reviews */}
        <div className="relative">
          <div className="flex space-x-6 animate-scroll">
            {[...reviews, ...reviews].map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: (index % reviews.length) * 0.1 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-80"
              >
                <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-md border-gray-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-white/20 transition-all duration-300 h-full shadow-lg dark:shadow-none">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={review.avatar || "/placeholder.svg"}
                        alt={review.name}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h4 className="text-gray-800 dark:text-white font-semibold">{review.name}</h4>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{review.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    <div className="relative">
                      <Quote className="absolute -top-2 -left-2 w-8 h-8 text-purple-300 dark:text-purple-400/30" />
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed pl-6">{review.review}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Gradient Overlays */}
          
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
        >
          {[
            { number: "50K+", label: "Videos Created" },
            { number: "10K+", label: "Happy Creators" },
            { number: "99.9%", label: "Uptime" },
            { number: "4.9/5", label: "User Rating" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  )
}
