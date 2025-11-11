"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AppointmentHistory } from "@/components/appointment-history"
import { CheckCircle2, Clock } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

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

  const BRANCHES = [
    { id: "misrata", name: t.appointments.branches.misrata, address: "Misrata City Center" },
    { id: "zliten", name: t.appointments.branches.zliten, address: "Zliten Downtown" },
    { id: "sorman", name: t.appointments.branches.sorman, address: "Sorman Main Street" },
    { id: "sabha", name: t.appointments.branches.sabha, address: "Sabha City Center" },
    { id: "tajoura", name: t.appointments.branches.tajoura, address: "Tajoura District" },
    { id: "tripoli-tower", name: t.appointments.branches.tripoliTower, address: "Tripoli Tower" },
    { id: "gargaresh", name: t.appointments.branches.gargaresh, address: "Gargaresh Area" },
    { id: "abu-sleem", name: t.appointments.branches.abuSleem, address: "Abu Sleem District" },
    { id: "bab-ben-ghashir", name: t.appointments.branches.babBenGhashir, address: "Bab Ben Ghashir" },
    { id: "janzour", name: t.appointments.branches.janzour, address: "Janzour Area" },
  ]

  const TIME_SLOTS = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
  ]
  const [step, setStep] = useState(1)
  const [serviceCategory, setServiceCategory] = useState("")
  const [service, setService] = useState("")
  const [branch, setBranch] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [timeSlot, setTimeSlot] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = () => {
    setIsSubmitted(true)
  }

  const handleReset = () => {
    setStep(1)
    setServiceCategory("")
    setService("")
    setBranch("")
    setDate(undefined)
    setTimeSlot("")
    setIsSubmitted(false)
  }

  if (isSubmitted) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">{t.appointments.appointmentConfirmed}</CardTitle>
          <CardDescription className="text-base">{t.appointments.appointmentDetails}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">{t.appointments.service}:</span>
              <span className="text-sm font-medium">{service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">{t.appointments.branch}:</span>
              <span className="text-sm font-medium">{BRANCHES.find((b) => b.id === branch)?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">{t.appointments.date}:</span>
              <span className="text-sm font-medium">{date?.toLocaleDateString(language === "ar" ? "ar-LY" : "en-US")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">{t.appointments.time}:</span>
              <span className="text-sm font-medium">{timeSlot}</span>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-lg bg-primary/5 p-4 text-sm">
            <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground">
              {t.appointments.confirmationMessage}
            </p>
          </div>
          <Button onClick={handleReset} className="w-full">
            {t.appointments.bookAnotherAppointment}
          </Button>
        </CardContent>
      </Card>
    )
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
            <div className="flex items-center justify-between">
              <CardTitle>{t.appointments.newAppointment}</CardTitle>
              <Badge variant="outline">{t.appointments.stepOf.replace("{step}", step.toString())}</Badge>
            </div>
            <CardDescription>{t.appointments.fillDetails}</CardDescription>
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
                  setStep(2)
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
                    setStep(3)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.appointments.chooseService} />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_CATEGORIES[serviceCategory as keyof typeof SERVICE_CATEGORIES].services.map((svc) => (
                      <SelectItem key={svc} value={svc}>
                        {svc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Step 3: Branch Selection */}
            {service && (
              <div className="space-y-4">
                <Label>{t.appointments.selectBranch}</Label>
                <Select
                  value={branch}
                  onValueChange={(value) => {
                    setBranch(value)
                    setStep(4)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.appointments.chooseBranch} />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANCHES.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        <div className="flex flex-col">
                          <span>{b.name}</span>
                          <span className="text-xs text-muted-foreground">{b.address}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Step 4: Date & Time */}
            {branch && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>{t.appointments.selectDate}</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date() || date.getDay() === 5 || date.getDay() === 6}
                    className="rounded-md border"
                  />
                  <p className="text-xs text-muted-foreground">
                    * {t.appointments.chooseDate}
                  </p>
                </div>

                {date && (
                  <div className="space-y-4">
                    <Label>{t.appointments.selectTime}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <Button
                          key={slot}
                          variant={timeSlot === slot ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTimeSlot(slot)}
                          className="text-xs"
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            {timeSlot && (
              <div className="pt-4 border-t">
                <Button onClick={handleSubmit} className="w-full" size="lg">
                  {t.appointments.confirmAppointment}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history" className="mt-6">
        <AppointmentHistory />
      </TabsContent>
    </Tabs>
  )
}
