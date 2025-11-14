"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import type { Recipe } from "@/lib/recipe-api"
import { getRecipeIngredients } from "@/lib/recipe-api"

interface RecipeDetailDialogProps {
  recipe: Recipe
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RecipeDetailDialog({ recipe, open, onOpenChange }: RecipeDetailDialogProps) {
  const ingredients = getRecipeIngredients(recipe)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-balance">{recipe.strMeal}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-8rem)]">
          <div className="space-y-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={recipe.strMealThumb || "/placeholder.svg"}
                alt={recipe.strMeal}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{recipe.strCategory}</Badge>
              <Badge variant="outline">{recipe.strArea}</Badge>
              {recipe.strTags &&
                recipe.strTags.split(",").map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag.trim()}
                  </Badge>
                ))}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ingredients.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">{item.measure}</span>
                    <span>{item.ingredient}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">Instructions</h3>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {recipe.strInstructions.split("\n").map((paragraph, index) => (
                  <p key={index} className="text-sm leading-relaxed mb-3">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {recipe.strYoutube && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Video Tutorial</h3>
                <a
                  href={recipe.strYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Watch on YouTube
                </a>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
