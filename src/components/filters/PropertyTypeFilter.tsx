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

export function PropertyTypeFilter({ value, onChange }: PropertyTypeFilterProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="type">Tipo de Imóvel</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="type" className="bg-white">
          <SelectValue placeholder="Selecione o tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos os tipos</SelectItem>
          <SelectItem value="apartamento">Apartamento</SelectItem>
          <SelectItem value="casa">Casa</SelectItem>
          <SelectItem value="cobertura">Cobertura</SelectItem>
          <SelectItem value="terreno">Terreno</SelectItem>
          <SelectItem value="sala">Sala Comercial</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}