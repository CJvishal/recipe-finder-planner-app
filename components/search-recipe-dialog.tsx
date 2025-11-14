"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { searchRecipesByName, type Recipe } from "@/lib/recipe-api"
import { loadWeekPlan, saveWeekPlan, addRecipeToSlot, type MealSlot } from "@/lib/meal-planner"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface SearchRecipeDialogProps {
  slot: MealSlot
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchRecipeDialog({ slot, open, onOpenChange }: SearchRecipeDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const results = await searchRecipesByName(searchQuery)
      setRecipes(results)
    } catch (error) {
      console.error("[v0] Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectRecipe = (recipe: Recipe) => {
    const currentPlan = loadWeekPlan()
    const estimatedCalories = estimateCaloriesForRecipe(recipe, slot.mealType)
    const updatedPlan = addRecipeToSlot(currentPlan, slot.id, recipe.idMeal, recipe.strMeal, recipe.strMealThumb)
    updatedPlan[slot.id].calories = estimatedCalories
    saveWeekPlan(updatedPlan)

    toast({
      title: "Recipe Added",
      description: `${recipe.strMeal} added to ${slot.day} ${slot.mealType}`,
    })

    setSearchQuery("")
    setRecipes([])
    onOpenChange(false)
  }

  const estimateCaloriesForRecipe = (recipe: Recipe, mealType: string): number => {
    const defaultCaloriesPerMeal: Record<string, number> = {
      breakfast: 400,
      lunch: 600,
      dinner: 700,
    }
    // Simple estimation: base calories + 40 cal per ingredient
    const ingredientCount = Array.from({ length: 20 }, (_, i) => recipe[`strIngredient${i + 1}` as keyof Recipe]).filter(Boolean).length
    const baseCalories = defaultCaloriesPerMeal[mealType] || 600
    return Math.round(baseCalories + (ingredientCount * 40))
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            Search Recipe for {slot.day} {slot.mealType}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading || !searchQuery.trim()}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Searching...</div>
              </div>
            ) : recipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recipes.map((recipe) => (
                  <Card
                    key={recipe.idMeal}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleSelectRecipe(recipe)}
                  >
                    <CardContent className="p-3">
                      <div className="relative aspect-video w-full overflow-hidden rounded-md mb-2">
                        <Image
                          src={recipe.strMealThumb || "/placeholder.svg"}
                          alt={recipe.strMeal}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <p className="text-sm font-medium line-clamp-2 text-balance">{recipe.strMeal}</p>
                      <p className="text-xs text-muted-foreground mt-1">{recipe.strCategory}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        <span className="font-medium text-foreground">{estimateCaloriesForRecipe(recipe, slot.mealType)}</span> cal
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Search for recipes to add to your meal plan</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
