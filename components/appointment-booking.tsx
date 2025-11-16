"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AppointmentHistory } from "@/components/appointment-history"
import { Clock, Users, Building2, Star } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useEffect } from "react"

export function AppointmentBooking() {
  const { t, language } = useLanguage()
  
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


  // Service to Department/Person mapping with working hours
  type ResourceSchedule = {
    id: string
    name: string
    type: "department" | "person"
    schedule: string // e.g., "Everyday from 8 AM - 3 PM except Thursday from 8 AM - 4 PM"
  }

  // Default resources (fallback if localStorage is empty)
  const DEFAULT_SERVICE_TO_RESOURCES: Record<string, ResourceSchedule[]> = {
    "Edit account information": [
      { id: "account-dept", name: "Account Services Department", type: "department", schedule: "Everyday from 8 AM - 3 PM except Thursday from 8 AM - 4 PM" },
      { id: "account-specialist", name: "Account Specialist", type: "person", schedule: "Sunday to Wednesday: 9 AM - 2 PM, Thursday: 8 AM - 4 PM" },
      { id: "account-manager", name: "Account Manager", type: "person", schedule: "Monday to Friday: 8 AM - 3 PM" },
    ],
    "Activate a new card": [
      { id: "card-dept", name: "Card Services Department", type: "department", schedule: "Everyday from 8 AM - 3 PM except Thursday from 8 AM - 4 PM" },
      { id: "card-specialist", name: "Card Specialist", type: "person", schedule: "Sunday to Wednesday: 9 AM - 2 PM, Thursday: 8 AM - 4 PM" },
    ],
    "Receive a card (Debit / Platinum / VIP / Partner)": [
      { id: "card-dept", name: "Card Services Department", type: "department", schedule: "Everyday from 8 AM - 3 PM except Thursday from 8 AM - 4 PM" },
      { id: "card-distribution", name: "Card Distribution Team", type: "department", schedule: "Monday to Friday: 9 AM - 1 PM" },
    ],
    "Request a replacement for a lost card": [
      { id: "card-dept", name: "Card Services Department", type: "department", schedule: "Everyday from 8 AM - 3 PM except Thursday from 8 AM - 4 PM" },
      { id: "card-specialist", name: "Card Specialist", type: "person", schedule: "Sunday to Wednesday: 9 AM - 2 PM, Thursday: 8 AM - 4 PM" },
    ],
    "File a complaint about incorrect deduction": [
      { id: "complaints-dept", name: "Customer Complaints Department", type: "department", schedule: "Everyday from 8 AM - 3 PM" },
      { id: "complaints-officer", name: "Complaints Officer", type: "person", schedule: "Monday to Thursday: 8 AM - 2 PM, Friday: 9 AM - 1 PM" },
    ],
    "Update customer information (KYC)": [
      { id: "kyc-dept", name: "KYC Department", type: "department", schedule: "Everyday from 8 AM - 3 PM except Thursday from 8 AM - 4 PM" },
      { id: "kyc-specialist", name: "KYC Specialist", type: "person", schedule: "Sunday to Wednesday: 9 AM - 2 PM, Thursday: 8 AM - 4 PM" },
    ],
    "Financing consultation": [
      { id: "financing-dept", name: "Financing Department", type: "department", schedule: "Everyday from 8 AM - 3 PM except Thursday from 8 AM - 4 PM" },
      { id: "financing-advisor", name: "Financing Advisor", type: "person", schedule: "Monday to Friday: 8 AM - 3 PM" },
      { id: "senior-financing-advisor", name: "Senior Financing Advisor", type: "person", schedule: "Sunday to Wednesday: 9 AM - 2 PM, Thursday: 8 AM - 4 PM" },
    ],
    "Submit a financing request": [
      { id: "financing-dept", name: "Financing Department", type: "department", schedule: "Everyday from 8 AM - 3 PM except Thursday from 8 AM - 4 PM" },
      { id: "financing-advisor", name: "Financing Advisor", type: "person", schedule: "Monday to Friday: 8 AM - 3 PM" },
    ],
    "Track financing request status": [
      { id: "financing-dept", name: "Financing Department", type: "department", schedule: "Everyday from 8 AM - 3 PM" },
      { id: "financing-support", name: "Financing Support Team", type: "department", schedule: "Monday to Friday: 9 AM - 2 PM" },
    ],
    "Submit financing documents": [
      { id: "financing-dept", name: "Financing Department", type: "department", schedule: "Everyday from 8 AM - 3 PM except Thursday from 8 AM - 4 PM" },
      { id: "document-team", name: "Document Processing Team", type: "department", schedule: "Monday to Friday: 8 AM - 2 PM" },
    ],
    "Submit a Letter of Credit (LC) request": [
      { id: "corporate-dept", name: "Corporate Banking Department", type: "department", schedule: "Everyday from 8 AM - 3 PM except Thursday from 8 AM - 4 PM" },
      { id: "lc-specialist", name: "LC Processing Team", type: "department", schedule: "Monday to Friday: 9 AM - 1 PM" },
    ],
    "Receive a Letter of Guarantee": [
      { id: "corporate-dept", name: "Corporate Banking Department", type: "department", schedule: "Everyday from 8 AM - 3 PM except Thursday from 8 AM - 4 PM" },
      { id: "guarantee-team", name: "Guarantee Services Team", type: "department", schedule: "Sunday to Wednesday: 8 AM - 2 PM, Thursday: 8 AM - 4 PM" },
    ],
    "Review corporate files": [
      { id: "corporate-dept", name: "Corporate Banking Department", type: "department", schedule: "Everyday from 8 AM - 3 PM except Thursday from 8 AM - 4 PM" },
      { id: "corporate-manager", name: "Corporate Account Manager", type: "person", schedule: "Monday to Friday: 8 AM - 3 PM" },
    ],
    "Transfer operations (in-person)": [
      { id: "transfers-dept", name: "Transfer Operations Department", type: "department", schedule: "Everyday from 8 AM - 3 PM except Thursday from 8 AM - 4 PM" },
      { id: "transfer-specialist", name: "Transfer Processing Team", type: "department", schedule: "Monday to Friday: 9 AM - 2 PM" },
    ],
    "SWIFT transfers": [
      { id: "swift-dept", name: "SWIFT Operations Department", type: "department", schedule: "Everyday from 8 AM - 3 PM" },
      { id: "swift-team", name: "SWIFT Processing Team", type: "department", schedule: "Monday to Friday: 8 AM - 2 PM" },
    ],
    "RTGS transfers": [
      { id: "rtgs-dept", name: "RTGS Operations Department", type: "department", schedule: "Everyday from 8 AM - 3 PM except Thursday from 8 AM - 4 PM" },
      { id: "rtgs-team", name: "RTGS Processing Team", type: "department", schedule: "Sunday to Wednesday: 9 AM - 2 PM, Thursday: 8 AM - 4 PM" },
    ],
    "ACH transfers": [
      { id: "ach-dept", name: "ACH Operations Department", type: "department", schedule: "Everyday from 8 AM - 3 PM" },
      { id: "ach-team", name: "ACH Processing Team", type: "department", schedule: "Monday to Friday: 8 AM - 2 PM" },
    ],
  }

  const [serviceCategory, setServiceCategory] = useState("")
  const [service, setService] = useState("")
  const [favorites, setFavorites] = useState<ResourceSchedule[]>([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteAppointments")
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (e) {
        console.error("Error loading favorites:", e)
      }
    }
  }, [])

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("favoriteAppointments", JSON.stringify(favorites))
  }, [favorites])

  // Load resources and service mappings from localStorage
  const [serviceResourceMappings, setServiceResourceMappings] = useState<Record<string, string[]>>({})
  const [allResources, setAllResources] = useState<ResourceSchedule[]>([])

  useEffect(() => {
    // Load resources from localStorage
    const savedResources = localStorage.getItem("appointmentResources")
    const savedMappings = localStorage.getItem("serviceResourceMappings")
    
    if (savedResources) {
      try {
        setAllResources(JSON.parse(savedResources))
      } catch (e) {
        console.error("Error loading resources:", e)
      }
    }
    
    if (savedMappings) {
      try {
        setServiceResourceMappings(JSON.parse(savedMappings))
      } catch (e) {
        console.error("Error loading service mappings:", e)
      }
    }

    // Listen for storage changes
    const handleStorageChange = () => {
      const updatedResources = localStorage.getItem("appointmentResources")
      const updatedMappings = localStorage.getItem("serviceResourceMappings")
      if (updatedResources) {
        try {
          setAllResources(JSON.parse(updatedResources))
        } catch (e) {
          console.error("Error loading resources:", e)
        }
      }
      if (updatedMappings) {
        try {
          setServiceResourceMappings(JSON.parse(updatedMappings))
        } catch (e) {
          console.error("Error loading service mappings:", e)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    // Poll for changes (since storage event doesn't fire in same tab)
    const interval = setInterval(handleStorageChange, 1000)
    
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  // Get available resources for selected service
  const availableResources = useMemo(() => {
    if (!service) return []
    
    // First try to get from localStorage mappings
    const resourceIds = serviceResourceMappings[service] || []
    if (resourceIds.length > 0 && allResources.length > 0) {
      const mappedResources = allResources.filter((r) => resourceIds.includes(r.id))
      if (mappedResources.length > 0) {
        return mappedResources
      }
    }
    
    // Fallback to default resources
    return DEFAULT_SERVICE_TO_RESOURCES[service] || []
  }, [service, serviceResourceMappings, allResources])

  // Check if a resource is favorited
  const isFavorited = (resourceId: string) => {
    return favorites.some((fav) => fav.id === resourceId)
  }

  // Toggle favorite status
  const toggleFavorite = (resource: ResourceSchedule, e: React.MouseEvent) => {
    e.stopPropagation()
    if (isFavorited(resource.id)) {
      setFavorites(favorites.filter((fav) => fav.id !== resource.id))
    } else {
      setFavorites([...favorites, resource])
    }
  }


  return (
    <Tabs defaultValue="book" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="book">{t.appointments.bookAppointment}</TabsTrigger>
        <TabsTrigger value="history">{t.appointments.myAppointments}</TabsTrigger>
      </TabsList>

      <TabsContent value="book" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Service Schedule</CardTitle>
            <CardDescription>Select a service to view available departments and their working hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Service Category */}
            <div className="space-y-4">
              <Label>{t.appointments.selectServiceCategory}</Label>
              <Select
                value={serviceCategory}
                onValueChange={(value) => {
                  setServiceCategory(value)
                  setService("")
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.appointments.chooseServiceCategory} />
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

            {/* Step 2: Specific Service */}
            {serviceCategory && (
              <div className="space-y-4">
                <Label>{t.appointments.selectService}</Label>
                <Select
                  value={service}
                  onValueChange={(value) => {
                    setService(value)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.appointments.chooseService} />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_CATEGORIES[serviceCategory as keyof typeof SERVICE_CATEGORIES].services
                      .filter((svc) => {
                        // Remove "Open a new account" option when account services is selected
                        if (serviceCategory === "account") {
                          return svc !== "Open a new account" && svc !== "فتح حساب جديد"
                        }
                        return true
                      })
                      .map((svc) => (
                        <SelectItem key={svc} value={svc}>
                          {svc}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Schedule View - Departments/People with Working Hours */}
            {service && (
              <div className="space-y-4">
                <Label>Available Departments and People</Label>
                {availableResources.length > 0 ? (
                  <div className="space-y-3">
                    {availableResources.map((resource) => (
                      <Card
                        key={resource.id}
                        className="transition-all hover:border-primary/50"
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${
                              resource.type === "department" 
                                ? "bg-blue-100 text-blue-600" 
                                : "bg-green-100 text-green-600"
                            }`}>
                              {resource.type === "department" ? (
                                <Building2 className="h-4 w-4" />
                              ) : (
                                <Users className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <p className="font-medium">{resource.name}</p>
                                  <div className="mt-2 p-3 bg-muted/50 rounded-lg border">
                                    <div className="flex items-start gap-2">
                                      <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                      <div>
                                        <p className="text-xs font-medium text-muted-foreground mb-1">Working Hours:</p>
                                        <p className="text-sm font-medium">{resource.schedule}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant={resource.type === "department" ? "default" : "secondary"}>
                                    {resource.type === "department" ? "Dept" : "Person"}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={(e) => toggleFavorite(resource, e)}
                                  >
                                    <Star
                                      className={`h-4 w-4 ${
                                        isFavorited(resource.id)
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-muted-foreground"
                                      }`}
                                    />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 border rounded-lg bg-muted/30 text-center">
                    <p className="text-sm text-muted-foreground">
                      No departments or people available for this service. Please contact support.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history" className="mt-6">
        <AppointmentHistory 
          favorites={favorites} 
          onRemoveFavorite={(resourceId) => {
            setFavorites(favorites.filter((fav) => fav.id !== resourceId))
          }}
        />
      </TabsContent>
    </Tabs>
  )
}
