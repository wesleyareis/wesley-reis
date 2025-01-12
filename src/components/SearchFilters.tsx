'use client'

import { Button } from "@/components/ui/button"
import { useSearchParams, useNavigate } from "react-router-dom"
import { LocationFilter } from "./filters/LocationFilter"
import { PropertyTypeFilter } from "./filters/PropertyTypeFilter"
import { PriceRangeFilter } from "./filters/PriceRangeFilter"

export function SearchFilters() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const handleTypeChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    
    if (value) {
      params.set('type', value)
    } else {
      params.delete('type')
    }
    
    navigate(`?${params.toString()}`, { replace: true })
  }

  const handleLocationChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('location', value)
    } else {
      params.delete('location')
    }
    navigate(`?${params.toString()}`, { replace: true })
  }

  const handlePriceChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('price', value)
    } else {
      params.delete('price')
    }
    navigate(`?${params.toString()}`, { replace: true })
  }

  const handleClearFilters = () => {
    navigate('/', { replace: true })
  }

  const currentType = searchParams.get("type") ?? ""
  const currentLocation = searchParams.get("location") ?? ""
  const currentPrice = searchParams.get("price") ?? ""

  return (
    <div className="search-container p-8 rounded-lg bg-primary/10">
      <h1 className="text-3xl font-bold text-primary mb-6">
        Encontre seu imóvel ideal
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          className="bg-white hover:bg-white/90"
        >
          Limpar Filtros
        </Button>
      </div>
    </div>
  )
}
