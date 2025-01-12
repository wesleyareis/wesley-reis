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

interface PropertyTypeFilterProps {
  value: string
  onChange: (value: string) => void
}

const PROPERTY_TYPES = [
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
  { value: "cobertura", label: "Cobertura" },
  { value: "sala", label: "Sala Comercial" },
  { value: "terreno", label: "Terreno" }
]

export function PropertyTypeFilter({ value, onChange }: PropertyTypeFilterProps) {
  // Debug
  console.log('PropertyTypeFilter - valor atual:', value)

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="type">Tipo de Imóvel</Label>
      <Select 
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger id="type" className="h-10 bg-white">
          <SelectValue placeholder="Selecione o tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos os tipos</SelectItem>
          {PROPERTY_TYPES.map(type => (
            <SelectItem 
              key={type.value} 
              value={type.value}
              className="capitalize"
            >
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
