import { Navigation } from "@/components/navigation"
import { RecipeSearch } from "@/components/recipe-search"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance">
            Discover Your Next
            <br />
            Favorite Recipe
          </h1>
          <p className="mt-4 text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Search thousands of recipes by name, ingredient, or category. Plan your meals and simplify your cooking.
          </p>
        </div>

        <RecipeSearch />
      </main>
    </div>
  )
}
