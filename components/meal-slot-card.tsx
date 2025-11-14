"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, X } from 'lucide-react'
import type { MealSlot } from "@/lib/meal-planner"
import { cn } from "@/lib/utils"
import { SearchRecipeDialog } from "@/components/search-recipe-dialog"

interface MealSlotCardProps {
  slot: MealSlot
  mealType: "breakfast" | "lunch" | "dinner"
  onRemove: () => void
}

export function MealSlotCard({ slot, mealType, onRemove }: MealSlotCardProps) {
  const [showSearch, setShowSearch] = useState(false)

  const isEmpty = !slot.recipeId

  return (
    <>
      <Card
        className={cn(
          "overflow-hidden transition-all hover:shadow-md cursor-pointer",
          isEmpty && "border-dashed hover:border-solid",
        )}
        onClick={() => isEmpty && setShowSearch(true)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium capitalize">{mealType}</h4>
            {!isEmpty && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove()
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Plus className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Add a recipe</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="relative aspect-video w-full overflow-hidden rounded-md">
                <Image
                  src={slot.recipeImage || "/placeholder.svg"}
                  alt={slot.recipeName || "Recipe"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <p className="text-sm font-medium line-clamp-2 text-balance">{slot.recipeName}</p>
              {slot.calories && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{slot.calories}</span> cal
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <SearchRecipeDialog slot={slot} open={showSearch} onOpenChange={setShowSearch} />
    </>
  )
}
