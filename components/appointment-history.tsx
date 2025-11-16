"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Building2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

type ResourceSchedule = {
  id: string
  name: string
  type: "department" | "person"
  schedule: string
}

interface AppointmentHistoryProps {
  favorites: ResourceSchedule[]
  onRemoveFavorite?: (resourceId: string) => void
}

export function AppointmentHistory({ favorites, onRemoveFavorite }: AppointmentHistoryProps) {
  return (
    <div className="space-y-4">
      {favorites.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Star className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No favorite departments or people yet. Click the star icon on any department or person to add them to your favorites.
            </p>
          </CardContent>
        </Card>
      ) : (
        favorites.map((favorite) => (
          <Card key={favorite.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{favorite.name}</CardTitle>
                    <Badge variant={favorite.type === "department" ? "default" : "secondary"}>
                      {favorite.type === "department" ? "Department" : "Person"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  favorite.type === "department" 
                    ? "bg-blue-100 text-blue-600" 
                    : "bg-green-100 text-green-600"
                }`}>
                  {favorite.type === "department" ? (
                    <Building2 className="h-4 w-4" />
                  ) : (
                    <Users className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="p-3 bg-muted/50 rounded-lg border">
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Working Hours:</p>
                        <p className="text-sm font-medium">{favorite.schedule}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onRemoveFavorite?.(favorite.id)}
                >
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
