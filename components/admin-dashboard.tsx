"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TicketManagement } from "@/components/admin-ticket-management"
import { AppointmentManagement } from "@/components/admin-appointment-management"
import { ATMManagement } from "@/components/admin-atm-management"
import { RewardStatistics } from "@/components/admin-reward-statistics"
import { FileText, Calendar, MapPin, Clock } from "lucide-react"

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tickets</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">8 pending check-in</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active ATMs</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11/14</div>
            <p className="text-xs text-muted-foreground">2 under maintenance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-green-600">-0.5h from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="tickets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="tickets">Ticket Management</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="atms">ATM Status</TabsTrigger>
          <TabsTrigger value="rewards">Reward Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <TicketManagement />
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <AppointmentManagement />
        </TabsContent>

        <TabsContent value="atms" className="space-y-4">
          <ATMManagement />
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <RewardStatistics />
        </TabsContent>
      </Tabs>
    </div>
  )
}
