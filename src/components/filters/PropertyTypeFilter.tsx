import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PropertyTypeFilterProps {
  value: string
  onChange: (value: string) => void
}

export function PropertyTypeFilter({ value, onChange }: PropertyTypeFilterProps) {
  const { data: propertyTypes = [], isLoading } = useQuery({
    queryKey: ['propertyTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('property_type')
        .is('property_type', 'not.null')

      if (error) {
        toast.error('Erro ao carregar tipos de imóveis')
        return []
      }

      const uniqueTypes = [...new Set(data.map(item => item.property_type))].sort()
      return uniqueTypes
    }
  })

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-white">
        <SelectValue placeholder="Tipo de imóvel" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">Todos os tipos</SelectItem>
        {isLoading ? (
          <SelectItem value="" disabled>Carregando...</SelectItem>
        ) : (
          propertyTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}