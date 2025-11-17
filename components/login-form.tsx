"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

const loginSchema = z.object({
  nationalNumber: z.string().min(1, "National number is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  iban: z.string().min(1, "IBAN is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const { t } = useLanguage()
  const { login } = useAuth()
  const router = useRouter()
  const [citizenType, setCitizenType] = useState<"libyan" | "foreign">("libyan")

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      nationalNumber: "",
      phoneNumber: "",
      iban: "",
    },
  })

  const onSubmit = (data: LoginFormValues) => {
    // Only allow submission for Libyan citizens
    if (citizenType === "foreign") {
      return
    }
    
    console.log("Login data:", data)
    // Store user info in localStorage for ticket system
    localStorage.setItem("userNationalNumber", data.nationalNumber)
    localStorage.setItem("userPhoneNumber", data.phoneNumber)
    localStorage.setItem("userIban", data.iban)
    // Handle login logic here (API call, validation, etc.)
    // For now, we'll just authenticate the user
    login()
    router.push("/")
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{t.login.title}</CardTitle>
        <CardDescription>
          {t.login.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-3">
              <Label>{t.login.citizenType}</Label>
              <RadioGroup
                value={citizenType}
                onValueChange={(value) => setCitizenType(value as "libyan" | "foreign")}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="libyan" id="libyan" />
                  <Label htmlFor="libyan" className="font-normal cursor-pointer">
                    {t.login.libyanCitizen}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="foreign" id="foreign" />
                  <Label htmlFor="foreign" className="font-normal cursor-pointer">
                    {t.login.foreignCitizen}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <FormField
              control={form.control}
              name="nationalNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.login.nationalNumber}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t.login.nationalNumberPlaceholder}
                      {...field}
                      disabled={citizenType === "foreign"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.login.phoneNumber}</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder={t.login.phoneNumberPlaceholder}
                      {...field}
                      disabled={citizenType === "foreign"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="iban"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.login.iban}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t.login.ibanPlaceholder}
                      {...field}
                      disabled={citizenType === "foreign"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={citizenType === "foreign"}
            >
              {citizenType === "foreign" ? t.login.comingSoon : t.common.login}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

