"use client"
import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import MobileMenu from "./MobileMenu"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 w-full border-b border-orange-500/20 bg-[#1a1410]/80 backdrop-blur-xl z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link href="/" className="flex items-center gap-3">
                <motion.div
                  className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center"
                  whileHover={{ rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </motion.div>
                <span className="text-lg font-semibold text-white hidden sm:inline">Reportify</span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { href: "/how-it-works", label: "How It Works" },
                { href: "/submit-report", label: "Submit Report" },
                { href: "/track-report", label: "Track Report" },
                //{ href: "/how-it-works", label: "How It Works" },
                { href: "/resources", label: "Resources" },
              ].map((item) => (
                <motion.div key={item.href} whileHover={{ color: "#f97316" }}>
                  <Link href={item.href} className="text-sm text-zinc-400 hover:text-orange-400 transition-colors">
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Right side buttons */}
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} className="hidden md:block">
                <Link href="/contact" className="text-sm text-zinc-400 hover:text-orange-400 transition-colors">
                  Contact
                </Link>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex h-9 items-center gap-2 rounded-full bg-red-500/10 pl-4 pr-5 text-sm font-medium text-red-500 ring-1 ring-inset ring-red-500/20 hover:bg-red-500/20 transition-all"
              >
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-red-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                />
                Emergency: 911
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="md:hidden p-2 text-zinc-400 hover:text-orange-400"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />}
      </AnimatePresence>
    </>
  )
}
