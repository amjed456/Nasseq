"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export function Header() {
  const [open, setOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="NASSAQ Logo" width={120} height={40} className="h-8 w-auto sm:h-10" />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/appointments"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            {t.common.appointments}
          </Link>
          <Link
            href="/atm-locator"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            {t.common.atmLocator}
          </Link>
          <Link
            href="/tickets"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            {t.common.supportTickets}
          </Link>
          <Link
            href="/rewards"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Rewards
          </Link>
          <Link
            href="/admin"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            {t.common.admin}
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-1 bg-muted/50 rounded-lg p-1 border border-border/50">
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                language === "en"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("ar")}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                language === "ar"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              AR
            </button>
          </div>
          {isAuthenticated ? (
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="hidden md:inline-flex text-sm"
            >
              Logout
            </Button>
          ) : (
            <Link href="/login">
              <Button className="hidden md:inline-flex text-sm">{t.common.login}</Button>
            </Link>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>{t.common.menu}</SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-4">
                <Link
                  href="/appointments"
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  {t.common.appointments}
                </Link>
                <Link
                  href="/atm-locator"
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  {t.common.atmLocator}
                </Link>
                <Link
                  href="/tickets"
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  {t.common.supportTickets}
                </Link>
                <Link
                  href="/rewards"
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  Rewards
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  {t.common.admin}
                </Link>
                <div className="mt-4 pt-4 border-t">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                    Language / اللغة
                  </div>
                  <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1 border border-border/50">
                    <button
                      onClick={() => setLanguage("en")}
                      className={`flex-1 px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                        language === "en"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setLanguage("ar")}
                      className={`flex-1 px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                        language === "ar"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      }`}
                    >
                      AR
                    </button>
                  </div>
                </div>
                {isAuthenticated ? (
                  <Button onClick={handleLogout} className="w-full">
                    Logout
                  </Button>
                ) : (
                  <Link href="/login" onClick={() => setOpen(false)} className="w-full">
                    <Button className="w-full">
                      {t.common.login}
                    </Button>
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
