"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from 'lucide-react'
import { loadWeekPlan, saveWeekPlan, removeRecipeFromSlot, clearWeekPlan, type WeekPlan } from "@/lib/meal-planner"
import { MealSlotCard } from "@/components/meal-slot-card"
import { useToast } from "@/hooks/use-toast"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const MEAL_TYPES: Array<"breakfast" | "lunch" | "dinner"> = ["breakfast", "lunch", "dinner"]

export function WeeklyPlanner() {
  const [weekPlan, setWeekPlan] = useState<WeekPlan>({})
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setWeekPlan(loadWeekPlan())
    setMounted(true)
  }, [])

  const calculateDayCalories = (day: string): number => {
    return MEAL_TYPES.reduce((total, mealType) => {
      const slotId = `${day}-${mealType}`
      const slot = weekPlan[slotId]
      return total + (slot?.calories || 0)
    }, 0)
  }

  const calculateWeekCalories = (): number => {
    return DAYS.reduce((total, day) => total + calculateDayCalories(day), 0)
  }

  const handleRemoveRecipe = (slotId: string) => {
    const updatedPlan = removeRecipeFromSlot(weekPlan, slotId)
    setWeekPlan(updatedPlan)
    saveWeekPlan(updatedPlan)

    toast({
      title: "Recipe Removed",
      description: "Recipe removed from meal plan",
    })
  }

  const handleClearPlan = () => {
    const clearedPlan = clearWeekPlan()
    setWeekPlan(clearedPlan)

    toast({
      title: "Plan Cleared",
      description: "All meals have been removed from your plan",
    })
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading meal plan...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Weekly calorie summary card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Total Weekly Calories</p>
            <p className="text-4xl font-bold text-foreground">{calculateWeekCalories().toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-2">Average per day: {Math.round(calculateWeekCalories() / 7).toLocaleString()} cal</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handleClearPlan}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      <div className="space-y-6">
        {DAYS.map((day) => (
          <Card key={day}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{day}</CardTitle>
                {/* Daily calorie display */}
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{calculateDayCalories(day).toLocaleString()}</span> cal
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MEAL_TYPES.map((mealType) => {
                  const slotId = `${day}-${mealType}`
                  const slot = weekPlan[slotId]

                  return (
                    <MealSlotCard
                      key={slotId}
                      slot={slot}
                      mealType={mealType}
                      onRemove={() => handleRemoveRecipe(slotId)}
                    />
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
