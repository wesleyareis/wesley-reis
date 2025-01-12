import { Label } from "@/components/ui/label"
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

const PROPERTY_TYPES = [
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'casa', label: 'Casa' },
  { value: 'cobertura', label: 'Cobertura' },
  { value: 'sala', label: 'Sala Comercial' },
  { value: 'terreno', label: 'Terreno' }
]

export function PropertyTypeFilter({ value, onChange }: PropertyTypeFilterProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="type">Tipo de Imóvel</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
      >
        <SelectTrigger id="type" className="bg-white">
          <SelectValue placeholder="Selecione o tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos os tipos</SelectItem>
          {PROPERTY_TYPES.map(({ value, label }) => (
            <SelectItem 
              key={value} 
              value={value}
              className="capitalize"
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="text-xs text-muted-foreground">
        {PROPERTY_TYPES.length} tipos disponíveis
      </div>
    </div>
  )
}
