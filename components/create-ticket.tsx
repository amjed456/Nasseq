"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Upload, X, FileText, Image as ImageIcon } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export type TicketAttachment = {
  id: string
  name: string
  type: string
  size: number
  data: string // base64 encoded file data
}

export type Ticket = {
  id: string
  customer: string
  customerPhone: string
  customerIban: string
  service: string
  serviceCategory: string
  description: string
  status: "pending" | "under-review" | "in-progress" | "completed" | "rejected"
  priority: "low" | "medium" | "high" | "urgent"
  assignedTo?: string
  assignedEmail?: string
  createdAt: string
  updatedAt: string
  replies?: { message: string; sentAt: string; sentBy: string }[]
  rejectionReason?: string
  attachments?: TicketAttachment[]
  rewarded?: boolean
}

export function CreateTicket() {
  const { t, language } = useLanguage()
  const [serviceCategory, setServiceCategory] = useState("")
  const [service, setService] = useState("")
  const [description, setDescription] = useState("")
  const [attachments, setAttachments] = useState<TicketAttachment[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const SERVICE_CATEGORIES = {
    account: {
      label: t.appointments.serviceCategories.account.label,
      services: t.appointments.serviceCategories.account.services,
    },
    financing: {
      label: t.appointments.serviceCategories.financing.label,
      services: t.appointments.serviceCategories.financing.services,
    },
    corporate: {
      label: t.appointments.serviceCategories.corporate.label,
      services: t.appointments.serviceCategories.corporate.services,
    },
  }

  const handleSubmit = () => {
    // Get user info from localStorage (stored during login)
    const userInfo = {
      nationalNumber: localStorage.getItem("userNationalNumber") || "N/A",
      phoneNumber: localStorage.getItem("userPhoneNumber") || "N/A",
      iban: localStorage.getItem("userIban") || "N/A",
    }

    // Create ticket
    const ticket: Ticket = {
      id: `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      customer: userInfo.nationalNumber,
      customerPhone: userInfo.phoneNumber,
      customerIban: userInfo.iban,
      service: service,
      serviceCategory: SERVICE_CATEGORIES[serviceCategory as keyof typeof SERVICE_CATEGORIES]?.label || "",
      description: description,
      status: "pending",
      priority: "medium",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replies: [],
      attachments: attachments.length > 0 ? attachments : undefined,
    }

    // Save to localStorage
    const existingTickets = JSON.parse(localStorage.getItem("tickets") || "[]")
    existingTickets.push(ticket)
    localStorage.setItem("tickets", JSON.stringify(existingTickets))

    setIsSubmitted(true)
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "application/pdf"]
      if (!validTypes.includes(file.type)) {
        alert(`File type ${file.type} is not supported. Please upload PDF or image files.`)
        return
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`)
        return
      }

      // Convert file to base64
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64Data = e.target?.result as string
        const attachment: TicketAttachment = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64Data,
        }
        setAttachments((prev) => [...prev, attachment])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB"
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  const handleReset = () => {
    setServiceCategory("")
    setService("")
    setDescription("")
    setAttachments([])
    setIsSubmitted(false)
  }

  if (isSubmitted) {
    const tickets = JSON.parse(localStorage.getItem("tickets") || "[]")
    const lastTicket = tickets[tickets.length - 1]

    return (
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Feedback Submitted Successfully!</CardTitle>
          <CardDescription className="text-base">
            Your feedback has been submitted and is being reviewed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Ticket ID:</span>
              <span className="text-sm font-medium font-mono">{lastTicket?.id || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Service:</span>
              <span className="text-sm font-medium">{lastTicket?.service || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <span className="text-sm font-medium text-yellow-600">Pending</span>
            </div>
            {lastTicket?.attachments && lastTicket.attachments.length > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Attachments:</span>
                <span className="text-sm font-medium">{lastTicket.attachments.length} file(s)</span>
              </div>
            )}
          </div>
          <div className="flex items-start gap-2 rounded-lg bg-primary/5 p-4 text-sm">
            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground">
              You will receive notifications as your feedback is reviewed. Average response time is 24-48 hours.
            </p>
          </div>
          <Button onClick={handleReset} className="w-full">
            Submit Another Feedback
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Get all services from all categories
  const allServices: string[] = []
  Object.values(SERVICE_CATEGORIES).forEach((category) => {
    category.services.forEach((service) => {
      if (service !== "Open a new account") {
        allServices.push(service)
      }
    })
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Feedback</CardTitle>
        <CardDescription>Select the service you have or had a problem with and describe your issue</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Service Category */}
        <div className="space-y-2">
          <Label htmlFor="service-category">Service Category</Label>
          <Select
            value={serviceCategory}
            onValueChange={(value) => {
              setServiceCategory(value)
              setService("")
            }}
          >
            <SelectTrigger id="service-category">
              <SelectValue placeholder="Select service category" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SERVICE_CATEGORIES).map(([key, category]) => (
                <SelectItem key={key} value={key}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Service Selection */}
        {serviceCategory && (
          <div className="space-y-2">
            <Label htmlFor="service">Service</Label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger id="service">
                <SelectValue placeholder="Select the service you have a problem with" />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_CATEGORIES[serviceCategory as keyof typeof SERVICE_CATEGORIES]?.services
                  .filter((s) => s !== "Open a new account")
                  .map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Description */}
        {service && (
          <>
            <div className="space-y-2">
              <Label htmlFor="description">Describe Your Problem</Label>
              <Textarea
                id="description"
                placeholder="Please provide details about the problem you encountered with this service..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>Attachments (Optional)</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                  isDragOver ? "border-primary bg-primary/5" : "border-border"
                }`}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragOver(true)
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDragOver(false)
                  handleFileSelect(e.dataTransfer.files)
                }}
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop files here, or click to select
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Supported formats: PDF, JPG, PNG (Max 10MB per file)
                  </p>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.gif"
                    multiple
                    onChange={(e) => handleFileSelect(e.target.files)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                </div>
              </div>

              {/* Attached Files List */}
              {attachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Attached Files:</p>
                  <div className="space-y-2">
                    {attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-sm"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {attachment.type.startsWith("image/") ? (
                            <ImageIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          )}
                          <span className="truncate">{attachment.name}</span>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            ({formatFileSize(attachment.size)})
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAttachment(attachment.id)}
                          className="h-6 w-6 p-0 ml-2 flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t">
              <Button
                onClick={handleSubmit}
                className="w-full"
                size="lg"
                disabled={!description.trim()}
              >
                Submit Feedback
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
