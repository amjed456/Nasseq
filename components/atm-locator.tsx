"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Navigation, DollarSign, Wrench, CheckCircle2, XCircle, Search } from "lucide-react"

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

function getStatusLabel(status: string) {
  switch (status) {
    case "active":
      return "Active"
    case "maintenance":
      return "Under Maintenance"
    case "out-of-service":
      return "Out of Service"
    default:
      return "Unknown"
  }
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
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState<string>("all")

  const cities = ["all", ...new Set(ATM_LOCATIONS.map((atm) => atm.city))]

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

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by location, address, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs value={selectedCity} onValueChange={setSelectedCity} className="w-full md:w-auto">
              <TabsList>
                {cities.map((city) => (
                  <TabsTrigger key={city} value={city} className="capitalize">
                    {city}
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Total ATMs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredATMs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active ATMs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeATMs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unavailable</CardTitle>
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
              <p className="text-muted-foreground text-center">No ATMs found matching your search criteria</p>
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
                            {getStatusLabel(atm.status)}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-start gap-1.5">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{atm.address}</span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Cash Available</div>
                          <div className="text-muted-foreground">{atm.cashAvailable ? "Yes" : "No"}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex h-4 w-4 items-center justify-center">
                          <div className="text-muted-foreground font-bold text-xs">MAX</div>
                        </div>
                        <div>
                          <div className="font-medium">Max Withdrawal</div>
                          <div className="text-muted-foreground">
                            {atm.maxWithdrawal > 0 ? `${atm.maxWithdrawal} LYD` : "N/A"}
                          </div>
                        </div>
                      </div>
                      {atm.status === "active" && (
                        <div className="flex items-center gap-2 text-sm">
                          <div>
                            <div className="font-medium">Congestion</div>
                            <Badge
                              variant="outline"
                              className={`mt-1 capitalize ${getCongestionColor(atm.congestion)}`}
                            >
                              {atm.congestion}
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
                        Get Directions
                      </Button>
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
