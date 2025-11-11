"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FileText, Search, MessageSquare, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { useState } from "react"

const MOCK_TICKETS = [
  {
    id: "TKT-A1B2C3D4",
    category: "Request a new card",
    type: "Card Services",
    description: "Need to request a new Platinum debit card",
    status: "in-progress",
    department: "Card Services Department",
    createdAt: "2025-01-12",
    updatedAt: "2025-01-13",
    documents: 2,
    messages: 3,
  },
  {
    id: "TKT-E5F6G7H8",
    category: "Upload required financing documents",
    type: "Financing Services",
    description: "Uploading documents for home financing request",
    status: "under-review",
    department: "Financing Department",
    createdAt: "2025-01-10",
    updatedAt: "2025-01-10",
    documents: 5,
    messages: 1,
  },
  {
    id: "TKT-I9J0K1L2",
    category: "Monthly account statement",
    type: "Account Services",
    description: "Request for December 2024 account statement",
    status: "completed",
    department: "Account Services Department",
    createdAt: "2025-01-08",
    updatedAt: "2025-01-09",
    documents: 1,
    messages: 2,
  },
  {
    id: "TKT-M3N4O5P6",
    category: "Request transfer confirmation",
    type: "Transfer Services",
    description: "Need confirmation for international transfer to UAE",
    status: "rejected",
    department: "Transfer Department",
    createdAt: "2025-01-05",
    updatedAt: "2025-01-06",
    documents: 3,
    messages: 5,
  },
]

function getStatusIcon(status: string) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4" />
    case "rejected":
      return <XCircle className="h-4 w-4" />
    case "in-progress":
      return <Clock className="h-4 w-4" />
    default:
      return <AlertCircle className="h-4 w-4" />
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-500"
    case "rejected":
      return "bg-red-500"
    case "in-progress":
      return "bg-blue-500"
    case "under-review":
      return "bg-yellow-500"
    default:
      return "bg-gray-500"
  }
}

function getStatusLabel(status: string) {
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function TicketList() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTickets = MOCK_TICKETS.filter(
    (ticket) =>
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tickets by ID, category, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Ticket List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                No tickets found. Create your first support ticket to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="overflow-hidden">
              <div className="flex">
                <div className={`w-1.5 ${getStatusColor(ticket.status)}`} />
                <div className="flex-1">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <CardTitle className="text-lg">{ticket.category}</CardTitle>
                          <Badge variant="outline" className="font-mono text-xs">
                            {ticket.id}
                          </Badge>
                          <Badge
                            variant={
                              ticket.status === "completed"
                                ? "default"
                                : ticket.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="flex items-center gap-1"
                          >
                            {getStatusIcon(ticket.status)}
                            {getStatusLabel(ticket.status)}
                          </Badge>
                        </div>
                        <CardDescription>{ticket.description}</CardDescription>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="bg-muted px-2 py-1 rounded">{ticket.type}</span>
                          <span>•</span>
                          <span>{ticket.department}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-4 w-4" />
                        <span>{ticket.documents} documents</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="h-4 w-4" />
                        <span>{ticket.messages} messages</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {ticket.status === "in-progress" && (
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
