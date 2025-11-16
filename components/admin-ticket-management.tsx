"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Clock, AlertCircle, MessageSquare, Send, User, Mail, Download, FileText, Image as ImageIcon, Eye, CheckCircle2, Gift } from "lucide-react"
import { Ticket, TicketAttachment } from "@/components/create-ticket"

export function TicketManagement() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false)
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [isReplyOpen, setIsReplyOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<string>("")
  const [assignEmail, setAssignEmail] = useState("")
  const [assignName, setAssignName] = useState("")
  const [replyMessage, setReplyMessage] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")

  // Load tickets from localStorage
  useEffect(() => {
    const loadTickets = () => {
      const storedTickets = localStorage.getItem("tickets")
      if (storedTickets) {
        setTickets(JSON.parse(storedTickets))
      }
    }
    loadTickets()
    // Listen for storage changes (when new tickets are created)
    window.addEventListener("storage", loadTickets)
    // Poll for changes (since storage event doesn't fire in same tab)
    const interval = setInterval(loadTickets, 1000)
    return () => {
      window.removeEventListener("storage", loadTickets)
      clearInterval(interval)
    }
  }, [])

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.service.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleViewDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setIsViewDetailsOpen(true)
  }

  const handleUpdateStatus = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setNewStatus(ticket.status)
    setIsUpdateStatusOpen(true)
  }

  const handleAssign = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setAssignEmail(ticket.assignedEmail || "")
    setAssignName(ticket.assignedTo || "")
    setIsAssignOpen(true)
  }

  const handleReply = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setReplyMessage("")
    setIsReplyOpen(true)
  }

  const saveStatusUpdate = () => {
    if (!selectedTicket) return

    const updatedTickets = tickets.map((t) => {
      if (t.id === selectedTicket.id) {
        const updated: Ticket = {
          ...t,
          status: newStatus as Ticket["status"],
          updatedAt: new Date().toISOString(),
          rejectionReason:
            newStatus === "rejected" && rejectionReason ? rejectionReason : t.rejectionReason,
        }
        return updated
      }
      return t
    })

    setTickets(updatedTickets)
    localStorage.setItem("tickets", JSON.stringify(updatedTickets))
    setIsUpdateStatusOpen(false)
    setRejectionReason("")
    setNewStatus("")
  }

  const saveAssign = () => {
    if (!selectedTicket || !assignEmail.trim()) return

    const updatedTickets = tickets.map((t) => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          assignedTo: assignName || "Unassigned",
          assignedEmail: assignEmail,
          updatedAt: new Date().toISOString(),
        }
      }
      return t
    })

    setTickets(updatedTickets)
    localStorage.setItem("tickets", JSON.stringify(updatedTickets))
    setIsAssignOpen(false)
    setAssignEmail("")
    setAssignName("")
  }

  const saveReply = () => {
    if (!selectedTicket || !replyMessage.trim()) return

    const updatedTickets = tickets.map((t) => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          replies: [
            ...(t.replies || []),
            {
              message: replyMessage,
              sentAt: new Date().toISOString(),
              sentBy: "Admin",
            },
          ],
          updatedAt: new Date().toISOString(),
        }
      }
      return t
    })

    setTickets(updatedTickets)
    localStorage.setItem("tickets", JSON.stringify(updatedTickets))
    setIsReplyOpen(false)
    setReplyMessage("")
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "rejected":
        return "destructive"
      case "in-progress":
        return "secondary"
      default:
        return "outline"
    }
  }

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

  const handleAcceptTicket = (ticket: Ticket) => {
    if (ticket.rewarded) return // Already rewarded

    // Award 20 points to the user
    const userNationalNumber = ticket.customer
    const userPoints = JSON.parse(localStorage.getItem("userRewardPoints") || "{}")
    const currentPoints = userPoints[userNationalNumber] || 0
    userPoints[userNationalNumber] = currentPoints + 20
    localStorage.setItem("userRewardPoints", JSON.stringify(userPoints))

    // Mark ticket as rewarded
    const updatedTickets = tickets.map((t) => {
      if (t.id === ticket.id) {
        return {
          ...t,
          rewarded: true,
          updatedAt: new Date().toISOString(),
        }
      }
      return t
    })

    setTickets(updatedTickets)
    localStorage.setItem("tickets", JSON.stringify(updatedTickets))
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by ticket ID, customer, or service..."
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
                <SelectItem value="rejected">Rejected</SelectItem>
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
      {filteredTickets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">No tickets found.</p>
          </CardContent>
        </Card>
      ) : (
        filteredTickets.map((ticket) => (
          <Card key={ticket.id}>
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
                        ticket.priority === "urgent" || ticket.priority === "high" ? "destructive" : "secondary"
                      }
                    >
                      {ticket.priority === "urgent" && <AlertCircle className="h-3 w-3 mr-1" />}
                      {ticket.priority}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(ticket.status)}>{ticket.status}</Badge>
                  </div>
                  <CardDescription>
                    Customer: {ticket.customer} • {ticket.serviceCategory}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs mb-1">Assigned To</div>
                  <div className="font-medium">{ticket.assignedTo || "Unassigned"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs mb-1">Created</div>
                  <div className="font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(ticket.createdAt)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs mb-1">Replies</div>
                  <div className="font-medium flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {ticket.replies?.length || 0}
                  </div>
                </div>
                {ticket.attachments && ticket.attachments.length > 0 && (
                  <div>
                    <div className="text-muted-foreground text-xs mb-1">Attachments</div>
                    <div className="font-medium flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {ticket.attachments.length}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button variant="default" size="sm" onClick={() => handleViewDetails(ticket)}>
                  View Details
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(ticket)}>
                  Update Status
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAssign(ticket)}>
                  Assign
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleReply(ticket)}>
                  <Send className="h-4 w-4 mr-2" />
                  Reply
                </Button>
                {ticket.status !== "rejected" && (
                  <Button
                    variant={ticket.rewarded ? "secondary" : "default"}
                    size="sm"
                    onClick={() => handleAcceptTicket(ticket)}
                    disabled={ticket.rewarded}
                  >
                    {ticket.rewarded ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Rewarded
                      </>
                    ) : (
                      <>
                        <Gift className="h-4 w-4 mr-2" />
                        Accept
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {/* View Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ticket Details</DialogTitle>
            <DialogDescription>Complete information about this feedback ticket</DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Ticket ID</Label>
                  <p className="font-mono text-sm">{selectedTicket.id}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <Badge variant={getStatusBadgeVariant(selectedTicket.status)} className="mt-1">
                    {selectedTicket.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Priority</Label>
                  <Badge variant="secondary" className="mt-1">
                    {selectedTicket.priority}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Service Category</Label>
                  <p className="text-sm">{selectedTicket.serviceCategory}</p>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs text-muted-foreground">Service</Label>
                  <p className="text-sm font-medium">{selectedTicket.service}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Customer National Number</Label>
                  <p className="text-sm">{selectedTicket.customer}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Customer Phone</Label>
                  <p className="text-sm">{selectedTicket.customerPhone}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Customer IBAN</Label>
                  <p className="text-sm">{selectedTicket.customerIban}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Assigned To</Label>
                  <p className="text-sm">{selectedTicket.assignedTo || "Unassigned"}</p>
                </div>
                {selectedTicket.assignedEmail && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Assigned Email</Label>
                    <p className="text-sm">{selectedTicket.assignedEmail}</p>
                  </div>
                )}
                <div>
                  <Label className="text-xs text-muted-foreground">Created At</Label>
                  <p className="text-sm">{formatDate(selectedTicket.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Last Updated</Label>
                  <p className="text-sm">{formatDate(selectedTicket.updatedAt)}</p>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <p className="text-sm mt-1 p-3 bg-muted rounded-lg">{selectedTicket.description}</p>
                </div>
                {selectedTicket.rejectionReason && (
                  <div className="sm:col-span-2">
                    <Label className="text-xs text-muted-foreground">Rejection Reason</Label>
                    <p className="text-sm mt-1 p-3 bg-destructive/10 text-destructive rounded-lg">
                      {selectedTicket.rejectionReason}
                    </p>
                  </div>
                )}
                {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                  <div className="sm:col-span-2">
                    <Label className="text-xs text-muted-foreground mb-2 block">Attachments</Label>
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
                    <Label className="text-xs text-muted-foreground mb-2 block">Replies</Label>
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
            <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateStatusOpen} onOpenChange={setIsUpdateStatusOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
            <DialogDescription>Change the status of this ticket</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newStatus === "rejected" && (
              <div className="space-y-2">
                <Label>Rejection Reason</Label>
                <Textarea
                  placeholder="Enter the reason for rejection (this will be visible to the customer)"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateStatusOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveStatusUpdate} disabled={!newStatus || (newStatus === "rejected" && !rejectionReason.trim())}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Ticket</DialogTitle>
            <DialogDescription>Assign this ticket to someone to work on it</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assign-name">Name (Optional)</Label>
              <Input
                id="assign-name"
                placeholder="Enter name"
                value={assignName}
                onChange={(e) => setAssignName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assign-email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="assign-email"
                type="email"
                placeholder="Enter email address"
                value={assignEmail}
                onChange={(e) => setAssignEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveAssign} disabled={!assignEmail.trim()}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Reply</DialogTitle>
            <DialogDescription>Send a reply to the customer who submitted this feedback</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Reply Message</Label>
              <Textarea
                placeholder="Enter your reply message..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReplyOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveReply} disabled={!replyMessage.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
