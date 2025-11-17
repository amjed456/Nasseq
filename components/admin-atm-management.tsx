"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { MapPin, AlertTriangle, Wrench, CheckCircle2, Plus, MessageSquare, Eye, Download, Image as ImageIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ATMFeedback } from "@/components/atm-locator"
import { useLanguage } from "@/contexts/language-context"

type ATM = {
  id: string
  name: string
  location: string
  status: "active" | "maintenance" | "out-of-service"
  cashLevel: number
  lastMaintenance: string
  nextMaintenance: string
  transactionsToday: number
  issues: string[]
  machineType: "ATM" | "Kiosk"
  kioskType?: "Kiosk Account Opener" | "Kiosk check printer" | "Kiosk for deposit" | "Kiosk check deposit"
}

const ATM_STATUS_DATA: ATM[] = [
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
    machineType: "ATM",
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
    machineType: "ATM",
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
    machineType: "ATM",
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
    machineType: "ATM",
  },
]

export function ATMManagement() {
  const { t } = useLanguage()
  const [statusFilter, setStatusFilter] = useState("all")
  const [atms, setAtms] = useState<ATM[]>(ATM_STATUS_DATA)
  const [addATMDialogOpen, setAddATMDialogOpen] = useState(false)
  const [updateCashDialogOpen, setUpdateCashDialogOpen] = useState(false)
  const [scheduleMaintenanceDialogOpen, setScheduleMaintenanceDialogOpen] = useState(false)
  const [atmFeedback, setAtmFeedback] = useState<ATMFeedback[]>([])
  const [selectedFeedback, setSelectedFeedback] = useState<ATMFeedback | null>(null)
  const [selectedATMForFeedback, setSelectedATMForFeedback] = useState<string | null>(null)
  const [viewFeedbackDialogOpen, setViewFeedbackDialogOpen] = useState(false)
  
  // Add ATM form state
  const [newATM, setNewATM] = useState({
    name: "",
    location: "",
    cashLevel: 100,
    machineType: "ATM" as "ATM" | "Kiosk",
    kioskType: "" as "" | "Kiosk Account Opener" | "Kiosk check printer" | "Kiosk for deposit" | "Kiosk check deposit",
  })
  
  // Update cash levels state
  const [cashLevelUpdate, setCashLevelUpdate] = useState<Record<string, number | undefined>>({})
  
  // Schedule maintenance state
  const [maintenanceDate, setMaintenanceDate] = useState<Date | undefined>(undefined)
  const [maintenanceATMs, setMaintenanceATMs] = useState<string[]>([])

  // Load ATM feedback from localStorage
  useEffect(() => {
    const loadFeedback = () => {
      const feedback = JSON.parse(localStorage.getItem("atmFeedback") || "[]")
      setAtmFeedback(feedback)
    }

    loadFeedback()

    // Listen for storage changes
    const handleStorageChange = () => {
      loadFeedback()
    }

    window.addEventListener("storage", handleStorageChange)
    const interval = setInterval(loadFeedback, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const getFeedbackForATM = (atmId: string) => {
    return atmFeedback.filter((f) => f.atmId === atmId)
  }

  const handleViewFeedback = (feedback: ATMFeedback) => {
    setSelectedFeedback(feedback)
    setSelectedATMForFeedback(feedback.atmId)
    setViewFeedbackDialogOpen(true)
  }

  const handleViewAllFeedback = (atmId: string) => {
    const feedbacks = getFeedbackForATM(atmId)
    if (feedbacks.length > 0) {
      setSelectedFeedback(feedbacks[0])
      setSelectedATMForFeedback(atmId)
      setViewFeedbackDialogOpen(true)
    }
  }

  const handleNextFeedback = () => {
    if (!selectedATMForFeedback || !selectedFeedback) return
    const feedbacks = getFeedbackForATM(selectedATMForFeedback)
    const currentIndex = feedbacks.findIndex((f) => f.id === selectedFeedback.id)
    if (currentIndex < feedbacks.length - 1) {
      setSelectedFeedback(feedbacks[currentIndex + 1])
    }
  }

  const handlePreviousFeedback = () => {
    if (!selectedATMForFeedback || !selectedFeedback) return
    const feedbacks = getFeedbackForATM(selectedATMForFeedback)
    const currentIndex = feedbacks.findIndex((f) => f.id === selectedFeedback.id)
    if (currentIndex > 0) {
      setSelectedFeedback(feedbacks[currentIndex - 1])
    }
  }

  const handleDownloadImage = (feedback: ATMFeedback) => {
    if (!feedback.imageAttachment) return

    const link = document.createElement("a")
    link.href = feedback.imageAttachment.data
    link.download = feedback.imageAttachment.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const filteredATMs = atms.filter((atm) => {
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

  const handleAddATM = () => {
    if (!newATM.name || !newATM.location) return
    if (newATM.machineType === "Kiosk" && !newATM.kioskType) return
    
    const atm: ATM = {
      id: Date.now().toString(),
      name: newATM.name,
      location: newATM.location,
      status: "active",
      cashLevel: newATM.cashLevel,
      lastMaintenance: new Date().toISOString().split("T")[0],
      nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      transactionsToday: 0,
      issues: [],
      machineType: newATM.machineType,
      kioskType: newATM.machineType === "Kiosk" && newATM.kioskType ? newATM.kioskType : undefined,
    }
    
    setAtms([...atms, atm])
    setNewATM({ name: "", location: "", cashLevel: 100, machineType: "ATM", kioskType: "" })
    setAddATMDialogOpen(false)
  }

  const handleUpdateCashLevels = () => {
    const updatedATMs = atms.map((atm) => {
      const newCashLevel = cashLevelUpdate[atm.id]
      if (newCashLevel !== undefined && newCashLevel >= 0 && newCashLevel <= 100) {
        return { ...atm, cashLevel: newCashLevel }
      }
      return atm
    })
    setAtms(updatedATMs)
    setCashLevelUpdate({})
    setUpdateCashDialogOpen(false)
  }

  const handleScheduleMaintenance = () => {
    if (!maintenanceDate || maintenanceATMs.length === 0) return
    
    const updatedATMs = atms.map((atm) => {
      if (maintenanceATMs.includes(atm.id)) {
        return {
          ...atm,
          status: "maintenance" as const,
          nextMaintenance: format(maintenanceDate, "yyyy-MM-dd"),
        }
      }
      return atm
    })
    setAtms(updatedATMs)
    setMaintenanceDate(undefined)
    setMaintenanceATMs([])
    setScheduleMaintenanceDialogOpen(false)
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
                <SelectItem value="all">{t.admin.atms.allStatus}</SelectItem>
                <SelectItem value="active">{t.admin.atms.active}</SelectItem>
                <SelectItem value="maintenance">{t.admin.atms.maintenance}</SelectItem>
                <SelectItem value="out-of-service">{t.admin.atms.outOfService}</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1" />
            <Dialog open={scheduleMaintenanceDialogOpen} onOpenChange={setScheduleMaintenanceDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">{t.admin.atms.scheduleMaintenance}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t.admin.atms.scheduleMaintenance}</DialogTitle>
                  <DialogDescription>
                    {t.admin.atms.scheduleMaintenanceDescription}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>{t.admin.atms.selectATMs}</Label>
                    <div className="max-h-48 overflow-y-auto space-y-2 border rounded-md p-2">
                      {atms.map((atm) => (
                        <div key={atm.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={maintenanceATMs.includes(atm.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setMaintenanceATMs([...maintenanceATMs, atm.id])
                              } else {
                                setMaintenanceATMs(maintenanceATMs.filter((id) => id !== atm.id))
                              }
                            }}
                            className="rounded"
                          />
                          <Label className="font-normal cursor-pointer">{atm.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t.admin.atms.maintenanceDate}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {maintenanceDate ? format(maintenanceDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={maintenanceDate}
                          onSelect={setMaintenanceDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setScheduleMaintenanceDialogOpen(false)}>
                    {t.common.cancel}
                  </Button>
                  <Button onClick={handleScheduleMaintenance} disabled={!maintenanceDate || maintenanceATMs.length === 0}>
                    {t.admin.atms.scheduleMaintenance}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={updateCashDialogOpen} onOpenChange={setUpdateCashDialogOpen}>
              <DialogTrigger asChild>
                <Button>{t.admin.atms.updateCashLevels}</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t.admin.atms.updateCashLevels}</DialogTitle>
                  <DialogDescription>
                    {t.admin.atms.updateCashLevelsDescription}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {atms.map((atm) => (
                    <div key={atm.id} className="flex items-center gap-4">
                      <div className="flex-1">
                        <Label>{atm.name}</Label>
                        <p className="text-sm text-muted-foreground">{atm.location}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          className="w-24"
                          placeholder={atm.cashLevel.toString()}
                          value={cashLevelUpdate[atm.id] ?? ""}
                          onChange={(e) => {
                            const value = e.target.value ? parseInt(e.target.value) : undefined
                            if (value !== undefined) {
                              setCashLevelUpdate({
                                ...cashLevelUpdate,
                                [atm.id]: value,
                              })
                            } else {
                              const newUpdate = { ...cashLevelUpdate }
                              delete newUpdate[atm.id]
                              setCashLevelUpdate(newUpdate)
                            }
                          }}
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setUpdateCashDialogOpen(false)}>
                    {t.common.cancel}
                  </Button>
                  <Button onClick={handleUpdateCashLevels}>{t.admin.atms.updateAll}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={addATMDialogOpen} onOpenChange={setAddATMDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add ATM
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t.admin.atms.addNewATM}</DialogTitle>
                  <DialogDescription>
                    {t.admin.atms.addATMDescription}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t.admin.atms.atmName}</Label>
                    <Input
                      id="name"
                      placeholder={t.admin.atms.atmNamePlaceholder}
                      value={newATM.name}
                      onChange={(e) => setNewATM({ ...newATM, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">{t.admin.atms.location}</Label>
                    <Input
                      id="location"
                      placeholder={t.admin.atms.locationPlaceholder}
                      value={newATM.location}
                      onChange={(e) => setNewATM({ ...newATM, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cashLevel">{t.admin.atms.initialCashLevel}</Label>
                    <Input
                      id="cashLevel"
                      type="number"
                      min="0"
                      max="100"
                      value={newATM.cashLevel}
                      onChange={(e) => setNewATM({ ...newATM, cashLevel: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="machineType">{t.admin.atms.machineType}</Label>
                    <Select
                      value={newATM.machineType}
                      onValueChange={(value: "ATM" | "Kiosk") => {
                        setNewATM({ ...newATM, machineType: value, kioskType: value === "ATM" ? "" : newATM.kioskType })
                      }}
                    >
                      <SelectTrigger id="machineType">
                        <SelectValue placeholder={t.admin.atms.selectMachineType} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ATM">ATM</SelectItem>
                        <SelectItem value="Kiosk">Kiosk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newATM.machineType === "Kiosk" && (
                    <div className="space-y-2">
                      <Label htmlFor="kioskType">{t.admin.atms.kioskType}</Label>
                      <Select
                        value={newATM.kioskType}
                        onValueChange={(value: "Kiosk Account Opener" | "Kiosk check printer" | "Kiosk for deposit" | "Kiosk check deposit") => {
                          setNewATM({ ...newATM, kioskType: value })
                        }}
                      >
                        <SelectTrigger id="kioskType">
                          <SelectValue placeholder={t.admin.atms.selectKioskType} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Kiosk Account Opener">{t.admin.atms.kioskAccountOpener}</SelectItem>
                          <SelectItem value="Kiosk check printer">{t.admin.atms.kioskCheckPrinter}</SelectItem>
                          <SelectItem value="Kiosk for deposit">{t.admin.atms.kioskForDeposit}</SelectItem>
                          <SelectItem value="Kiosk check deposit">{t.admin.atms.kioskCheckDeposit}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddATMDialogOpen(false)}>
                    {t.common.cancel}
                  </Button>
                  <Button 
                    onClick={handleAddATM} 
                    disabled={!newATM.name || !newATM.location || (newATM.machineType === "Kiosk" && !newATM.kioskType)}
                  >
                    {t.admin.atms.addATM}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {atm.machineType}
                      </Badge>
                      {atm.machineType === "Kiosk" && atm.kioskType && (
                        <Badge variant="secondary" className="text-xs">
                          {atm.kioskType}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-4 text-sm">
                  <div>
                    <div className="text-muted-foreground text-xs mb-1">{t.admin.atms.cashLevel}</div>
                    <div className={`font-bold text-lg ${getCashLevelColor(atm.cashLevel)}`}>{atm.cashLevel}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs mb-1">{t.admin.atms.transactionsToday}</div>
                    <div className="font-bold text-lg">{atm.transactionsToday}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs mb-1">{t.admin.atms.lastMaintenance}</div>
                    <div className="font-medium">{new Date(atm.lastMaintenance).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs mb-1">{t.admin.atms.nextMaintenance}</div>
                    <div className="font-medium">
                      {atm.nextMaintenance !== "Pending"
                        ? new Date(atm.nextMaintenance).toLocaleDateString()
                        : t.tickets.pending}
                    </div>
                  </div>
                </div>

                {atm.issues.length > 0 && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-red-600">{t.admin.atms.issuesReported}</div>
                        <ul className="text-sm text-red-700 space-y-0.5">
                          {atm.issues.map((issue, idx) => (
                            <li key={idx}>• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {getFeedbackForATM(atm.id).length > 0 && (
                  <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-blue-600 mb-1">
                          {getFeedbackForATM(atm.id).length} Feedback(s) Received
                        </div>
                        <div className="space-y-1">
                          {getFeedbackForATM(atm.id).slice(0, 2).map((feedback) => (
                            <div key={feedback.id} className="flex items-center justify-between">
                              <p className="text-xs text-blue-700 truncate flex-1">{feedback.description}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs ml-2"
                                onClick={() => handleViewFeedback(feedback)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          {getFeedbackForATM(atm.id).length > 2 && (
                            <p className="text-xs text-blue-600">
                              +{getFeedbackForATM(atm.id).length - 2} more feedback(s)
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    {t.common.viewDetails}
                  </Button>
                  {getFeedbackForATM(atm.id).length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewAllFeedback(atm.id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {t.admin.atms.viewFeedback} ({getFeedbackForATM(atm.id).length})
                    </Button>
                  )}
                  {atm.status === "active" && (
                    <Button variant="outline" size="sm">
                      <Wrench className="h-4 w-4 mr-2" />
                      {t.admin.atms.scheduleMaintenance}
                    </Button>
                  )}
                  {atm.status !== "active" && (
                    <Button variant="default" size="sm">
                      {t.admin.atms.markAsActive}
                    </Button>
                  )}
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      ))}

      {/* View Feedback Dialog */}
      <Dialog open={viewFeedbackDialogOpen} onOpenChange={setViewFeedbackDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.admin.atms.atmFeedback}</DialogTitle>
            <DialogDescription>
              {selectedFeedback && (
                <div className="flex items-center justify-between">
                  <span>{t.admin.atms.feedbackFor} {selectedFeedback.atmName}</span>
                  {selectedATMForFeedback && (
                    <span className="text-xs text-muted-foreground">
                      {getFeedbackForATM(selectedATMForFeedback).findIndex((f) => f.id === selectedFeedback.id) + 1} of {getFeedbackForATM(selectedATMForFeedback).length}
                    </span>
                  )}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-xs text-muted-foreground">{t.admin.atms.atmName}</Label>
                  <p className="text-sm font-medium">{selectedFeedback.atmName}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t.admin.atms.customer}</Label>
                  <p className="text-sm font-medium">{selectedFeedback.customer}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t.admin.atms.submittedAt}</Label>
                  <p className="text-sm">{formatDate(selectedFeedback.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t.admin.atms.feedbackID}</Label>
                  <p className="text-sm font-mono text-xs">{selectedFeedback.id}</p>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">{t.tickets.description}</Label>
                <p className="text-sm p-3 bg-muted rounded-lg">{selectedFeedback.description}</p>
              </div>
              {selectedFeedback.imageAttachment && (
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">{t.atm.actions.imageAttachment}</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 flex-1">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedFeedback.imageAttachment.name}</span>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleDownloadImage(selectedFeedback)}>
                        <Download className="h-4 w-4 mr-2" />
                        {t.tickets.download}
                      </Button>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <img
                        src={selectedFeedback.imageAttachment.data}
                        alt="Feedback attachment"
                        className="w-full h-auto max-h-96 object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex items-center justify-between">
            <div className="flex gap-2">
              {selectedATMForFeedback && selectedFeedback && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousFeedback}
                    disabled={
                      getFeedbackForATM(selectedATMForFeedback).findIndex((f) => f.id === selectedFeedback.id) === 0
                    }
                  >
                    {t.admin.atms.previous}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextFeedback}
                    disabled={
                      getFeedbackForATM(selectedATMForFeedback).findIndex((f) => f.id === selectedFeedback.id) ===
                      getFeedbackForATM(selectedATMForFeedback).length - 1
                    }
                  >
                    {t.admin.atms.next}
                  </Button>
                </>
              )}
            </div>
            <Button variant="outline" onClick={() => setViewFeedbackDialogOpen(false)}>
              {t.common.close}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
