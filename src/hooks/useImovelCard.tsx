import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface UseImovelCardProps {
  id: string
  property_code: string
  agent_id?: string
}

export function useImovelCard({ id, property_code, agent_id }: UseImovelCardProps) {
  const [isAgent, setIsAgent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkIfAgent = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAgent(!!user && user.id === agent_id)
    }
    checkIfAgent()
  }, [agent_id])

  const handleEditClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isLoading) return
    
    setIsLoading(true)
    
    try {
      const { data: property, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error) {
        throw error
      }

      if (!property) {
        toast.error("Imóvel não encontrado")
        return
      }

      router.push(`/imovel/editar/${property_code}`)
    } catch (error) {
      console.error('Erro ao buscar dados do imóvel:', error)
      toast.error("Erro ao carregar dados do imóvel")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCardClick = () => {
    router.push(`/imovel/${property_code}`)
  }

  return {
    isAgent,
    isLoading,
    handleEditClick,
    handleCardClick
  }
}