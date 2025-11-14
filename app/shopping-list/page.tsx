import { Navigation } from "@/components/navigation"
import { ShoppingList } from "@/components/shopping-list"

export default function ShoppingListPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">Shopping List</h1>
          <p className="mt-2 text-muted-foreground text-pretty">
            Automatically generated from your weekly meal plan. Check off items as you shop.
          </p>
        </div>

        <ShoppingList />
      </main>
    </div>
  )
}
