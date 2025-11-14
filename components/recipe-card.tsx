"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Eye } from "lucide-react"
import type { Recipe } from "@/lib/recipe-api"
import { RecipeDetailDialog } from "@/components/recipe-detail-dialog"
import { AddToMealPlanDialog } from "@/components/add-to-meal-plan-dialog"

interface RecipeCardProps {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [showAddToPlan, setShowAddToPlan] = useState(false)

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-square">
          <Image
            src={recipe.strMealThumb || "/placeholder.svg"}
            alt={recipe.strMeal}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-balance">{recipe.strMeal}</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{recipe.strCategory}</Badge>
            <Badge variant="outline">{recipe.strArea}</Badge>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => setShowDetails(true)}>
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button size="sm" className="flex-1" onClick={() => setShowAddToPlan(true)}>
            <Calendar className="h-4 w-4 mr-2" />
            Plan
          </Button>
        </CardFooter>
      </Card>

      <RecipeDetailDialog recipe={recipe} open={showDetails} onOpenChange={setShowDetails} />
      <AddToMealPlanDialog recipe={recipe} open={showAddToPlan} onOpenChange={setShowAddToPlan} />
    </>
  )
}
