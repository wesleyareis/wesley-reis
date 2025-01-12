import { Input } from "@/components/ui/input"

interface LocationFilterProps {
  value: string
  onChange: (value: string) => void
}

export function LocationFilter({ value, onChange }: LocationFilterProps) {
  return (
    <Input
      placeholder="Localização"
      className="bg-white"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}