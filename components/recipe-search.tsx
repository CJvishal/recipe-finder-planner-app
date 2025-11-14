"use client"

import type React from "react"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RecipeGrid } from "@/components/recipe-grid"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  searchRecipesByName,
  searchRecipesByIngredient,
  getRecipesByCategory,
  getRandomRecipes,
  type Recipe,
} from "@/lib/recipe-api"

const CATEGORIES = ["Beef", "Chicken", "Dessert", "Lamb", "Pasta", "Pork", "Seafood", "Vegetarian", "Vegan"]

export function RecipeSearch() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"name" | "ingredient">("name")
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      let results: Recipe[] = []
      if (searchType === "name") {
        results = await searchRecipesByName(searchQuery)
      } else {
        results = await searchRecipesByIngredient(searchQuery)
      }
      setRecipes(results)
    } catch (error) {
      console.error("[v0] Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategorySearch = async (category: string) => {
    setSelectedCategory(category)
    setSearchQuery("")
    setLoading(true)
    try {
      const results = await getRecipesByCategory(category)
      setRecipes(results)
    } catch (error) {
      console.error("[v0] Category search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRandomRecipes = async () => {
    setSearchQuery("")
    setSelectedCategory("")
    setLoading(true)
    try {
      const results = await getRandomRecipes(12)
      setRecipes(results)
    } catch (error) {
      console.error("[v0] Random recipes error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex gap-2">
            <Input
              type="text"
              placeholder={searchType === "name" ? "Search by recipe name..." : "Search by ingredient..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading || !searchQuery.trim()}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          <Select value={searchType} onValueChange={(value: "name" | "ingredient") => setSearchType(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">By Name</SelectItem>
              <SelectItem value="ingredient">By Ingredient</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleRandomRecipes} disabled={loading}>
            Surprise Me
          </Button>
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategorySearch(category)}
              disabled={loading}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading recipes...</div>
        </div>
      ) : recipes.length > 0 ? (
        <RecipeGrid recipes={recipes} />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Search for recipes or browse by category to get started</p>
        </div>
      )}
    </div>
  )
}
