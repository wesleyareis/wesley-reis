import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/components/ui/use-toast"

interface PropertyTypeFilterProps {
  value: string
  onChange: (value: string) => void
}

export function PropertyTypeFilter({ value, onChange }: PropertyTypeFilterProps) {
  console.log('PropertyTypeFilter - valor atual:', value) // Debug do valor atual

  const { data: propertyTypes = [], isLoading, error } = useQuery({
    queryKey: ['propertyTypes'],
    queryFn: async () => {
      try {
        console.log('Iniciando busca de tipos de imóveis...') // Debug

        // Teste direto da conexão
        const { data: testData, error: testError } = await supabase
          .from('properties')
          .select('property_type')
          .limit(1)
        
        console.log('Teste de conexão:', { testData, testError })

        // Query principal
        const { data, error } = await supabase
          .from('properties')
          .select('property_type')
          .not('property_type', 'is', null)
          .distinct()

        console.log('Resposta completa do Supabase:', { data, error }) // Debug detalhado

        if (error) {
          console.error('Erro do Supabase:', error)
          toast({
            title: "Erro ao carregar tipos",
            description: "Não foi possível carregar os tipos de imóveis",
            variant: "destructive",
          })
          return []
        }

        if (!data || data.length === 0) {
          console.log('Nenhum tipo de imóvel encontrado')
          return []
        }

        // Log dos dados brutos
        console.log('Dados brutos:', data)

        const types = data
          .map(item => {
            console.log('Processando item:', item) // Debug de cada item
            return item.property_type
          })
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b))

        console.log('Tipos de imóveis processados:', types)
        return types

      } catch (error) {
        console.error('Erro inesperado completo:', error)
        toast({
          title: "Erro inesperado",
          description: "Ocorreu um erro ao carregar os tipos de imóveis",
          variant: "destructive",
        })
        return []
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  })

  // Debug dos dados carregados
  console.log('PropertyTypes carregados:', propertyTypes)

  const handleChange = (newValue: string) => {
    console.log('Tipo selecionado:', newValue)
    onChange(newValue)
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="type">Tipo de Imóvel</Label>
      <Select 
        value={value} 
        onValueChange={handleChange}
        disabled={isLoading}
      >
        <SelectTrigger id="type" className="bg-white">
          <SelectValue placeholder="Selecione o tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos os tipos</SelectItem>
          {isLoading ? (
            <SelectItem value="" disabled>Carregando...</SelectItem>
          ) : propertyTypes.length > 0 ? (
            propertyTypes.map((type) => {
              console.log('Renderizando tipo:', type) // Debug de renderização
              return (
                <SelectItem 
                  key={type} 
                  value={type.toLowerCase()}
                  className="capitalize"
                >
                  {type}
                </SelectItem>
              )
            })
          ) : (
            <SelectItem value="" disabled>Nenhum tipo encontrado</SelectItem>
          )}
        </SelectContent>
      </Select>
      <div className="text-xs text-muted-foreground">
        {isLoading ? 'Carregando...' : 
         `${propertyTypes.length} tipos disponíveis`}
      </div>
      {/* Debug visual */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-muted-foreground mt-2">
          <div>Valor atual: {value || 'nenhum'}</div>
          <div>Tipos carregados: {propertyTypes.join(', ')}</div>
        </div>
      )}
    </div>
  )
}
