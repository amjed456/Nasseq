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
import { Building2, Users, Clock, Plus, Edit, Trash2, X } from "lucide-react"
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

  const getResourcesForService = (service: string): ResourceSchedule[] => {
    const resourceIds = serviceResources[service] || []
    return resources.filter((r) => resourceIds.includes(r.id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manage Departments & Specialists</h2>
          <p className="text-muted-foreground">Create and manage departments and people, assign them to services</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>

      <Tabs defaultValue="resources" className="space-y-4">
        <TabsList>
          <TabsTrigger value="resources">All Resources</TabsTrigger>
          <TabsTrigger value="services">Service Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search resources by name or schedule..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterType} onValueChange={(value) => setFilterType(value as typeof filterType)}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="department">Departments</SelectItem>
                    <SelectItem value="person">People</SelectItem>
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
                    ? "No resources created yet. Click 'Add Resource' to create your first department or person."
                    : "No resources match your search criteria."}
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
                            {resource.type === "department" ? "Department" : "Person"}
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
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleOpenAssign(resource)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Assign to Service
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
              <CardTitle>Service Resource Assignments</CardTitle>
              <CardDescription>
                View and manage which departments and people are assigned to each service
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
                    {serviceResources.length} resource(s) assigned
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {serviceResources.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No resources assigned to this service.</p>
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
      </Tabs>

      {/* Create Resource Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Resource</DialogTitle>
            <DialogDescription>Add a new department or person with their working schedule</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="e.g., Account Services Department or Account Specialist"
                value={newResourceName}
                onChange={(e) => setNewResourceName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={newResourceType} onValueChange={(value) => setNewResourceType(value as typeof newResourceType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="person">Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Working Schedule</Label>
              <Textarea
                placeholder="e.g., Everyday from 8 AM - 3 PM except Thursday from 8 AM - 4 PM"
                value={newResourceSchedule}
                onChange={(e) => setNewResourceSchedule(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateResource} disabled={!newResourceName.trim() || !newResourceSchedule.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Resource Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
            <DialogDescription>Update the resource information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="e.g., Account Services Department or Account Specialist"
                value={newResourceName}
                onChange={(e) => setNewResourceName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={newResourceType} onValueChange={(value) => setNewResourceType(value as typeof newResourceType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="person">Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Working Schedule</Label>
              <Textarea
                placeholder="e.g., Everyday from 8 AM - 3 PM except Thursday from 8 AM - 4 PM"
                value={newResourceSchedule}
                onChange={(e) => setNewResourceSchedule(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditResource} disabled={!newResourceName.trim() || !newResourceSchedule.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign to Service Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Resource to Service</DialogTitle>
            <DialogDescription>
              Select a service to assign "{selectedResource?.name}" to
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Service</Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
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
              Cancel
            </Button>
            <Button onClick={handleAssignToService} disabled={!selectedService}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
