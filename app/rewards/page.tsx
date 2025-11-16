"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { RewardsPage } from "@/components/rewards-page"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"

export default function RewardsPageRoute() {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Rewards & Points</h1>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            Earn points by submitting feedback tickets and unlock amazing rewards
          </p>
        </div>
        <RewardsPage />
      </main>
    </div>
  )
}

