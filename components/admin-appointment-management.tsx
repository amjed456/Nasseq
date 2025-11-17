"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Users, Clock, Plus, Edit, Trash2, X, Gift, CheckCircle2, Mail, Eye, Download, Image as ImageIcon, FileText } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export type ResourceSchedule = {
  id: string
  name: string
  type: "department" | "person"
  schedule: string
}

export function AppointmentManagement() {
  const { t } = useLanguage()
  const [resources, setResources] = useState<ResourceSchedule[]>([])
  const [serviceResources, setServiceResources] = useState<Record<string, string[]>>({})
  const [selectedService, setSelectedService] = useState<string>("")
  const [selectedResource, setSelectedResource] = useState<ResourceSchedule | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [newResourceName, setNewResourceName] = useState("")
  const [newResourceType, setNewResourceType] = useState<"department" | "person">("department")
  const [newResourceSchedule, setNewResourceSchedule] = useState("")
  const [filterType, setFilterType] = useState<"all" | "department" | "person">("all")
  const [searchQuery, setSearchQuery] = useState("")
  
  // Appointment requests state
  const [appointmentRequests, setAppointmentRequests] = useState<any[]>([])
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null)
  const [isViewAppointmentOpen, setIsViewAppointmentOpen] = useState(false)
  const [isAssignAppointmentOpen, setIsAssignAppointmentOpen] = useState(false)
  const [assignEmail, setAssignEmail] = useState("")
  const [assignName, setAssignName] = useState("")

  const SERVICE_CATEGORIES = {
    account: {
      label: t.appointments.serviceCategories.account.label,
      services: t.appointments.serviceCategories.account.services.filter((s) => s !== "Open a new account"),
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

  // Get all services
  const allServices = useMemo(() => {
    const services: string[] = []
    Object.values(SERVICE_CATEGORIES).forEach((category) => {
      category.services.forEach((service) => {
        services.push(service)
      })
    })
    return services
  }, [])

  // Load resources and service mappings from localStorage
  useEffect(() => {
    const savedResources = localStorage.getItem("appointmentResources")
    const savedServiceResources = localStorage.getItem("serviceResourceMappings")
    
    if (savedResources) {
      try {
        setResources(JSON.parse(savedResources))
      } catch (e) {
        console.error("Error loading resources:", e)
      }
    }
    
    if (savedServiceResources) {
      try {
        setServiceResources(JSON.parse(savedServiceResources))
      } catch (e) {
        console.error("Error loading service mappings:", e)
      }
    }
  }, [])

  // Save resources to localStorage
  useEffect(() => {
    if (resources.length > 0) {
      localStorage.setItem("appointmentResources", JSON.stringify(resources))
    }
  }, [resources])

  // Save service mappings to localStorage
  useEffect(() => {
    if (Object.keys(serviceResources).length > 0) {
      localStorage.setItem("serviceResourceMappings", JSON.stringify(serviceResources))
    }
  }, [serviceResources])

  // Load appointment requests from localStorage
  useEffect(() => {
    const loadAppointments = () => {
      const stored = localStorage.getItem("appointmentRequests")
      if (stored) {
        try {
          setAppointmentRequests(JSON.parse(stored))
        } catch (e) {
          console.error("Error loading appointments:", e)
        }
      }
    }
    loadAppointments()
    const handleStorageChange = () => loadAppointments()
    window.addEventListener("storage", handleStorageChange)
    const interval = setInterval(loadAppointments, 1000)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  // Save appointment requests to localStorage
  useEffect(() => {
    if (appointmentRequests.length > 0) {
      localStorage.setItem("appointmentRequests", JSON.stringify(appointmentRequests))
    }
  }, [appointmentRequests])

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesType = filterType === "all" || resource.type === filterType
      const matchesSearch =
        searchQuery === "" ||
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.schedule.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesType && matchesSearch
    })
  }, [resources, filterType, searchQuery])

  const handleCreateResource = () => {
    if (!newResourceName.trim() || !newResourceSchedule.trim()) return

    const newResource: ResourceSchedule = {
      id: `resource-${Math.random().toString(36).substr(2, 9)}`,
      name: newResourceName.trim(),
      type: newResourceType,
      schedule: newResourceSchedule.trim(),
    }

    setResources([...resources, newResource])
    setNewResourceName("")
    setNewResourceSchedule("")
    setNewResourceType("department")
    setIsCreateDialogOpen(false)
  }

  const handleEditResource = () => {
    if (!selectedResource || !newResourceName.trim() || !newResourceSchedule.trim()) return

    const updatedResources = resources.map((r) =>
      r.id === selectedResource.id
        ? {
            ...r,
            name: newResourceName.trim(),
            type: newResourceType,
            schedule: newResourceSchedule.trim(),
          }
        : r
    )

    setResources(updatedResources)
    setSelectedResource(null)
    setNewResourceName("")
    setNewResourceSchedule("")
    setNewResourceType("department")
    setIsEditDialogOpen(false)
  }

  const handleDeleteResource = (resourceId: string) => {
    if (confirm("Are you sure you want to delete this resource? It will be removed from all services.")) {
      // Remove from resources
      setResources(resources.filter((r) => r.id !== resourceId))
      
      // Remove from all service mappings
      const updatedMappings: Record<string, string[]> = {}
      Object.entries(serviceResources).forEach(([service, resourceIds]) => {
        updatedMappings[service] = resourceIds.filter((id) => id !== resourceId)
      })
      setServiceResources(updatedMappings)
    }
  }

  const handleOpenEdit = (resource: ResourceSchedule) => {
    setSelectedResource(resource)
    setNewResourceName(resource.name)
    setNewResourceType(resource.type)
    setNewResourceSchedule(resource.schedule)
    setIsEditDialogOpen(true)
  }

  const handleOpenAssign = (resource: ResourceSchedule) => {
    setSelectedResource(resource)
    setIsAssignDialogOpen(true)
  }

  const handleAssignToService = () => {
    if (!selectedResource || !selectedService) return

    const currentServiceResources = serviceResources[selectedService] || []
    if (!currentServiceResources.includes(selectedResource.id)) {
      setServiceResources({
        ...serviceResources,
        [selectedService]: [...currentServiceResources, selectedResource.id],
      })
    }
    setIsAssignDialogOpen(false)
    setSelectedService("")
  }

  const handleRemoveFromService = (service: string, resourceId: string) => {
    const currentServiceResources = serviceResources[service] || []
    setServiceResources({
      ...serviceResources,
      [service]: currentServiceResources.filter((id) => id !== resourceId),
    })
  }

  // Handle accept appointment (reward user)
  const handleAcceptAppointment = (appointment: any) => {
    if (appointment.rewarded) return

    // Award 20 points to the user
    const userNationalNumber = appointment.customer
    const userPoints = JSON.parse(localStorage.getItem("userRewardPoints") || "{}")
    const currentPoints = userPoints[userNationalNumber] || 0
    userPoints[userNationalNumber] = currentPoints + 20
    localStorage.setItem("userRewardPoints", JSON.stringify(userPoints))

    // Mark appointment as rewarded
    const updated = appointmentRequests.map((a) => {
      if (a.id === appointment.id) {
        return {
          ...a,
          rewarded: true,
          updatedAt: new Date().toISOString(),
        }
      }
      return a
    })

    setAppointmentRequests(updated)
  }

  // Handle assign appointment
  const handleAssignAppointment = () => {
    if (!selectedAppointment || !assignEmail || !assignName) return

    const updated = appointmentRequests.map((a) => {
      if (a.id === selectedAppointment.id) {
        return {
          ...a,
          assignedTo: assignName,
          assignedEmail: assignEmail,
          updatedAt: new Date().toISOString(),
        }
      }
      return a
    })

    setAppointmentRequests(updated)
    setIsAssignAppointmentOpen(false)
    setAssignEmail("")
    setAssignName("")
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB"
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  // Handle download attachment
  const handleDownloadAttachment = (appointment: any) => {
    if (!appointment.attachment) return

    const link = document.createElement("a")
    link.href = appointment.attachment.data
    link.download = appointment.attachment.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getResourcesForService = (service: string): ResourceSchedule[] => {
    const resourceIds = serviceResources[service] || []
    return resources.filter((r) => resourceIds.includes(r.id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t.admin.appointments.title}</h2>
          <p className="text-muted-foreground">{t.admin.appointments.description}</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t.admin.appointments.addResource}
        </Button>
      </div>

      <Tabs defaultValue="resources" className="space-y-4">
        <TabsList>
          <TabsTrigger value="resources">{t.admin.appointments.allResources}</TabsTrigger>
          <TabsTrigger value="services">{t.admin.appointments.serviceAssignments}</TabsTrigger>
          <TabsTrigger value="appointments">{t.admin.appointments.appointmentRequests}</TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <Input
                    placeholder={t.admin.appointments.searchResources}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterType} onValueChange={(value) => setFilterType(value as typeof filterType)}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder={t.admin.appointments.filterByType} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.admin.appointments.allTypes}</SelectItem>
                    <SelectItem value="department">{t.admin.appointments.departments}</SelectItem>
                    <SelectItem value="person">{t.admin.appointments.people}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Resources List */}
          {filteredResources.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  {resources.length === 0
                    ? t.admin.appointments.noResources
                    : t.admin.appointments.noResourcesMatch}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredResources.map((resource) => (
                <Card key={resource.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <CardTitle className="text-lg">{resource.name}</CardTitle>
                          <Badge variant={resource.type === "department" ? "default" : "secondary"}>
                            {resource.type === "department" ? (
                              <Building2 className="h-3 w-3 mr-1" />
                            ) : (
                              <Users className="h-3 w-3 mr-1" />
                            )}
                            {resource.type === "department" ? t.admin.appointments.departments : t.admin.appointments.people}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-muted/50 rounded-lg border">
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Working Hours:</p>
                          <p className="text-sm font-medium">{resource.schedule}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenEdit(resource)}>
                        <Edit className="h-4 w-4 mr-2" />
                        {t.common.edit}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleOpenAssign(resource)}>
                        <Plus className="h-4 w-4 mr-2" />
                        {t.admin.appointments.assignToService}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteResource(resource.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.admin.appointments.serviceResourceAssignments}</CardTitle>
              <CardDescription>
                {t.admin.appointments.viewAndManageAssignments}
              </CardDescription>
            </CardHeader>
          </Card>

          {allServices.map((service) => {
            const serviceResources = getResourcesForService(service)
            return (
              <Card key={service}>
                <CardHeader>
                  <CardTitle className="text-lg">{service}</CardTitle>
                  <CardDescription>
                    {serviceResources.length} {t.admin.appointments.resourcesAssigned}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {serviceResources.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t.admin.appointments.noResourcesAssigned}</p>
                  ) : (
                    <div className="space-y-2">
                      {serviceResources.map((resource) => (
                        <div
                          key={resource.id}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            {resource.type === "department" ? (
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Users className="h-4 w-4 text-muted-foreground" />
                            )}
                            <div>
                              <p className="text-sm font-medium">{resource.name}</p>
                              <p className="text-xs text-muted-foreground">{resource.schedule}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFromService(service, resource.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.admin.appointments.appointmentRequests}</CardTitle>
              <CardDescription>
                {t.admin.appointments.viewAndManage}
              </CardDescription>
            </CardHeader>
          </Card>

          {appointmentRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  {t.admin.appointments.noAppointments}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {appointmentRequests.map((appointment) => (
                <Card key={appointment.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <CardTitle className="text-lg">{appointment.title}</CardTitle>
                          <Badge variant={appointment.status === "pending" ? "secondary" : "default"}>
                            {appointment.status}
                          </Badge>
                          {appointment.rewarded && (
                            <Badge variant="outline" className="bg-green-50 text-green-600">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Rewarded
                            </Badge>
                          )}
                        </div>
                        <CardDescription>
                          <div className="flex items-center gap-2">
                            <span>Administrator: {appointment.administratorLabel}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span>{t.admin.appointments.customer}: {appointment.customer}</span>
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-1">{t.tickets.description}:</p>
                        <p className="text-sm text-muted-foreground">{appointment.description}</p>
                      </div>
                      {appointment.attachment && (
                        <div className="flex items-center gap-2">
                          {appointment.attachment.type.startsWith("image/") ? (
                            <ImageIcon className="h-4 w-4" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                          <span className="text-sm">{appointment.attachment.name}</span>
                        </div>
                      )}
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedAppointment(appointment)
                            setIsViewAppointmentOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {t.admin.tickets.viewDetails}
                        </Button>
                        {!appointment.rewarded && (
                          <Button
                            variant={appointment.rewarded ? "secondary" : "default"}
                            size="sm"
                            onClick={() => handleAcceptAppointment(appointment)}
                            disabled={appointment.rewarded}
                          >
                            {appointment.rewarded ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                {t.admin.tickets.rewarded}
                              </>
                            ) : (
                              <>
                                <Gift className="h-4 w-4 mr-2" />
                                {t.admin.tickets.accept}
                              </>
                            )}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedAppointment(appointment)
                            setAssignEmail(appointment.assignedEmail || "")
                            setAssignName(appointment.assignedTo || "")
                            setIsAssignAppointmentOpen(true)
                          }}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          {t.admin.tickets.assign}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Resource Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.admin.appointments.createNewResource}</DialogTitle>
            <DialogDescription>{t.admin.appointments.addNewResource}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t.admin.appointments.resourceName}</Label>
              <Input
                placeholder={t.admin.appointments.resourceNamePlaceholder}
                value={newResourceName}
                onChange={(e) => setNewResourceName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t.admin.appointments.resourceType}</Label>
              <Select value={newResourceType} onValueChange={(value) => setNewResourceType(value as typeof newResourceType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="department">{t.admin.appointments.departments}</SelectItem>
                  <SelectItem value="person">{t.admin.appointments.people}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t.admin.appointments.workingSchedule}</Label>
              <Textarea
                placeholder={t.admin.appointments.workingSchedulePlaceholder}
                value={newResourceSchedule}
                onChange={(e) => setNewResourceSchedule(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              {t.common.cancel}
            </Button>
            <Button onClick={handleCreateResource} disabled={!newResourceName.trim() || !newResourceSchedule.trim()}>
              {t.common.add}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Resource Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.admin.appointments.editResource}</DialogTitle>
            <DialogDescription>{t.admin.appointments.updateResource}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t.admin.appointments.resourceName}</Label>
              <Input
                placeholder={t.admin.appointments.resourceNamePlaceholder}
                value={newResourceName}
                onChange={(e) => setNewResourceName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t.admin.appointments.resourceType}</Label>
              <Select value={newResourceType} onValueChange={(value) => setNewResourceType(value as typeof newResourceType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="department">{t.admin.appointments.departments}</SelectItem>
                  <SelectItem value="person">{t.admin.appointments.people}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t.admin.appointments.workingSchedule}</Label>
              <Textarea
                placeholder={t.admin.appointments.workingSchedulePlaceholder}
                value={newResourceSchedule}
                onChange={(e) => setNewResourceSchedule(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              {t.common.cancel}
            </Button>
            <Button onClick={handleEditResource} disabled={!newResourceName.trim() || !newResourceSchedule.trim()}>
              {t.common.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign to Service Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.admin.appointments.assignToService}</DialogTitle>
            <DialogDescription>
              {t.admin.appointments.selectService}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t.tickets.service}</Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder={t.admin.appointments.selectService} />
                </SelectTrigger>
                <SelectContent>
                  {allServices.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              {t.common.cancel}
            </Button>
            <Button onClick={handleAssignToService} disabled={!selectedService}>
              {t.admin.appointments.assignToService}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Appointment Details Dialog */}
      <Dialog open={isViewAppointmentOpen} onOpenChange={setIsViewAppointmentOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.admin.tickets.viewDetails}</DialogTitle>
            <DialogDescription>
              {t.admin.appointments.viewAppointmentDetailsDescription}
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">{t.admin.appointments.appointmentID}</Label>
                  <p className="text-sm font-medium">{selectedAppointment.id}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">{t.admin.appointments.status}</Label>
                  <Badge variant={selectedAppointment.status === "pending" ? "secondary" : "default"}>
                    {selectedAppointment.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">{t.appointments.myAppointments.administrator}</Label>
                  <p className="text-sm font-medium">{selectedAppointment.administratorLabel}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">{t.admin.appointments.customer}</Label>
                  <p className="text-sm font-medium">{selectedAppointment.customer}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">{t.admin.appointments.customerPhone}</Label>
                  <p className="text-sm font-medium">{selectedAppointment.customerPhone}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">{t.admin.appointments.customerIBAN}</Label>
                  <p className="text-sm font-medium">{selectedAppointment.customerIban}</p>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs text-muted-foreground mb-1 block">{t.appointments.appointmentRequest.title}</Label>
                  <p className="text-sm font-medium">{selectedAppointment.title}</p>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs text-muted-foreground mb-1 block">{t.tickets.description}</Label>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.description}</p>
                </div>
                {selectedAppointment.attachment && (
                  <div className="sm:col-span-2">
                    <Label className="text-xs text-muted-foreground mb-2 block">{t.appointments.appointmentRequest.attachment}</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {selectedAppointment.attachment.type.startsWith("image/") ? (
                            <ImageIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          )}
                          <span className="text-sm truncate">{selectedAppointment.attachment.name}</span>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            ({formatFileSize(selectedAppointment.attachment.size)})
                          </span>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleDownloadAttachment(selectedAppointment)}>
                          <Download className="h-4 w-4 mr-2" />
                          {t.tickets.download}
                        </Button>
                      </div>
                      {selectedAppointment.attachment.type.startsWith("image/") && (
                        <div className="border rounded-lg overflow-hidden">
                          <img
                            src={selectedAppointment.attachment.data}
                            alt="Attachment"
                            className="w-full h-auto max-h-96 object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {selectedAppointment.assignedTo && (
                  <div className="sm:col-span-2">
                    <Label className="text-xs text-muted-foreground mb-1 block">{t.appointments.myAppointments.assignedTo}</Label>
                    <p className="text-sm font-medium">{selectedAppointment.assignedTo}</p>
                    <p className="text-xs text-muted-foreground">{selectedAppointment.assignedEmail}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewAppointmentOpen(false)}>
              {t.common.close}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Appointment Dialog */}
      <Dialog open={isAssignAppointmentOpen} onOpenChange={setIsAssignAppointmentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.admin.tickets.assign}</DialogTitle>
            <DialogDescription>
              {t.admin.appointments.assignAppointmentDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t.appointments.myAppointments.administrator}</Label>
              <Input
                placeholder={t.admin.appointments.enterAdministratorName}
                value={assignName}
                onChange={(e) => setAssignName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t.admin.appointments.administratorEmail}</Label>
              <Input
                type="email"
                placeholder={t.admin.appointments.enterAdministratorEmail}
                value={assignEmail}
                onChange={(e) => setAssignEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignAppointmentOpen(false)}>
              {t.common.cancel}
            </Button>
            <Button onClick={handleAssignAppointment} disabled={!assignEmail || !assignName}>
              {t.admin.tickets.assign}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
