"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FileText, Search, MessageSquare, Clock, CheckCircle2, XCircle, AlertCircle, Download, Image as ImageIcon, Eye } from "lucide-react"
import { useState, useEffect } from "react"
import { Ticket, TicketAttachment } from "@/components/create-ticket"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Get current user info
  const userNationalNumber = typeof window !== "undefined" ? localStorage.getItem("userNationalNumber") : null

  // Load user's tickets from localStorage
  useEffect(() => {
    const loadTickets = () => {
      const storedTickets = localStorage.getItem("tickets")
      if (storedTickets) {
        const allTickets: Ticket[] = JSON.parse(storedTickets)
        // Filter tickets for current user
        if (userNationalNumber) {
          const userTickets = allTickets.filter((t) => t.customer === userNationalNumber)
          setTickets(userTickets)
        } else {
          setTickets([])
        }
      }
    }
    loadTickets()
    // Poll for changes
    const interval = setInterval(loadTickets, 1000)
    return () => clearInterval(interval)
  }, [userNationalNumber])

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.serviceCategory.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB"
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  const handleDownloadAttachment = (attachment: TicketAttachment) => {
    const link = document.createElement("a")
    link.href = attachment.data
    link.download = attachment.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleViewAttachment = (attachment: TicketAttachment) => {
    if (attachment.type.startsWith("image/")) {
      const newWindow = window.open()
      if (newWindow) {
        newWindow.document.write(`<img src="${attachment.data}" style="max-width: 100%; height: auto;" />`)
      }
    } else {
      handleDownloadAttachment(attachment)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tickets by ID, service, or category..."
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
                No tickets found. Submit your first feedback to get started.
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
                          <CardTitle className="text-lg">{ticket.service}</CardTitle>
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
                          <span className="bg-muted px-2 py-1 rounded">{ticket.serviceCategory}</span>
                        </div>
                        {ticket.rejectionReason && (
                          <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <div className="flex items-start gap-2">
                              <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs font-medium text-destructive mb-1">Rejection Reason:</p>
                                <p className="text-sm text-destructive">{ticket.rejectionReason}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>Created: {formatDate(ticket.createdAt)}</span>
                      </div>
                      {ticket.attachments && ticket.attachments.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <FileText className="h-4 w-4" />
                          <span>{ticket.attachments.length} attachment(s)</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="h-4 w-4" />
                        <span>{ticket.replies?.length || 0} replies</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTicket(ticket)
                          setIsDetailsOpen(true)
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* View Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ticket Details</DialogTitle>
            <DialogDescription>Complete information about your feedback ticket</DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Ticket ID</p>
                  <p className="font-mono text-sm">{selectedTicket.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Badge
                    variant={
                      selectedTicket.status === "completed"
                        ? "default"
                        : selectedTicket.status === "rejected"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {getStatusLabel(selectedTicket.status)}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Service Category</p>
                  <p className="text-sm">{selectedTicket.serviceCategory}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Service</p>
                  <p className="text-sm font-medium">{selectedTicket.service}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Created At</p>
                  <p className="text-sm">{formatDate(selectedTicket.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
                  <p className="text-sm">{formatDate(selectedTicket.updatedAt)}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">Description</p>
                  <p className="text-sm mt-1 p-3 bg-muted rounded-lg">{selectedTicket.description}</p>
                </div>
                {selectedTicket.rejectionReason && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">Rejection Reason</p>
                    <p className="text-sm mt-1 p-3 bg-destructive/10 text-destructive rounded-lg">
                      {selectedTicket.rejectionReason}
                    </p>
                  </div>
                )}
                {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-muted-foreground mb-2">Attachments</p>
                    <div className="space-y-2">
                      {selectedTicket.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {attachment.type.startsWith("image/") ? (
                              <ImageIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            )}
                            <span className="text-sm truncate">{attachment.name}</span>
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              ({formatFileSize(attachment.size)})
                            </span>
                          </div>
                          <div className="flex gap-2 ml-2">
                            {attachment.type.startsWith("image/") && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewAttachment(attachment)}
                                className="h-8"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadAttachment(attachment)}
                              className="h-8"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedTicket.replies && selectedTicket.replies.length > 0 && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-muted-foreground mb-2">Admin Replies</p>
                    <div className="space-y-2">
                      {selectedTicket.replies.map((reply, idx) => (
                        <div key={idx} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium">{reply.sentBy}</span>
                            <span className="text-xs text-muted-foreground">{formatDate(reply.sentAt)}</span>
                          </div>
                          <p className="text-sm">{reply.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
