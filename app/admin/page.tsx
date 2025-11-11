"use client"

import { Header } from "@/components/header"
import { AdminDashboard } from "@/components/admin-dashboard"
import { useLanguage } from "@/contexts/language-context"

export default function AdminPage() {
  const { t } = useLanguage()
  
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
