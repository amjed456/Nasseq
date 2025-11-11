"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Clock, AlertCircle } from "lucide-react"

const ADMIN_TICKETS = [
  {
    id: "TKT-A1B2C3D4",
    customer: "Ahmed Hassan",
    category: "Request a new card",
    type: "Card Services",
    status: "in-progress",
    priority: "high",
    department: "Card Services",
    assignedTo: "Sara Mohammed",
    createdAt: "2025-01-12",
    lastUpdate: "2 hours ago",
  },
  {
    id: "TKT-E5F6G7H8",
    customer: "Fatima Ali",
    category: "Upload financing documents",
    type: "Financing Services",
    status: "under-review",
    priority: "medium",
    department: "Financing",
    assignedTo: "Omar Ibrahim",
    createdAt: "2025-01-10",
    lastUpdate: "1 day ago",
  },
  {
    id: "TKT-M3N4O5P6",
    customer: "Mohammed Khalil",
    category: "Transfer confirmation",
    type: "Transfer Services",
    status: "pending",
    priority: "urgent",
    department: "Transfers",
    assignedTo: "Unassigned",
    createdAt: "2025-01-13",
    lastUpdate: "30 minutes ago",
  },
]

export function TicketManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredTickets = ADMIN_TICKETS.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by ticket ID or customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Ticket List */}
      {filteredTickets.map((ticket) => (
        <Card key={ticket.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <CardTitle className="text-lg">{ticket.category}</CardTitle>
                  <Badge variant="outline" className="font-mono text-xs">
                    {ticket.id}
                  </Badge>
                  <Badge
                    variant={ticket.priority === "urgent" || ticket.priority === "high" ? "destructive" : "secondary"}
                  >
                    {ticket.priority === "urgent" && <AlertCircle className="h-3 w-3 mr-1" />}
                    {ticket.priority}
                  </Badge>
                  <Badge variant="outline">{ticket.status}</Badge>
                </div>
                <CardDescription>
                  Customer: {ticket.customer} • {ticket.type}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3 text-sm">
              <div>
                <div className="text-muted-foreground text-xs mb-1">Department</div>
                <div className="font-medium">{ticket.department}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs mb-1">Assigned To</div>
                <div className="font-medium">{ticket.assignedTo}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs mb-1">Last Update</div>
                <div className="font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {ticket.lastUpdate}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="default" size="sm">
                View Details
              </Button>
              <Button variant="outline" size="sm">
                Update Status
              </Button>
              <Button variant="outline" size="sm">
                Assign
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
