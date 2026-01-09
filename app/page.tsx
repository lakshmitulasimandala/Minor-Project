"use client"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const featureVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <main className="relative px-6 pt-2 pb-20 mr-0 lg:mr-0 lg:px-0">

      {/* ================= HERO SECTION ================= */}
      <section className="relative mb-32 min-h-[600px] overflow-hidden">

        {/* RIGHT SIDE BACKGROUND IMAGE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 2 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="
            hidden lg:block
            absolute top-0 -right-[12%]
            h-full w-[55%]
            bg-[url('/Illustrations/civic-road.png')]
            bg-cover bg-right bg-no-repeat
          "
        >
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/60 to-transparent" />
        </motion.div>

        {/* HERO CONTENT */}
        <div className="relative z-10 mx-12 max-w-6xl">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 items-center min-h-[600px]"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >

            {/* LEFT: TEXT */}
            <div className="lg:pl-2 ">
              <motion.div
                variants={itemVariants}
                className="mb-8 inline-flex h-10 items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 text-sm text-orange-400"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Secure & Anonymous Reporting
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="mb-6 text-6xl sm:text-7xl font-bold tracking-tight text-white leading-tight"
              >
                Report the Issue.
                <motion.span
                  className="block bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  Stay Anonymous.
                </motion.span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="mb-10 max-w-2xl text-lg text-zinc-300 leading-relaxed"
              >
                From public safety to civic problems, submit reports anonymously and help
                authorities act faster. Your identity remains completely anonymous with
                military-grade encryption.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/submit-report">
                    <button className="h-12 px-8 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-400 transition-colors">
                      Make Anonymous Report →
                    </button>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/how-it-works">
                    <button className="h-12 px-8 rounded-xl bg-white/5 text-white font-medium ring-1 ring-white/10 hover:bg-white/10 transition-colors">
                      How it Works
                    </button>
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* RIGHT EMPTY COLUMN (background shows here) */}
            <div className="hidden lg:block" />

          </motion.div>
        </div>
      </section>

      {/* ================= REST OF PAGE ================= */}
      <div className="mx-auto max-w-6xl">
        {/* Features Grid with better layout */}
        <motion.div
          className="mb-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants} className="mb-12 text-3xl font-bold text-white text-center">
            Why Choose Reportify
          </motion.h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                title: "Military-Grade Encryption",
                description: "Your identity protected with state-of-the-art encryption",
                icon: (
                  <svg className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                ),
              },
              {
                title: "Real-time Processing",
                description: "Instant verification and secure routing of reports",
                icon: (
                  <svg className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
              },
              {
                title: "Secure Communication",
                description: "Two-way anonymous channel with law enforcement",
                icon: (
                  <svg className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                ),
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={featureVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group rounded-2xl bg-[#1f1a16] p-8 border border-white/5 hover:border-orange-500/30 transition-all"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section with animation */}
        <motion.div
          className="mb-32 rounded-2xl bg-[#1f1a16] p-12 border border-white/5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid gap-12 sm:grid-cols-3">
            {[
              { value: "100K+", label: "Reports Filed" },
              { value: "100%", label: "Anonymity Rate" },
              { value: "24/7", label: "Support Available" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <motion.div
                  className="text-4xl font-bold text-orange-400 mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2, duration: 0.8 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-zinc-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1f1a16] px-6 py-3 text-sm text-zinc-400 border border-white/5">
            <motion.span
              className="h-2 w-2 rounded-full bg-emerald-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            />
            Trusted by Law Enforcement Nationwide
          </div>
        </motion.div>
      </div>  
    </main>
  )
}
