"use client"

import Link from "next/link"
import { motion } from "framer-motion"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const drawerVariants = {
    hidden: { x: 300 },
    visible: {
      x: 0,
      transition: { type: "spring" as const, damping: 25, stiffness: 200 },
    },
    exit: {
      x: 300,
      transition: { type: "spring" as const, damping: 25, stiffness: 200 },
    },
  }

  const linkVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05 + 0.1, duration: 0.3 },
    }),
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        className="fixed right-0 top-0 h-full w-64 bg-[#1f1a16] p-6 shadow-xl border-l border-orange-500/20"
        variants={drawerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex flex-col space-y-6">
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex justify-end p-2 text-zinc-400 hover:text-orange-400 -mr-2"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-4">
            {[
              { href: "/submit-report", label: "Submit Report" },
              { href: "/track-report", label: "Track Report" },
              { href: "/how-it-works", label: "How It Works" },
              { href: "/resources", label: "Resources" },
              { href: "/contact", label: "Contact" },
            ].map((link, i) => (
              <motion.div key={link.href} custom={i} variants={linkVariants} initial="hidden" animate="visible">
                <Link
                  href={link.href}
                  className="text-sm text-zinc-400 hover:text-orange-400 transition-colors block"
                  onClick={onClose}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>
      </motion.div>
    </div>
  )
}
