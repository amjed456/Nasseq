"use client"

import { Header } from "@/components/header"
import { TicketingSystem } from "@/components/ticketing-system"
import { useLanguage } from "@/contexts/language-context"

export default function TicketsPage() {
  const { t } = useLanguage()
  
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{t.common.supportTickets}</h1>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {t.tickets.submitRequest}
          </p>
        </div>
        <TicketingSystem />
      </main>
    </div>
  )
}
