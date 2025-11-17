"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Gift, Trophy, Users, TrendingUp, Search } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

type UserPoints = {
  nationalNumber: string
  points: number
}

export function RewardStatistics() {
  const { t } = useLanguage()
  const [userPoints, setUserPoints] = useState<UserPoints[]>([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const loadRewardPoints = () => {
      const pointsData = JSON.parse(localStorage.getItem("userRewardPoints") || "{}")
      
      // Convert to array and sort by points (descending)
      const users: UserPoints[] = Object.entries(pointsData)
        .map(([nationalNumber, points]) => ({
          nationalNumber,
          points: points as number,
        }))
        .filter((user) => user.points > 0) // Only show users with points
        .sort((a, b) => b.points - a.points)

      setUserPoints(users)
      
      // Calculate totals
      const total = users.reduce((sum, user) => sum + user.points, 0)
      setTotalPoints(total)
      setTotalUsers(users.length)
    }

    loadRewardPoints()

    // Listen for storage changes
    const handleStorageChange = () => {
      loadRewardPoints()
    }

    window.addEventListener("storage", handleStorageChange)
    // Poll for changes (since storage event doesn't fire in same tab)
    const interval = setInterval(loadRewardPoints, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const filteredUsers = userPoints.filter((user) =>
    user.nationalNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getMilestoneBadge = (points: number) => {
    if (points >= 1000) {
      return <Badge variant="default" className="bg-purple-500">{t.admin.rewards.flightDiscount}</Badge>
    }
    if (points >= 500) {
      return <Badge variant="default" className="bg-orange-500">{t.admin.rewards.restaurantDiscount}</Badge>
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.admin.rewards.totalRewardPoints}</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPoints.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{t.admin.rewards.acrossAllUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.admin.rewards.usersWithPoints}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">{t.admin.rewards.totalUniqueUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.admin.rewards.averagePointsPerUser}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalUsers > 0 ? Math.round(totalPoints / totalUsers) : 0}
            </div>
            <p className="text-xs text-muted-foreground">{t.admin.rewards.averagePointsPerUserWithPoints}</p>
          </CardContent>
        </Card>
      </div>

      {/* User Points List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t.admin.rewards.individualUserPoints}</CardTitle>
              <CardDescription>{t.admin.rewards.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t.admin.rewards.searchByNationalNumber}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Users List */}
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                {t.admin.rewards.noUsersFound}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map((user, index) => (
                <div
                  key={user.nationalNumber}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{t.admin.rewards.nationalNumber}: {user.nationalNumber}</p>
                        {getMilestoneBadge(user.points)}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Gift className="h-3 w-3" />
                          <span>{user.points} {t.rewards.milestone500.progress}</span>
                        </div>
                        {user.points >= 500 && user.points < 1000 && (
                          <div className="text-xs text-muted-foreground">
                            {1000 - user.points} {t.rewards.milestone500.progress} until {t.admin.rewards.flightDiscount}
                          </div>
                        )}
                        {user.points < 500 && (
                          <div className="text-xs text-muted-foreground">
                            {500 - user.points} {t.rewards.milestone500.progress} until {t.admin.rewards.restaurantDiscount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{user.points}</div>
                    <p className="text-xs text-muted-foreground">{t.rewards.milestone500.progress}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Milestone Statistics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-orange-500" />
              {t.admin.rewards.milestone500}
            </CardTitle>
            <CardDescription>{t.admin.rewards.usersReached500}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">
              {userPoints.filter((u) => u.points >= 500).length}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {totalUsers > 0
                ? Math.round((userPoints.filter((u) => u.points >= 500).length / totalUsers) * 100)
                : 0}
              {t.admin.rewards.percentageReached}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-purple-500" />
              {t.admin.rewards.milestone1000}
            </CardTitle>
            <CardDescription>{t.admin.rewards.usersReached1000}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-500">
              {userPoints.filter((u) => u.points >= 1000).length}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {totalUsers > 0
                ? Math.round((userPoints.filter((u) => u.points >= 1000).length / totalUsers) * 100)
                : 0}
              {t.admin.rewards.percentageReached}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

