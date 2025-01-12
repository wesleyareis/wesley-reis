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

const propertyTypes = [
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'casa', label: 'Casa' },
  { value: 'cobertura', label: 'Cobertura' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'sala', label: 'Sala Comercial' },
]

export function PropertyTypeFilter({ value, onChange }: PropertyTypeFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-white">
        <SelectValue placeholder="Tipo de imóvel" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">Todos os tipos</SelectItem>
        {propertyTypes.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}