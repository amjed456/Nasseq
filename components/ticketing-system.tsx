"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateTicket } from "@/components/create-ticket"
import { TicketList } from "@/components/ticket-list"
import { useLanguage } from "@/contexts/language-context"

export function TicketingSystem() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { t } = useLanguage()

  return (
    <Tabs defaultValue="my-tickets" className="w-full">
      <div className="flex items-center justify-between mb-6">
        <TabsList>
          <TabsTrigger value="my-tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="create">{t.common.createTicket}</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="my-tickets" className="mt-0">
        <TicketList />
      </TabsContent>

      <TabsContent value="create" className="mt-0">
        <CreateTicket />
      </TabsContent>
    </Tabs>
  )
}
