"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, User, CheckCircle2, Clock } from "lucide-react"

const ADMIN_APPOINTMENTS = [
  {
    id: "APT-001",
    customer: "Ali Mohammed",
    service: "Open a new account",
    branch: "Tripoli Tower",
    date: "2025-01-15",
    time: "10:00 AM",
    status: "confirmed",
  },
  {
    id: "APT-002",
    customer: "Layla Hassan",
    service: "Financing consultation",
    branch: "Misrata Branch",
    date: "2025-01-15",
    time: "11:00 AM",
    status: "pending",
  },
  {
    id: "APT-003",
    customer: "Youssef Ibrahim",
    service: "Update KYC information",
    branch: "Gargaresh Branch",
    date: "2025-01-15",
    time: "02:00 PM",
    status: "checked-in",
  },
  {
    id: "APT-004",
    customer: "Nour Ali",
    service: "Submit LC request",
    branch: "Tripoli Tower",
    date: "2025-01-15",
    time: "03:30 PM",
    status: "confirmed",
  },
]

export function AppointmentManagement() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2025, 0, 15))
  const [branchFilter, setBranchFilter] = useState("all")

  const filteredAppointments = ADMIN_APPOINTMENTS.filter((apt) => {
    const matchesBranch = branchFilter === "all" || apt.branch.includes(branchFilter)
    return matchesBranch
  })

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Calendar */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-base">Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
          <div className="mt-4 space-y-2">
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="Tripoli">Tripoli Branches</SelectItem>
                <SelectItem value="Misrata">Misrata Branch</SelectItem>
                <SelectItem value="Gargaresh">Gargaresh Branch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <div className="space-y-4 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Appointments for {selectedDate?.toLocaleDateString()}</CardTitle>
            <CardDescription>{filteredAppointments.length} appointments scheduled</CardDescription>
          </CardHeader>
        </Card>

        {filteredAppointments.map((apt) => (
          <Card key={apt.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <CardTitle className="text-lg">{apt.service}</CardTitle>
                    <Badge
                      variant={
                        apt.status === "checked-in" ? "default" : apt.status === "confirmed" ? "secondary" : "outline"
                      }
                      className="flex items-center gap-1"
                    >
                      {apt.status === "checked-in" && <CheckCircle2 className="h-3 w-3" />}
                      {apt.status === "confirmed" && <Clock className="h-3 w-3" />}
                      {apt.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex flex-col gap-1">
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      {apt.customer}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {apt.branch}
                    </span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{apt.time}</span>
                  <span>•</span>
                  <span className="font-mono text-xs">{apt.id}</span>
                </div>
                <div className="flex gap-2">
                  {apt.status === "pending" && (
                    <Button size="sm" variant="default">
                      Confirm
                    </Button>
                  )}
                  {apt.status === "confirmed" && (
                    <Button size="sm" variant="outline">
                      Check In
                    </Button>
                  )}
                  <Button size="sm" variant="ghost">
                    Reschedule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
