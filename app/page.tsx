"use client"

import { Header } from "@/components/header"
import { LoginForm } from "@/components/login-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, FileText, TrendingUp, Clock, Users } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <LoginForm />
      </div>
    )
  }

  // Show main content if authenticated
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent py-12 sm:py-16 md:py-24 lg:py-32">
        <div className="container mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary-foreground text-balance px-2">
              {t.home.hero.title}
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-primary-foreground/90 leading-relaxed text-pretty px-4 sm:px-0">
              {t.home.hero.description}
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
              <Link href="/appointments">
                <Button size="lg" variant="secondary" className="text-sm sm:text-base w-full sm:w-auto">
                  {t.home.hero.bookAppointment}
                </Button>
              </Link>
              <Link href="/atm-locator">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 text-sm sm:text-base w-full sm:w-auto"
                >
                  {t.home.hero.findATM}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b bg-muted/30 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <TrendingUp className="h-7 w-7 sm:h-8 sm:w-8 text-secondary" />
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">25%</div>
                <div className="mt-1 text-xs sm:text-sm text-muted-foreground">{t.home.stats.reducedCongestion}</div>
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center">
                <Clock className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">50%</div>
                <div className="mt-1 text-xs sm:text-sm text-muted-foreground">{t.home.stats.fasterTransactions}</div>
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center">
                <Users className="h-7 w-7 sm:h-8 sm:w-8 text-accent" />
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">14</div>
                <div className="mt-1 text-xs sm:text-sm text-muted-foreground">{t.home.stats.atmLocations}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance px-2">
              {t.home.coreServices.title}
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground text-pretty px-4 sm:px-0">
              {t.home.coreServices.subtitle}
            </p>
          </div>

          <div className="mt-10 sm:mt-12 md:mt-16 grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-3">
            {/* Appointment Management */}
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Calendar className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4">{t.home.coreServices.appointmentManagement.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {t.home.coreServices.appointmentManagement.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/appointments">
                  <Button className="w-full">{t.common.bookNow}</Button>
                </Link>
              </CardContent>
            </Card>

            {/* ATM Status Tracking */}
            <Card className="border-2 hover:border-secondary/50 transition-colors">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                  <MapPin className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4">{t.home.coreServices.atmTracking.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {t.home.coreServices.atmTracking.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/atm-locator">
                  <Button variant="secondary" className="w-full">
                    {t.common.findATM}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Digital Ticketing */}
            <Card className="border-2 hover:border-accent/50 transition-colors">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <FileText className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4">{t.home.coreServices.digitalTicketing.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {t.home.coreServices.digitalTicketing.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/tickets">
                  <Button variant="outline" className="w-full bg-transparent">
                    {t.common.createTicket}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="border-t bg-muted/30 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance px-2">
              {t.home.services.title}
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground text-pretty px-4 sm:px-0">
              {t.home.services.subtitle}
            </p>
          </div>

          <div className="mt-10 sm:mt-12 md:mt-16 grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t.home.services.accountServices.title}</CardTitle>
                <CardDescription>{t.home.services.accountServices.description}</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t.home.services.cardServices.title}</CardTitle>
                <CardDescription>{t.home.services.cardServices.description}</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t.home.services.financingServices.title}</CardTitle>
                <CardDescription>{t.home.services.financingServices.description}</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t.home.services.corporateBanking.title}</CardTitle>
                <CardDescription>{t.home.services.corporateBanking.description}</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t.home.services.transferServices.title}</CardTitle>
                <CardDescription>{t.home.services.transferServices.description}</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t.home.services.digitalDocuments.title}</CardTitle>
                <CardDescription>{t.home.services.digitalDocuments.description}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader className="text-center pb-6 sm:pb-8 px-4 sm:px-6">
              <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-balance">
                {t.home.cta.title}
              </CardTitle>
              <CardDescription className="text-base sm:text-lg mt-3 sm:mt-4 text-pretty">
                {t.home.cta.subtitle}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-6 pb-6 sm:pb-8">
              <Link href="/login">
                <Button size="lg" className="text-sm sm:text-base w-full sm:w-auto">
                  {t.common.getStartedToday}
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-sm sm:text-base bg-transparent w-full sm:w-auto">
                {t.common.contactSupport}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            <div className="sm:col-span-2">
              <h3 className="font-semibold text-foreground text-base sm:text-lg">NASSAQ</h3>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t.home.footer.description}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm sm:text-base">{t.common.services}</h4>
              <ul className="mt-3 sm:mt-4 space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li>
                  <Link href="/appointments" className="hover:text-foreground transition-colors">
                    {t.common.appointments}
                  </Link>
                </li>
                <li>
                  <Link href="/atm-locator" className="hover:text-foreground transition-colors">
                    {t.common.atmLocator}
                  </Link>
                </li>
                <li>
                  <Link href="/tickets" className="hover:text-foreground transition-colors">
                    {t.common.supportTickets}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm sm:text-base">{t.common.support}</h4>
              <ul className="mt-3 sm:mt-4 space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    {t.common.helpCenter}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    {t.common.contactUs}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    {t.common.privacyPolicy}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 sm:mt-12 border-t pt-6 sm:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
            © 2025 NASSAQ. {t.common.allRightsReserved}.
          </div>
        </div>
      </footer>
    </div>
  )
}
