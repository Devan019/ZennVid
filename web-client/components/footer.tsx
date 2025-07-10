"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Zap, Twitter, Instagram, Youtube, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative bg-white/80 dark:bg-black/20 backdrop-blur-md border-t border-gray-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                VideoAI
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Transform your ideas into stunning AI-generated videos. Create professional content in seconds with our
              advanced artificial intelligence.
            </p>
            <div className="flex space-x-4">
              {[Twitter, Instagram, Youtube, Linkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 bg-gray-100 hover:bg-purple-100 dark:bg-white/5 dark:hover:bg-purple-500/20 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon className="w-5 h-5 text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Product Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-gray-800 dark:text-white font-semibold text-lg mb-6">Product</h3>
            <ul className="space-y-4">
              {["Features", "Pricing", "Templates", "API", "Integrations", "Mobile App"].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-gray-800 dark:text-white font-semibold text-lg mb-6">Company</h3>
            <ul className="space-y-4">
              {["About Us", "Careers", "Blog", "Press", "Partners", "Contact"].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-gray-800 dark:text-white font-semibold text-lg">Stay Updated</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get the latest updates on new features and AI video trends.
            </p>
            <div className="space-y-3">
              <Input
                placeholder="Enter your email"
                className="bg-white/80 dark:bg-white/5 border-gray-300 dark:border-white/10 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-200 dark:border-white/10 mt-12 pt-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-purple-500" />
              <span className="text-gray-600 dark:text-gray-300">hello@videoai.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-purple-500" />
              <span className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-purple-500" />
              <span className="text-gray-600 dark:text-gray-300">San Francisco, CA</span>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">© 2024 VideoAI. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 text-sm transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 text-sm transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-100/50 dark:bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-100/50 dark:bg-pink-500/5 rounded-full blur-3xl" />
    </footer>
  )
}
