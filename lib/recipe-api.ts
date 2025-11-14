export interface Recipe {
  idMeal: string
  strMeal: string
  strCategory: string
  strArea: string
  strInstructions: string
  strMealThumb: string
  strTags: string | null
  strYoutube: string
  strIngredient1: string
  strIngredient2: string
  strIngredient3: string
  strIngredient4: string
  strIngredient5: string
  strIngredient6: string
  strIngredient7: string
  strIngredient8: string
  strIngredient9: string
  strIngredient10: string
  strIngredient11: string
  strIngredient12: string
  strIngredient13: string
  strIngredient14: string
  strIngredient15: string
  strIngredient16: string
  strIngredient17: string
  strIngredient18: string
  strIngredient19: string
  strIngredient20: string
  strMeasure1: string
  strMeasure2: string
  strMeasure3: string
  strMeasure4: string
  strMeasure5: string
  strMeasure6: string
  strMeasure7: string
  strMeasure8: string
  strMeasure9: string
  strMeasure10: string
  strMeasure11: string
  strMeasure12: string
  strMeasure13: string
  strMeasure14: string
  strMeasure15: string
  strMeasure16: string
  strMeasure17: string
  strMeasure18: string
  strMeasure19: string
  strMeasure20: string
}

export interface RecipeSearchResult {
  meals: Recipe[] | null
}

const API_BASE_URL = "https://www.themealdb.com/api/json/v1/1"

export async function searchRecipesByName(query: string): Promise<Recipe[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/search.php?s=${encodeURIComponent(query)}`)
    const data: RecipeSearchResult = await response.json()
    return data.meals || []
  } catch (error) {
    console.error("[v0] Error searching recipes:", error)
    return []
  }
}

export async function searchRecipesByIngredient(ingredient: string): Promise<Recipe[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`)
    const data = await response.json()

    if (!data.meals) return []

    // Get full details for each recipe
    const detailedRecipes = await Promise.all(
      data.meals.slice(0, 12).map(async (meal: { idMeal: string }) => {
        const detailResponse = await fetch(`${API_BASE_URL}/lookup.php?i=${meal.idMeal}`)
        const detailData: RecipeSearchResult = await detailResponse.json()
        return detailData.meals?.[0]
      }),
    )

    return detailedRecipes.filter((recipe): recipe is Recipe => recipe !== undefined)
  } catch (error) {
    console.error("[v0] Error searching recipes by ingredient:", error)
    return []
  }
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/lookup.php?i=${id}`)
    const data: RecipeSearchResult = await response.json()
    return data.meals?.[0] || null
  } catch (error) {
    console.error("[v0] Error fetching recipe:", error)
    return null
  }
}

export async function getRandomRecipes(count = 8): Promise<Recipe[]> {
  try {
    const recipes = await Promise.all(
      Array.from({ length: count }, async () => {
        const response = await fetch(`${API_BASE_URL}/random.php`)
        const data: RecipeSearchResult = await response.json()
        return data.meals?.[0]
      }),
    )
    return recipes.filter((recipe): recipe is Recipe => recipe !== undefined)
  } catch (error) {
    console.error("[v0] Error fetching random recipes:", error)
    return []
  }
}

export async function getRecipesByCategory(category: string): Promise<Recipe[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/filter.php?c=${encodeURIComponent(category)}`)
    const data = await response.json()

    if (!data.meals) return []

    const detailedRecipes = await Promise.all(
      data.meals.slice(0, 12).map(async (meal: { idMeal: string }) => {
        const detailResponse = await fetch(`${API_BASE_URL}/lookup.php?i=${meal.idMeal}`)
        const detailData: RecipeSearchResult = await detailResponse.json()
        return detailData.meals?.[0]
      }),
    )

    return detailedRecipes.filter((recipe): recipe is Recipe => recipe !== undefined)
  } catch (error) {
    console.error("[v0] Error fetching recipes by category:", error)
    return []
  }
}

export function getRecipeIngredients(recipe: Recipe): Array<{ ingredient: string; measure: string }> {
  const ingredients: Array<{ ingredient: string; measure: string }> = []

  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}` as keyof Recipe]
    const measure = recipe[`strMeasure${i}` as keyof Recipe]

    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient as string,
        measure: (measure as string) || "",
      })
    }
  }

  return ingredients
}
