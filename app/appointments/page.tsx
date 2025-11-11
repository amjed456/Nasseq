"use client"

import { Header } from "@/components/header"
import { AppointmentBooking } from "@/components/appointment-booking"
import { useLanguage } from "@/contexts/language-context"

export default function AppointmentsPage() {
  const { t } = useLanguage()
  
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t.appointments.bookAppointment}
            </h1>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              {t.appointments.fillDetails}
            </p>
          </div>
          <AppointmentBooking />
        </div>
      </main>
    </div>
  )
}
