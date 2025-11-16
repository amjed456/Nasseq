"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      nationalNumber: "",
      phoneNumber: "",
      iban: "",
    },
  })

  const onSubmit = (data: LoginFormValues) => {
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
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nationalNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>National Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your national number"
                      {...field}
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Enter your phone number"
                      {...field}
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
                  <FormLabel>IBAN</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your IBAN"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" size="lg">
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

