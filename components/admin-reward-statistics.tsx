"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Gift, Trophy, Users, TrendingUp, Search } from "lucide-react"

type UserPoints = {
  nationalNumber: string
  points: number
}

export function RewardStatistics() {
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
      return <Badge variant="default" className="bg-purple-500">Flight Discount</Badge>
    }
    if (points >= 500) {
      return <Badge variant="default" className="bg-orange-500">Restaurant Discount</Badge>
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reward Points</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPoints.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users with Points</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Active reward members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Points per User</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalUsers > 0 ? Math.round(totalPoints / totalUsers) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Mean reward points</p>
          </CardContent>
        </Card>
      </div>

      {/* User Points List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Reward Points</CardTitle>
              <CardDescription>View individual user reward points and milestones</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by national number..."
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
                {userPoints.length === 0
                  ? "No users have earned reward points yet."
                  : "No users match your search criteria."}
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
                        <p className="font-medium">National Number: {user.nationalNumber}</p>
                        {getMilestoneBadge(user.points)}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Gift className="h-3 w-3" />
                          <span>{user.points} points</span>
                        </div>
                        {user.points >= 500 && user.points < 1000 && (
                          <div className="text-xs text-muted-foreground">
                            {1000 - user.points} points until flight discount
                          </div>
                        )}
                        {user.points < 500 && (
                          <div className="text-xs text-muted-foreground">
                            {500 - user.points} points until restaurant discount
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{user.points}</div>
                    <p className="text-xs text-muted-foreground">points</p>
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
              Restaurant Discount Milestone
            </CardTitle>
            <CardDescription>Users who have reached 500+ points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">
              {userPoints.filter((u) => u.points >= 500).length}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {totalUsers > 0
                ? Math.round((userPoints.filter((u) => u.points >= 500).length / totalUsers) * 100)
                : 0}
              % of users have unlocked this milestone
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-purple-500" />
              Flight Discount Milestone
            </CardTitle>
            <CardDescription>Users who have reached 1000+ points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-500">
              {userPoints.filter((u) => u.points >= 1000).length}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {totalUsers > 0
                ? Math.round((userPoints.filter((u) => u.points >= 1000).length / totalUsers) * 100)
                : 0}
              % of users have unlocked this milestone
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

