"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for demonstration
const MOCK_APPOINTMENTS = [
  {
    id: "1",
    service: "Open a new account",
    branch: "Tripoli Tower Branch",
    date: "2025-01-15",
    time: "10:00 AM",
    status: "upcoming",
  },
  {
    id: "2",
    service: "Financing consultation",
    branch: "Misrata Branch",
    date: "2025-01-10",
    time: "02:00 PM",
    status: "completed",
  },
  {
    id: "3",
    service: "Update customer information (KYC)",
    branch: "Gargaresh Branch",
    date: "2024-12-20",
    time: "11:30 AM",
    status: "cancelled",
  },
]

export function AppointmentHistory() {
  return (
    <div className="space-y-4">
      {MOCK_APPOINTMENTS.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No appointments found. Book your first appointment to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        MOCK_APPOINTMENTS.map((appointment) => (
          <Card key={appointment.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{appointment.service}</CardTitle>
                    <Badge
                      variant={
                        appointment.status === "upcoming"
                          ? "default"
                          : appointment.status === "completed"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex flex-col gap-1">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {appointment.branch}
                    </span>
                  </CardDescription>
                </div>
                {appointment.status === "upcoming" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Reschedule</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(appointment.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{appointment.time}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
