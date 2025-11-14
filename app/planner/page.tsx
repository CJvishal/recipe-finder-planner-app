import { Navigation } from "@/components/navigation"
import { WeeklyPlanner } from "@/components/weekly-planner"

export default function PlannerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Weekly Meal Planner
          </h1>
          <p className="mt-2 text-muted-foreground text-pretty">
            Organize your meals for the week. Click on any slot to add or remove recipes.
          </p>
        </div>

        <WeeklyPlanner />
      </main>
    </div>
  )
}
