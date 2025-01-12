import { Button } from "@/components/ui/button"

export function SearchFilters() {
  return (
    <div className="search-container p-8 rounded-lg bg-primary/10">
      <h1 className="text-3xl font-bold text-primary mb-6">
        Encontre seu imóvel ideal
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button 
          variant="outline"
          className="h-10 bg-white hover:bg-white/90"
        >
          Teste
        </Button>
      </div>
    </div>
  )
}
