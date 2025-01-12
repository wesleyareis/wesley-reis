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
import { toast } from "@/components/ui/use-toast" // Usando seu sistema de toast personalizado

interface PropertyTypeFilterProps {
  value: string
  onChange: (value: string) => void
}

export function PropertyTypeFilter({ value, onChange }: PropertyTypeFilterProps) {
  const { data: propertyTypes = [], isLoading, error } = useQuery({
    queryKey: ['propertyTypes'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('property_type')
          .not('property_type', 'is', null)
          .distinct()

        if (error) {
          toast({
            title: "Erro ao carregar tipos",
            description: "Não foi possível carregar os tipos de imóveis",
            variant: "destructive",
          })
          console.error('Erro Supabase:', error)
          return []
        }

        if (!data || data.length === 0) {
          console.log('Nenhum tipo de imóvel encontrado')
          return []
        }

        const types = data
          .map(item => item.property_type)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b))

        console.log('Tipos de imóveis carregados:', types)
        return types

      } catch (error) {
        toast({
          title: "Erro inesperado",
          description: "Ocorreu um erro ao carregar os tipos de imóveis",
          variant: "destructive",
        })
        console.error('Erro inesperado:', error)
        return []
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })

  // Mostra mensagem de erro se a query falhar
  if (error) {
    console.error('Erro na query:', error)
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="type">Tipo de Imóvel</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
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
            propertyTypes.map((type) => (
              <SelectItem 
                key={type} 
                value={type.toLowerCase()}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="" disabled>Nenhum tipo encontrado</SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}
