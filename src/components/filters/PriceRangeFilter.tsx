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
  const priceRanges = [
    { value: "", label: "Qualquer preço" },
    { value: "0-300000", label: "Até R$ 300.000" },
    { value: "300000-500000", label: "R$ 300.000 - R$ 500.000" },
    { value: "500000-800000", label: "R$ 500.000 - R$ 800.000" },
    { value: "800000-1000000", label: "R$ 800.000 - R$ 1.000.000" },
    { value: "1000000-2000000", label: "R$ 1.000.000 - R$ 2.000.000" },
    { value: "2000000-999999999", label: "Acima de R$ 2.000.000" },
  ]

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-white">
        <SelectValue placeholder="Faixa de preço" />
      </SelectTrigger>
      <SelectContent>
        {priceRanges.map((range) => (
          <SelectItem key={range.value} value={range.value}>
            {range.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}