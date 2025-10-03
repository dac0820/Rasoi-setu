import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "./context/LanguageContext"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "./components/ThemeProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RasoiSetu - AI-Powered Platform for Street Food Vendors",
  description:
    "Connect street food vendors with verified raw material suppliers through AI-powered suggestions and multilingual support",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
