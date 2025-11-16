"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { AdminDashboard } from "@/components/admin-dashboard"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"

export default function AdminPage() {
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }
  
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{t.common.admin} Dashboard</h1>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            Manage tickets, appointments, ATMs, and monitor system performance
          </p>
        </div>
        <AdminDashboard />
      </main>
    </div>
  )
}
