"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Building2, Star, Calendar, FileText, Image as ImageIcon, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

type ResourceSchedule = {
  id: string
  name: string
  type: "department" | "person"
  schedule: string
}

interface AppointmentHistoryProps {
  favorites: ResourceSchedule[]
  onRemoveFavorite?: (resourceId: string) => void
}

export function AppointmentHistory({ favorites, onRemoveFavorite }: AppointmentHistoryProps) {
  const { t } = useLanguage()
  const [appointmentRequests, setAppointmentRequests] = useState<any[]>([])

  // Load appointment requests from localStorage
  useEffect(() => {
    const loadAppointments = () => {
      const stored = localStorage.getItem("appointmentRequests")
      // Always get fresh userNationalNumber from localStorage
      const currentUser = typeof window !== 'undefined' ? localStorage.getItem("userNationalNumber") : null
      
      if (stored) {
        try {
          const allAppointments = JSON.parse(stored)
          // Filter to show only current user's appointments
          if (currentUser && currentUser !== "N/A") {
            const userAppointments = allAppointments.filter(
              (apt: any) => apt.customer === currentUser
            )
            setAppointmentRequests(userAppointments)
          } else {
            setAppointmentRequests([])
          }
        } catch (e) {
          console.error("Error loading appointments:", e)
          setAppointmentRequests([])
        }
      } else {
        setAppointmentRequests([])
      }
    }
    loadAppointments()
    const handleStorageChange = () => loadAppointments()
    window.addEventListener("storage", handleStorageChange)
    // Poll for changes (since storage event doesn't fire in same tab)
    const interval = setInterval(loadAppointments, 500)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const hasFavorites = favorites.length > 0
  const hasAppointments = appointmentRequests.length > 0

  return (
    <div className="space-y-4">
      {/* Favorites Section */}
      {hasFavorites && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t.appointments.myAppointments.favoriteDepartments}</h3>
          {favorites.map((favorite) => (
          <Card key={favorite.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{favorite.name}</CardTitle>
                    <Badge variant={favorite.type === "department" ? "default" : "secondary"}>
                      {favorite.type === "department" ? t.admin.appointments.departments : t.admin.appointments.people}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  favorite.type === "department" 
                    ? "bg-blue-100 text-blue-600" 
                    : "bg-green-100 text-green-600"
                }`}>
                  {favorite.type === "department" ? (
                    <Building2 className="h-4 w-4" />
                  ) : (
                    <Users className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="p-3 bg-muted/50 rounded-lg border">
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">{t.appointments.myAppointments.workingHours}:</p>
                        <p className="text-sm font-medium">{favorite.schedule}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onRemoveFavorite?.(favorite.id)}
                >
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </Button>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      {/* Appointment Requests Section */}
      {hasAppointments && (
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${hasFavorites ? 'mt-6' : ''}`}>{t.appointments.myAppointments.myAppointmentRequests}</h3>
          {appointmentRequests.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{appointment.title}</CardTitle>
                      <Badge variant={appointment.status === "pending" ? "secondary" : "default"}>
                        {appointment.status}
                      </Badge>
                      {appointment.rewarded && (
                        <Badge variant="outline" className="bg-green-50 text-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Rewarded
                        </Badge>
                      )}
                    </div>
                    <CardDescription>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>{t.appointments.myAppointments.requested}: {formatDate(appointment.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span>{t.appointments.myAppointments.administrator}: {appointment.administratorLabel}</span>
                      </div>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="p-3 bg-muted/50 rounded-lg border">
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">{t.tickets.description}:</p>
                          <p className="text-sm font-medium">{appointment.description}</p>
                        </div>
                        {appointment.attachment && (
                          <div className="flex items-center gap-2 mt-2">
                            {appointment.attachment.type.startsWith("image/") ? (
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <FileText className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="text-xs text-muted-foreground">{appointment.attachment.name}</span>
                          </div>
                        )}
                        {appointment.assignedTo && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-muted-foreground mb-1">{t.appointments.myAppointments.assignedTo}:</p>
                            <p className="text-sm">{appointment.assignedTo}</p>
                            {appointment.assignedEmail && (
                              <p className="text-xs text-muted-foreground">{appointment.assignedEmail}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!hasFavorites && !hasAppointments && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Star className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              {t.appointments.myAppointments.noFavorites}
            </p>
            <p className="text-muted-foreground text-center mt-2">
              {t.appointments.myAppointments.submitAppointmentHint}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
