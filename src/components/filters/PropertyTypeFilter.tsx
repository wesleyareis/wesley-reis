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
  const { data: propertyTypes = [], isLoading } = useQuery({
    queryKey: ['propertyTypes'],
    queryFn: async () => {
      try {
        console.log('Iniciando busca de tipos...')
        
        const { data, error } = await supabase
          .from('properties')
          .select('property_type')
          .not('property_type', 'is', null)
          .distinct()

        console.log('Resposta do Supabase:', { data, error })

        if (error) {
          console.error('Erro Supabase:', error)
          toast({
            title: "Erro ao carregar tipos",
            description: "Não foi possível carregar os tipos de imóveis",
            variant: "destructive",
          })
          return []
        }

        // Garantir que estamos pegando apenas os tipos válidos
        const validTypes = ['apartamento', 'casa', 'cobertura', 'sala', 'terreno']
        const types = data
          .map(item => item.property_type?.toLowerCase())
          .filter(type => type && validTypes.includes(type))
          .sort()

        console.log('Tipos processados:', types)
        return types

      } catch (error) {
        console.error('Erro inesperado:', error)
        return []
      }
    },
  })

  console.log('Valor atual do filtro:', value)
  console.log('Tipos disponíveis:', propertyTypes)

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="type">Tipo de Imóvel</Label>
      <Select 
        value={value} 
        onValueChange={(newValue) => {
          console.log('Novo valor selecionado:', newValue)
          onChange(newValue)
        }}
        disabled={isLoading}
      >
        <SelectTrigger id="type" className="bg-white">
          <SelectValue placeholder="Selecione o tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos os tipos</SelectItem>
          {isLoading ? (
            <SelectItem value="" disabled>Carregando...</SelectItem>
          ) : (
            propertyTypes.map((type) => (
              <SelectItem 
                key={type} 
                value={type}
                className="capitalize"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      <div className="text-xs text-muted-foreground">
        {isLoading ? 'Carregando...' : 
         `${propertyTypes.length} tipos disponíveis`}
      </div>
    </div>
  )
}
