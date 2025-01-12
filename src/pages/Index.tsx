import { SearchFilters } from "@/components/SearchFilters"
// ... resto das importações ...

const Index = () => {
  // ... resto do código ...

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header>
        {/* ... header content ... */}
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        {/* Adicione um texto de teste antes */}
        <div>Teste antes do SearchFilters</div>
        
        <SearchFilters />
        
        {/* Adicione um texto de teste depois */}
        <div>Teste depois do SearchFilters</div>

        {/* ... resto do conteúdo ... */}
      </main>

      <Footer />
    </div>
  )
}

export default Index
