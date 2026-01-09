import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Reportify - Secure and Anonymous civic issue Reporting Platform",
  description: "Securely and anonymously report public issues to law enforcement",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative min-h-screen bg-[#111111] selection:bg-orange-500/20">
          <div className="fixed inset-0 -z-10 min-h-screen pointer-events-none">
            <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.05),transparent_40%)]" />
            <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_bottom_left,rgba(251,146,60,0.03),transparent_50%)]" />
          </div>
          <Navbar />
          <main className="pt-16">
            <Providers>{children}</Providers>
          </main>
        </div>
      </body>
    </html>
  )
}
