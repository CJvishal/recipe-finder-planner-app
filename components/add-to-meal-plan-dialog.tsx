"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Recipe } from "@/lib/recipe-api"
import { loadWeekPlan, saveWeekPlan, addRecipeToSlot } from "@/lib/meal-planner"

interface AddToMealPlanDialogProps {
  recipe: Recipe
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const MEAL_TYPES = ["breakfast", "lunch", "dinner"]

export function AddToMealPlanDialog({ recipe, open, onOpenChange }: AddToMealPlanDialogProps) {
  const [selectedDay, setSelectedDay] = useState<string>("")
  const [selectedMealType, setSelectedMealType] = useState<string>("")
  const { toast } = useToast()

  const handleAddToPlan = () => {
    if (!selectedDay || !selectedMealType) {
      toast({
        title: "Selection Required",
        description: "Please select both a day and meal type",
        variant: "destructive",
      })
      return
    }

    const slotId = `${selectedDay}-${selectedMealType}`
    const currentPlan = loadWeekPlan()
    const updatedPlan = addRecipeToSlot(currentPlan, slotId, recipe.idMeal, recipe.strMeal, recipe.strMealThumb)
    saveWeekPlan(updatedPlan)

    toast({
      title: "Added to Meal Plan",
      description: `${recipe.strMeal} added to ${selectedDay} ${selectedMealType}`,
    })

    setSelectedDay("")
    setSelectedMealType("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Meal Plan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Day</label>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger>
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Meal Type</label>
            <Select value={selectedMealType} onValueChange={setSelectedMealType}>
              <SelectTrigger>
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                {MEAL_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddToPlan}>Add to Plan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
