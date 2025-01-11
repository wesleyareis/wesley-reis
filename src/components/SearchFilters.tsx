'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSearchParams, useNavigate } from "react-router-dom"

export function SearchFilters() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(name, value)
    } else {
      params.delete(name)
    }
    return params.toString()
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    navigate(`/?${createQueryString('location', e.target.value)}`)
  }

  const handleTypeChange = (value: string) => {
    navigate(`/?${createQueryString('type', value)}`)
  }

  const handlePriceChange = (value: string) => {
    navigate(`/?${createQueryString('price', value)}`)
  }

  const handleClearFilters = () => {
    navigate('/')
  }

  const currentLocation = searchParams.get("location") ?? ""
  const currentType = searchParams.get("type") ?? ""
  const currentPrice = searchParams.get("price") ?? ""

  return (
    <div className="search-container p-8 rounded-lg">
      <h1 className="text-3xl font-bold text-white mb-6">
        Encontre seu imóvel ideal
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Localização"
          className="bg-white"
          value={currentLocation}
          onChange={handleLocationChange}
        />
        <Select
          value={currentType}
          onValueChange={handleTypeChange}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Tipo de imóvel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os tipos</SelectItem>
            <SelectItem value="apartamento">Apartamento</SelectItem>
            <SelectItem value="casa">Casa</SelectItem>
            <SelectItem value="cobertura">Cobertura</SelectItem>
            <SelectItem value="comercial">Comercial</SelectItem>
            <SelectItem value="terreno">Terreno</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={currentPrice}
          onValueChange={handlePriceChange}
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
        <Button 
          onClick={handleClearFilters}
          className="bg-white text-primary hover:bg-white/90"
        >
          Limpar Filtros
        </Button>
      </div>
    </div>
  )
}