export interface MealSlot {
  id: string
  recipeId: string | null
  recipeName: string | null
  recipeImage: string | null
  day: string
  mealType: "breakfast" | "lunch" | "dinner"
  calories?: number // add calories field to track meal calories
}

export interface WeekPlan {
  [key: string]: MealSlot
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const MEAL_TYPES: Array<"breakfast" | "lunch" | "dinner"> = ["breakfast", "lunch", "dinner"]

export function initializeWeekPlan(): WeekPlan {
  const plan: WeekPlan = {}

  DAYS.forEach((day) => {
    MEAL_TYPES.forEach((mealType) => {
      const id = `${day}-${mealType}`
      plan[id] = {
        id,
        recipeId: null,
        recipeName: null,
        recipeImage: null,
        day,
        mealType,
      }
    })
  })

  return plan
}

export function loadWeekPlan(): WeekPlan {
  if (typeof window === "undefined") return initializeWeekPlan()

  try {
    const saved = localStorage.getItem("weekPlan")
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error("[v0] Error loading week plan:", error)
  }

  return initializeWeekPlan()
}

export function saveWeekPlan(plan: WeekPlan): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("weekPlan", JSON.stringify(plan))
  } catch (error) {
    console.error("[v0] Error saving week plan:", error)
  }
}

export function addRecipeToSlot(
  plan: WeekPlan,
  slotId: string,
  recipeId: string,
  recipeName: string,
  recipeImage: string,
  calories?: number // add calories parameter
): WeekPlan {
  return {
    ...plan,
    [slotId]: {
      ...plan[slotId],
      recipeId,
      recipeName,
      recipeImage,
      calories, // include calories in the slot
    },
  }
}

export function removeRecipeFromSlot(plan: WeekPlan, slotId: string): WeekPlan {
  return {
    ...plan,
    [slotId]: {
      ...plan[slotId],
      recipeId: null,
      recipeName: null,
      recipeImage: null,
      calories: null, // reset calories when removing recipe
    },
  }
}

export function clearWeekPlan(): WeekPlan {
  const plan = initializeWeekPlan()
  saveWeekPlan(plan)
  return plan
}

export function getPlannedRecipes(plan: WeekPlan): Array<{ id: string; name: string }> {
  const recipes = new Map<string, string>()

  Object.values(plan).forEach((slot) => {
    if (slot.recipeId && slot.recipeName) {
      recipes.set(slot.recipeId, slot.recipeName)
    }
  })

  return Array.from(recipes.entries()).map(([id, name]) => ({ id, name }))
}
