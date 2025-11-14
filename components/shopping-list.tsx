"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, Printer } from "lucide-react"
import { loadWeekPlan, getPlannedRecipes } from "@/lib/meal-planner"
import { getRecipeById, getRecipeIngredients } from "@/lib/recipe-api"
import { useToast } from "@/hooks/use-toast"

interface IngredientItem {
  ingredient: string
  measure: string
  checked: boolean
}

export function ShoppingList() {
  const [ingredients, setIngredients] = useState<IngredientItem[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    loadShoppingList()
  }, [])

  const loadShoppingList = async () => {
    setLoading(true)
    try {
      const weekPlan = loadWeekPlan()
      const plannedRecipes = getPlannedRecipes(weekPlan)

      if (plannedRecipes.length === 0) {
        setIngredients([])
        setLoading(false)
        return
      }

      const allIngredients: IngredientItem[] = []
      const ingredientMap = new Map<string, { measures: string[]; checked: boolean }>()

      for (const { id } of plannedRecipes) {
        const recipe = await getRecipeById(id)
        if (recipe) {
          const recipeIngredients = getRecipeIngredients(recipe)
          recipeIngredients.forEach(({ ingredient, measure }) => {
            const key = ingredient.toLowerCase()
            if (ingredientMap.has(key)) {
              const existing = ingredientMap.get(key)!
              if (measure && !existing.measures.includes(measure)) {
                existing.measures.push(measure)
              }
            } else {
              ingredientMap.set(key, {
                measures: measure ? [measure] : [],
                checked: false,
              })
            }
          })
        }
      }

      ingredientMap.forEach((value, key) => {
        allIngredients.push({
          ingredient: key.charAt(0).toUpperCase() + key.slice(1),
          measure: value.measures.join(", "),
          checked: value.checked,
        })
      })

      allIngredients.sort((a, b) => a.ingredient.localeCompare(b.ingredient))
      setIngredients(allIngredients)
    } catch (error) {
      console.error("[v0] Error loading shopping list:", error)
      toast({
        title: "Error",
        description: "Failed to load shopping list",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleIngredient = (index: number) => {
    setIngredients((prev) => prev.map((item, i) => (i === index ? { ...item, checked: !item.checked } : item)))
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const text = ingredients.map((item) => `${item.checked ? "✓" : "○"} ${item.measure} ${item.ingredient}`).join("\n")

    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "shopping-list.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded",
      description: "Shopping list downloaded successfully",
    })
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Generating shopping list...</div>
      </div>
    )
  }

  if (ingredients.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No recipes in your meal plan yet.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Add recipes to your weekly planner to generate a shopping list.
          </p>
        </CardContent>
      </Card>
    )
  }

  const checkedCount = ingredients.filter((item) => item.checked).length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 print:hidden">
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <div className="ml-auto text-sm text-muted-foreground flex items-center">
          {checkedCount} of {ingredients.length} items checked
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ingredients ({ingredients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ingredients.map((item, index) => (
              <div key={index} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                <Checkbox
                  id={`ingredient-${index}`}
                  checked={item.checked}
                  onCheckedChange={() => handleToggleIngredient(index)}
                  className="mt-1 print:hidden"
                />
                <label
                  htmlFor={`ingredient-${index}`}
                  className={`flex-1 cursor-pointer select-none ${item.checked ? "line-through text-muted-foreground" : ""}`}
                >
                  <span className="font-medium">{item.ingredient}</span>
                  {item.measure && <span className="text-muted-foreground ml-2">({item.measure})</span>}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
