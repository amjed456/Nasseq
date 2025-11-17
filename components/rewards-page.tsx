"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gift, Trophy, UtensilsCrossed, Plane, Star, CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function RewardsPage() {
  const { t } = useLanguage()
  const [userPoints, setUserPoints] = useState(0)
  const [milestones, setMilestones] = useState<{ id: string; points: number; reward: string; unlocked: boolean }[]>([])

  useEffect(() => {
    // Get current user's national number
    const userNationalNumber = localStorage.getItem("userNationalNumber")
    if (!userNationalNumber) return

    // Load user points
    const userPointsData = JSON.parse(localStorage.getItem("userRewardPoints") || "{}")
    const points = userPointsData[userNationalNumber] || 0
    setUserPoints(points)

    // Define milestones
    const allMilestones = [
      {
        id: "restaurant",
        points: 500,
        reward: t.rewards.milestone500.title,
        unlocked: points >= 500,
      },
      {
        id: "flight",
        points: 1000,
        reward: t.rewards.milestone1000.title,
        unlocked: points >= 1000,
      },
    ]

    setMilestones(allMilestones)
  }, [])

  // Listen for points updates
  useEffect(() => {
    const handleStorageChange = () => {
      const userNationalNumber = localStorage.getItem("userNationalNumber")
      if (!userNationalNumber) return

      const userPointsData = JSON.parse(localStorage.getItem("userRewardPoints") || "{}")
      const points = userPointsData[userNationalNumber] || 0
      setUserPoints(points)

      const allMilestones = [
        {
          id: "restaurant",
          points: 500,
          reward: t.rewards.milestone500.title,
          unlocked: points >= 500,
        },
        {
          id: "flight",
          points: 1000,
          reward: t.rewards.milestone1000.title,
          unlocked: points >= 1000,
        },
      ]

      setMilestones(allMilestones)
    }

    window.addEventListener("storage", handleStorageChange)
    const interval = setInterval(handleStorageChange, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const getNextMilestone = () => {
    const next = milestones.find((m) => !m.unlocked)
    return next
  }

  const nextMilestone = getNextMilestone()
  const progressToNext = nextMilestone
    ? Math.min((userPoints / nextMilestone.points) * 100, 100)
    : 100

  return (
    <div className="space-y-6">
      {/* Points Display */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{t.rewards.title}</CardTitle>
              <CardDescription>{t.rewards.description}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary">{userPoints}</div>
              <p className="text-sm text-muted-foreground">{t.rewards.totalPoints}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t.rewards.howToEarnList.earnPoints}</span>
              <span className="font-medium">+20 {t.rewards.milestone500.progress}</span>
            </div>
            {nextMilestone && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Progress to next milestone ({nextMilestone.points} points)
                  </span>
                  <span className="font-medium">
                    {userPoints} / {nextMilestone.points}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {nextMilestone.points - userPoints} more points needed
                </p>
              </div>
            )}
            {!nextMilestone && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Trophy className="h-4 w-4" />
                <span>{t.rewards.milestone1000.congratulations}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <div>
        <h2 className="text-xl font-bold mb-4">{t.rewards.milestones}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {milestones.map((milestone) => (
            <Card
              key={milestone.id}
              className={milestone.unlocked ? "border-2 border-green-500 bg-green-50/50 dark:bg-green-950/20" : ""}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {milestone.id === "restaurant" ? (
                        <UtensilsCrossed className="h-5 w-5 text-orange-500" />
                      ) : (
                        <Plane className="h-5 w-5 text-blue-500" />
                      )}
                      <CardTitle className="text-lg">{milestone.reward}</CardTitle>
                    </div>
                    <CardDescription>
                      {milestone.id === "restaurant" ? t.rewards.milestone500.description : t.rewards.milestone1000.description}
                    </CardDescription>
                  </div>
                  {milestone.unlocked ? (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {t.rewards.unlocked}
                    </Badge>
                  ) : (
                    <Badge variant="outline">{milestone.points} {t.rewards.milestone500.progress}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {milestone.unlocked ? (
                  <div className="space-y-2">
                    <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                      🎉 This reward is now available to you!
                    </p>
                    {milestone.id === "restaurant" ? (
                      <p className="text-sm text-muted-foreground">
                        {t.rewards.milestone500.congratulations}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {t.rewards.milestone1000.congratulations}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {milestone.points - userPoints} {t.rewards.milestone500.progress} needed to unlock this reward.
                    </p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((userPoints / milestone.points) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How to Earn Points */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            {t.rewards.howToEarn}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Star className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{t.rewards.howToEarnList.submitFeedback}</p>
              <p className="text-sm text-muted-foreground">
                {t.rewards.howToEarnList.earnPoints}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{t.rewards.howToEarnList.unlockMilestones}</p>
              <p className="text-sm text-muted-foreground">
                {t.rewards.howToEarnList.unlockMilestones}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

