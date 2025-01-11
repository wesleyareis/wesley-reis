'use client'

import { Card, CardContent } from "@/components/ui/card"
import { ImovelCardImage } from "./imovel/card/ImovelCardImage"
import { ImovelCardFeatures } from "./imovel/card/ImovelCardFeatures"
import { ImovelCardActions } from "./imovel/card/ImovelCardActions"
import { useImovelCard } from "@/hooks/useImovelCard"

interface ImovelCardProps {
  id: string
  property_code: string
  title: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  parkingSpaces: number
  area: number
  imageUrl: string
  agent_id?: string
}

export function ImovelCard({
  id,
  property_code,
  title,
  price,
  location,
  bedrooms,
  bathrooms,
  parkingSpaces,
  area,
  imageUrl,
  agent_id,
}: ImovelCardProps) {
  const { isAgent, isLoading, handleEditClick, handleCardClick } = useImovelCard({
    id,
    property_code,
    agent_id,
  })

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <ImovelCardImage imageUrl={imageUrl} title={title} price={price} />
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 truncate">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{location}</p>
        <ImovelCardFeatures
          bedrooms={bedrooms}
          bathrooms={bathrooms}
          parkingSpaces={parkingSpaces}
          area={area}
        />
      </CardContent>
      <ImovelCardActions
        propertyCode={property_code}
        isAgent={isAgent}
        onEditClick={handleEditClick}
        isLoading={isLoading}
      />
    </Card>
  )
}