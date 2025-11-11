"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Upload, X } from "lucide-react"

const REQUEST_TYPES = {
  card: {
    label: "Card Services",
    requests: [
      "Request a new card",
      "Request a replacement for a lost card",
      "Request to increase card limit",
      "Request activation/deactivation",
    ],
    documents: ["ID Copy", "Card Application Form"],
  },
  account: {
    label: "Account Services",
    requests: [
      "Monthly account statement",
      "Annual account statement",
      "Edit account information",
      "Request balance certificate",
    ],
    documents: ["ID Verification", "Account Details Form"],
  },
  transfer: {
    label: "Transfer Services",
    requests: [
      "Upload documents for international transfers",
      "Request transfer confirmation",
      "Request transfer cancellation",
    ],
    documents: ["Transfer Authorization", "Beneficiary Details", "Source of Funds"],
  },
  financing: {
    label: "Financing Services",
    requests: ["Upload required financing documents", "Track financing request status", "Submit inquiries"],
    documents: ["Income Certificate", "Employment Letter", "Bank Statements", "Property Documents"],
  },
}

export function CreateTicket() {
  const [requestType, setRequestType] = useState("")
  const [requestCategory, setRequestCategory] = useState("")
  const [description, setDescription] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleFileUpload = (fileName: string) => {
    setUploadedFiles([...uploadedFiles, fileName])
  }

  const handleRemoveFile = (fileName: string) => {
    setUploadedFiles(uploadedFiles.filter((f) => f !== fileName))
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
  }

  const handleReset = () => {
    setRequestType("")
    setRequestCategory("")
    setDescription("")
    setUploadedFiles([])
    setIsSubmitted(false)
  }

  if (isSubmitted) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Ticket Created Successfully!</CardTitle>
          <CardDescription className="text-base">
            Your support ticket has been submitted and is being reviewed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Ticket ID:</span>
              <span className="text-sm font-medium font-mono">
                #TKT-{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Category:</span>
              <span className="text-sm font-medium">{requestCategory}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <span className="text-sm font-medium text-yellow-600">Under Review</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Documents:</span>
              <span className="text-sm font-medium">{uploadedFiles.length} uploaded</span>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-lg bg-primary/5 p-4 text-sm">
            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground">
              You will receive notifications as your ticket progresses through our departments. Average response time is
              24-48 hours.
            </p>
          </div>
          <Button onClick={handleReset} className="w-full">
            Create Another Ticket
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Support Ticket</CardTitle>
        <CardDescription>Submit your service request with all required information and documents</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Request Type */}
        <div className="space-y-2">
          <Label htmlFor="request-type">Request Type</Label>
          <Select
            value={requestType}
            onValueChange={(value) => {
              setRequestType(value)
              setRequestCategory("")
            }}
          >
            <SelectTrigger id="request-type">
              <SelectValue placeholder="Select request type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(REQUEST_TYPES).map(([key, type]) => (
                <SelectItem key={key} value={key}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Request Category */}
        {requestType && (
          <div className="space-y-2">
            <Label htmlFor="request-category">Specific Request</Label>
            <Select value={requestCategory} onValueChange={setRequestCategory}>
              <SelectTrigger id="request-category">
                <SelectValue placeholder="Select specific request" />
              </SelectTrigger>
              <SelectContent>
                {REQUEST_TYPES[requestType as keyof typeof REQUEST_TYPES].requests.map((req) => (
                  <SelectItem key={req} value={req}>
                    {req}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Description */}
        {requestCategory && (
          <>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide additional details about your request..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            {/* Document Upload */}
            <div className="space-y-3">
              <Label>Required Documents</Label>
              <div className="rounded-lg border border-dashed border-border p-6">
                <div className="space-y-3">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Upload the following documents:</p>
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {REQUEST_TYPES[requestType as keyof typeof REQUEST_TYPES].documents.map((doc) => (
                        <span key={doc} className="text-xs bg-muted px-2 py-1 rounded">
                          {doc}
                        </span>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFileUpload(`Document_${uploadedFiles.length + 1}.pdf`)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium">Uploaded Files:</p>
                      {uploadedFiles.map((file) => (
                        <div
                          key={file}
                          className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-sm"
                        >
                          <span>{file}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(file)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t">
              <Button
                onClick={handleSubmit}
                className="w-full"
                size="lg"
                disabled={!description || uploadedFiles.length === 0}
              >
                Submit Ticket
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
