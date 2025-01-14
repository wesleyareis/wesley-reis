'use client'

import { Button } from "@/components/ui/button"
import { useSearchParams, useNavigate } from "react-router-dom"
import { LocationFilter } from "./filters/LocationFilter"
import { PropertyTypeFilter } from "./filters/PropertyTypeFilter"
import { PriceRangeFilter } from "./filters/PriceRangeFilter"

export function SearchFilters() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== "todos") {
      params.set(name, value)
    } else {
      params.delete(name)
    }
    return params.toString()
  }

  const handleLocationChange = (value: string) => {
    navigate(`/?${createQueryString('location', value)}`)
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
  const currentType = searchParams.get("type") ?? "todos"
  const currentPrice = searchParams.get("price") ?? "todos"

  return (
    <div className="search-container p-8 rounded-lg bg-primary/10">
      <h1 className="text-3xl font-bold text-white mb-6 block">
        Encontre seu imóvel ideal
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <LocationFilter 
          value={currentLocation}
          onChange={handleLocationChange}
        />
        <PropertyTypeFilter
          value={currentType}
          onChange={handleTypeChange}
        />
        <PriceRangeFilter
          value={currentPrice}
          onChange={handlePriceChange}
        />
        <Button 
          onClick={handleClearFilters}
          variant="outline"
          className="bg-white hover:bg-white/90 h-10"
        >
          Limpar Filtros
        </Button>
      </div>
    </div>
  )
}