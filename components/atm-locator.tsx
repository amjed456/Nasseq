"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MapPin, Navigation, DollarSign, Wrench, CheckCircle2, XCircle, Search, MessageSquare, Upload, X, Image as ImageIcon, FileText } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export type ATMFeedback = {
  id: string
  atmId: string
  atmName: string
  customer: string
  description: string
  imageAttachment?: {
    name: string
    type: string
    data: string // base64
  }
  createdAt: string
}

const ATM_LOCATIONS = [
  {
    id: "1",
    name: "Misrata ATM",
    address: "Misrata City Center, Main Street",
    city: "Misrata",
    coordinates: { lat: 32.3756161, lng: 15.0837712 },
    status: "active",
    cashAvailable: true,
    maxWithdrawal: 2000,
    congestion: "low",
    mapUrl: "https://www.google.com/maps/place/32.3756161,15.0837712",
    machineType: "ATM" as const,
  },
  {
    id: "2",
    name: "Zliten ATM",
    address: "Zliten Downtown Area",
    city: "Zliten",
    coordinates: { lat: 32.4695976, lng: 14.5693255 },
    status: "active",
    cashAvailable: true,
    maxWithdrawal: 1500,
    congestion: "medium",
    mapUrl: "https://www.google.com/maps/place/32.4695976,14.5693255",
    machineType: "ATM" as const,
  },
  {
    id: "3",
    name: "Sorman ATM",
    address: "Sorman Main Street",
    city: "Sorman",
    coordinates: { lat: 32.7584125, lng: 12.5947031 },
    status: "maintenance",
    cashAvailable: false,
    maxWithdrawal: 0,
    congestion: "none",
    mapUrl: "https://www.google.com/maps/place/32.7584125,12.5947031",
    machineType: "ATM" as const,
  },
  {
    id: "4",
    name: "Sabha ATM",
    address: "Sabha City Center",
    city: "Sabha",
    coordinates: { lat: 27.0455874, lng: 14.4188677 },
    status: "active",
    cashAvailable: true,
    maxWithdrawal: 2000,
    congestion: "low",
    mapUrl: "https://www.google.com/maps/place/27.0455874,14.4188677",
    machineType: "ATM" as const,
  },
  {
    id: "5",
    name: "Tajoura ATM",
    address: "Tajoura District",
    city: "Tripoli",
    coordinates: { lat: 32.8914852, lng: 13.3402398 },
    status: "active",
    cashAvailable: true,
    maxWithdrawal: 2000,
    congestion: "high",
    mapUrl: "https://www.google.com/maps/place/32.8914852,13.3402398",
    machineType: "ATM" as const,
  },
  {
    id: "6",
    name: "Tripoli Tower ATM",
    address: "Tripoli Tower, Business District",
    city: "Tripoli",
    coordinates: { lat: 32.8918934, lng: 13.1676376 },
    status: "active",
    cashAvailable: true,
    maxWithdrawal: 3000,
    congestion: "medium",
    mapUrl: "https://www.google.com/maps/place/32.8918934,13.1676376",
    machineType: "ATM" as const,
  },
  {
    id: "7",
    name: "Gargaresh ATM",
    address: "Gargaresh Area",
    city: "Tripoli",
    coordinates: { lat: 32.8652184, lng: 13.1074416 },
    status: "out-of-service",
    cashAvailable: false,
    maxWithdrawal: 0,
    congestion: "none",
    mapUrl: "https://www.google.com/maps/place/32.8652184,13.1074416",
    machineType: "ATM" as const,
  },
  {
    id: "8",
    name: "Abu Sleem ATM",
    address: "Abu Sleem District",
    city: "Tripoli",
    coordinates: { lat: 32.8680379, lng: 13.1660046 },
    status: "active",
    cashAvailable: true,
    maxWithdrawal: 1500,
    congestion: "low",
    mapUrl: "https://www.google.com/maps/place/32.8680379,13.1660046",
    machineType: "ATM" as const,
  },
  {
    id: "9",
    name: "Bab Ben Ghashir ATM",
    address: "Bab Ben Ghashir",
    city: "Tripoli",
    coordinates: { lat: 32.8688393, lng: 13.1960908 },
    status: "active",
    cashAvailable: false,
    maxWithdrawal: 2000,
    congestion: "low",
    mapUrl: "https://www.google.com/maps/place/32.8688393,13.1960908",
    machineType: "ATM" as const,
  },
  {
    id: "10",
    name: "Janzour ATM",
    address: "Janzour Area",
    city: "Tripoli",
    coordinates: { lat: 32.8689362, lng: 13.1989504 },
    status: "active",
    cashAvailable: true,
    maxWithdrawal: 2000,
    congestion: "medium",
    mapUrl: "https://www.google.com/maps/place/32.8689362,13.1989504",
    machineType: "ATM" as const,
  },
  {
    id: "11",
    name: "General Administration ATM",
    address: "General Administration Building (Internal)",
    city: "Tripoli",
    coordinates: { lat: 32.90566477700083, lng: 13.229422205698722 },
    status: "active",
    cashAvailable: true,
    maxWithdrawal: 2500,
    congestion: "low",
    mapUrl: "https://www.google.com/maps/place/32.90566477700083,13.229422205698722",
    machineType: "ATM" as const,
  },
]

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-green-500"
    case "maintenance":
      return "bg-yellow-500"
    case "out-of-service":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

function getStatusLabel(status: string, t: any) {
  const statusMap: Record<string, string> = {
    "active": t.atm.status.available,
    "maintenance": t.atm.status.maintenance,
    "out-of-service": t.atm.status.outOfService,
  }
  return statusMap[status] || "Unknown"
}

function getCongestionColor(congestion: string) {
  switch (congestion) {
    case "low":
      return "text-green-600 bg-green-50 border-green-200"
    case "medium":
      return "text-yellow-600 bg-yellow-50 border-yellow-200"
    case "high":
      return "text-red-600 bg-red-50 border-red-200"
    default:
      return "text-gray-600 bg-gray-50 border-gray-200"
  }
}

export function ATMLocator() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)
  const [selectedATM, setSelectedATM] = useState<typeof ATM_LOCATIONS[0] | null>(null)
  const [feedbackDescription, setFeedbackDescription] = useState("")
  const [feedbackImage, setFeedbackImage] = useState<{ name: string; type: string; data: string } | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const cities = ["all", ...new Set(ATM_LOCATIONS.map((atm) => atm.city))]
  
  const getCityLabel = (city: string) => {
    if (city === "all") return t.atm.cities.all
    const cityMap: Record<string, string> = {
      "Misrata": t.atm.cities.misrata,
      "Zliten": t.atm.cities.zliten,
      "Sorman": t.atm.cities.sorman,
      "Sabha": t.atm.cities.sabha,
      "Tripoli": t.atm.cities.tripoli,
    }
    return cityMap[city] || city
  }

  const filteredATMs = ATM_LOCATIONS.filter((atm) => {
    const matchesSearch =
      atm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      atm.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      atm.city.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCity = selectedCity === "all" || atm.city === selectedCity
    return matchesSearch && matchesCity
  })

  const activeATMs = filteredATMs.filter((atm) => atm.status === "active")
  const inactiveATMs = filteredATMs.filter((atm) => atm.status !== "active")

  const handleOpenFeedback = (atm: typeof ATM_LOCATIONS[0]) => {
    setSelectedATM(atm)
    setFeedbackDescription("")
    setFeedbackImage(null)
    setFeedbackDialogOpen(true)
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    // Validate file type (only images)
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPG, PNG, etc.)")
      return
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      alert("File size must be less than 5MB")
      return
    }

    // Convert to base64
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64Data = e.target?.result as string
      setFeedbackImage({
        name: file.name,
        type: file.type,
        data: base64Data,
      })
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setFeedbackImage(null)
  }

  const handleSubmitFeedback = () => {
    if (!selectedATM || !feedbackDescription.trim()) return

    const userNationalNumber = localStorage.getItem("userNationalNumber") || "Unknown"

    const feedback: ATMFeedback = {
      id: `atm-feedback-${Math.random().toString(36).substr(2, 9)}`,
      atmId: selectedATM.id,
      atmName: selectedATM.name,
      customer: userNationalNumber,
      description: feedbackDescription.trim(),
      imageAttachment: feedbackImage || undefined,
      createdAt: new Date().toISOString(),
    }

    // Save to localStorage
    const existingFeedback = JSON.parse(localStorage.getItem("atmFeedback") || "[]")
    existingFeedback.push(feedback)
    localStorage.setItem("atmFeedback", JSON.stringify(existingFeedback))

    // Reset form
    setFeedbackDescription("")
    setFeedbackImage(null)
    setFeedbackDialogOpen(false)
    setSelectedATM(null)

    alert(t.atm.actions.feedbackSubmitted)
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t.atm.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs value={selectedCity} onValueChange={setSelectedCity} className="w-full md:w-auto">
              <TabsList>
                {cities.map((city) => (
                  <TabsTrigger key={city} value={city} className="capitalize">
                    {getCityLabel(city)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.atm.statistics.totalATMs}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredATMs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.atm.statistics.activeATMs}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeATMs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.atm.statistics.unavailable}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inactiveATMs.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* ATM List */}
      <div className="space-y-4">
        {filteredATMs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">{t.atm.noATMsFound}</p>
            </CardContent>
          </Card>
        ) : (
          filteredATMs.map((atm) => (
            <Card key={atm.id} className="overflow-hidden">
              <div className="flex">
                <div className={`w-1.5 ${getStatusColor(atm.status)}`} />
                <div className="flex-1">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-xl">{atm.name}</CardTitle>
                          <Badge
                            variant={atm.status === "active" ? "default" : "secondary"}
                            className="flex items-center gap-1"
                          >
                            {atm.status === "active" ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : atm.status === "maintenance" ? (
                              <Wrench className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            {getStatusLabel(atm.status, t)}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-start gap-1.5">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{atm.address}</span>
                        </CardDescription>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {atm.machineType}
                          </Badge>
                          {(atm as any).kioskType && (
                            <Badge variant="secondary" className="text-xs">
                              {(atm as any).kioskType}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{t.atm.details.cashAvailable}</div>
                          <div className="text-muted-foreground">{atm.cashAvailable ? t.atm.details.yes : t.atm.details.no}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex h-4 w-4 items-center justify-center">
                          <div className="text-muted-foreground font-bold text-xs">MAX</div>
                        </div>
                        <div>
                          <div className="font-medium">{t.atm.details.maxWithdrawal}</div>
                          <div className="text-muted-foreground">
                            {atm.maxWithdrawal > 0 ? `${atm.maxWithdrawal} LYD` : t.atm.details.na}
                          </div>
                        </div>
                      </div>
                      {atm.status === "active" && (
                        <div className="flex items-center gap-2 text-sm">
                          <div>
                            <div className="font-medium">{t.atm.details.congestion}</div>
                            <Badge
                              variant="outline"
                              className={`mt-1 capitalize ${getCongestionColor(atm.congestion)}`}
                            >
                              {atm.congestion === "low" ? t.atm.details.low : atm.congestion === "medium" ? t.atm.details.medium : atm.congestion === "high" ? t.atm.details.high : t.atm.details.none}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 bg-transparent"
                        onClick={() => window.open(atm.mapUrl, "_blank")}
                      >
                        <Navigation className="h-4 w-4" />
                        {t.atm.actions.getDirections}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => handleOpenFeedback(atm)}
                      >
                        <MessageSquare className="h-4 w-4" />
                        {t.atm.actions.submitFeedback}
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Feedback Dialog */}
      <Dialog
        open={feedbackDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setFeedbackDialogOpen(false)
            setSelectedATM(null)
            setFeedbackDescription("")
            setFeedbackImage(null)
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.atm.actions.submitFeedback} {selectedATM?.name}</DialogTitle>
            <DialogDescription>
              {t.atm.actions.shareExperience}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t.atm.actions.description}</Label>
              <Textarea
                placeholder={t.atm.actions.descriptionPlaceholder}
                value={feedbackDescription}
                onChange={(e) => setFeedbackDescription(e.target.value)}
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <Label>{t.atm.actions.imageAttachment}</Label>
              {!feedbackImage ? (
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
                                      {t.atm.actions.dragDropImage}
                                    </p>
                                    <p className="text-xs text-muted-foreground mb-4">
                                      {t.atm.actions.supportedFormats}
                                    </p>
                                    <input
                                      type="file"
                                      id="atm-feedback-image"
                                      className="hidden"
                                      accept="image/*"
                                      onChange={(e) => handleFileSelect(e.target.files)}
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => document.getElementById("atm-feedback-image")?.click()}
                                    >
                                      <Upload className="h-4 w-4 mr-2" />
                                      {t.atm.actions.chooseImage}
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <ImageIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <span className="text-sm truncate">{feedbackImage.name}</span>
                                  </div>
                                  <Button variant="ghost" size="sm" onClick={handleRemoveImage} className="h-8 w-8 p-0">
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setFeedbackDialogOpen(false)}>
                              {t.common.cancel}
                            </Button>
                            <Button onClick={handleSubmitFeedback} disabled={!feedbackDescription.trim()}>
                              {t.atm.actions.submitFeedback}
                            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
