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

interface LocationFilterProps {
  value: string
  onChange: (value: string) => void
}

export function LocationFilter({ value, onChange }: LocationFilterProps) {
  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      try {
        console.log('Buscando localizações...') // Debug
        
        const { data, error } = await supabase
          .from('properties')
          .select('neighborhood') // Assumindo que neighborhood é o campo de localização
          .not('neighborhood', 'is', null)
          .distinct()

        console.log('Resposta Supabase:', { data, error }) // Debug

        if (error) {
          toast({
            title: "Erro ao carregar localizações",
            description: "Não foi possível carregar as localizações",
            variant: "destructive",
          })
          return []
        }

        const locations = data
          .map(item => item.neighborhood)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b))

        console.log('Localizações processadas:', locations) // Debug
        return locations

      } catch (error) {
        toast({
          title: "Erro inesperado",
          description: "Ocorreu um erro ao carregar as localizações",
          variant: "destructive",
        })
        console.error('Erro inesperado:', error)
        return []
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  })

  const handleChange = (newValue: string) => {
    console.log('Localização selecionada:', newValue) // Debug
    onChange(newValue)
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="location">Localização</Label>
      <Select 
        value={value} 
        onValueChange={handleChange}
        disabled={isLoading}
      >
        <SelectTrigger id="location" className="bg-white">
          <SelectValue placeholder="Selecione a localização" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todas as localizações</SelectItem>
          {isLoading ? (
            <SelectItem value="" disabled>Carregando...</SelectItem>
          ) : locations.length > 0 ? (
            locations.map((location) => (
              <SelectItem 
                key={location} 
                value={location.toLowerCase()}
                className="capitalize"
              >
                {location}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="" disabled>Nenhuma localização encontrada</SelectItem>
          )}
        </SelectContent>
      </Select>
      <div className="text-xs text-muted-foreground">
        {isLoading ? 'Carregando...' : 
         `${locations.length} localizações disponíveis`}
      </div>
    </div>
  )
}
