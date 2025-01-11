import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PriceRangeFilterProps {
  value: string
  onChange: (value: string) => void
}

export function PriceRangeFilter({ value, onChange }: PriceRangeFilterProps) {
  return (
    <Select
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger className="bg-white">
        <SelectValue placeholder="Faixa de preço" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">Qualquer preço</SelectItem>
        <SelectItem value="0-300000">Até R$ 300.000</SelectItem>
        <SelectItem value="300000-500000">R$ 300.000 - R$ 500.000</SelectItem>
        <SelectItem value="500000-800000">R$ 500.000 - R$ 800.000</SelectItem>
        <SelectItem value="800000-1000000">R$ 800.000 - R$ 1.000.000</SelectItem>
        <SelectItem value="1000000-99999999">Acima de R$ 1.000.000</SelectItem>
      </SelectContent>
    </Select>
  )
}