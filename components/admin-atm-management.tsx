"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, AlertTriangle, Wrench, CheckCircle2 } from "lucide-react"
import { useState } from "react"

const ATM_STATUS_DATA = [
  {
    id: "1",
    name: "Misrata ATM",
    location: "Misrata City Center",
    status: "active",
    cashLevel: 85,
    lastMaintenance: "2025-01-10",
    nextMaintenance: "2025-02-10",
    transactionsToday: 124,
    issues: [],
  },
  {
    id: "3",
    name: "Sorman ATM",
    location: "Sorman Main Street",
    status: "maintenance",
    cashLevel: 0,
    lastMaintenance: "2025-01-13",
    nextMaintenance: "2025-01-14",
    transactionsToday: 0,
    issues: ["Card reader malfunction", "Software update required"],
  },
  {
    id: "7",
    name: "Gargaresh ATM",
    location: "Gargaresh Area",
    status: "out-of-service",
    cashLevel: 15,
    lastMaintenance: "2025-01-05",
    nextMaintenance: "Pending",
    transactionsToday: 0,
    issues: ["Network connectivity issues", "Low cash alert"],
  },
  {
    id: "6",
    name: "Tripoli Tower ATM",
    location: "Tripoli Tower",
    status: "active",
    cashLevel: 92,
    lastMaintenance: "2025-01-08",
    nextMaintenance: "2025-02-08",
    transactionsToday: 156,
    issues: [],
  },
]

export function ATMManagement() {
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredATMs = ATM_STATUS_DATA.filter((atm) => {
    return statusFilter === "all" || atm.status === statusFilter
  })

  const getStatusColor = (status: string) => {
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

  const getCashLevelColor = (level: number) => {
    if (level >= 70) return "text-green-600"
    if (level >= 30) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Under Maintenance</SelectItem>
                <SelectItem value="out-of-service">Out of Service</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1" />
            <Button variant="outline">Schedule Maintenance</Button>
            <Button>Update Cash Levels</Button>
          </div>
        </CardContent>
      </Card>

      {/* ATM List */}
      {filteredATMs.map((atm) => (
        <Card key={atm.id} className="overflow-hidden">
          <div className="flex">
            <div className={`w-1.5 ${getStatusColor(atm.status)}`} />
            <div className="flex-1">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <CardTitle className="text-lg">{atm.name}</CardTitle>
                      <Badge
                        variant={
                          atm.status === "active"
                            ? "default"
                            : atm.status === "maintenance"
                              ? "secondary"
                              : "destructive"
                        }
                        className="flex items-center gap-1"
                      >
                        {atm.status === "active" && <CheckCircle2 className="h-3 w-3" />}
                        {atm.status === "maintenance" && <Wrench className="h-3 w-3" />}
                        {atm.status === "out-of-service" && <AlertTriangle className="h-3 w-3" />}
                        {atm.status}
                      </Badge>
                      {atm.issues.length > 0 && (
                        <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                          {atm.issues.length} issues
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {atm.location}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-4 text-sm">
                  <div>
                    <div className="text-muted-foreground text-xs mb-1">Cash Level</div>
                    <div className={`font-bold text-lg ${getCashLevelColor(atm.cashLevel)}`}>{atm.cashLevel}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs mb-1">Transactions Today</div>
                    <div className="font-bold text-lg">{atm.transactionsToday}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs mb-1">Last Maintenance</div>
                    <div className="font-medium">{new Date(atm.lastMaintenance).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs mb-1">Next Maintenance</div>
                    <div className="font-medium">
                      {atm.nextMaintenance !== "Pending"
                        ? new Date(atm.nextMaintenance).toLocaleDateString()
                        : "Pending"}
                    </div>
                  </div>
                </div>

                {atm.issues.length > 0 && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-red-600">Issues Reported:</div>
                        <ul className="text-sm text-red-700 space-y-0.5">
                          {atm.issues.map((issue, idx) => (
                            <li key={idx}>• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {atm.status === "active" && (
                    <Button variant="outline" size="sm">
                      <Wrench className="h-4 w-4 mr-2" />
                      Schedule Maintenance
                    </Button>
                  )}
                  {atm.status !== "active" && (
                    <Button variant="default" size="sm">
                      Mark as Active
                    </Button>
                  )}
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
