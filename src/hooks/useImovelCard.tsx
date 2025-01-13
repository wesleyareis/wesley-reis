import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface UseImovelCardProps {
  id: string
  property_code: string
  agent_id?: string
}

export function useImovelCard({ id, property_code, agent_id }: UseImovelCardProps) {
  const [isAgent, setIsAgent] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
      setIsAgent(!!user && user.id === agent_id)
    }
    checkAuth()

    // Inscrever para mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user)
      setIsAgent(!!session?.user && session.user.id === agent_id)
    })

    return () => subscription.unsubscribe()
  }, [agent_id])

  const handleEditClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para editar")
      navigate('/login')
      return
    }

    if (!isAgent) {
      toast.error("Apenas o corretor responsável pode editar este imóvel")
      return
    }

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

      navigate(`/imovel/editar/${property_code}`)
    } catch (error) {
      console.error('Erro ao buscar dados do imóvel:', error)
      toast.error("Erro ao carregar dados do imóvel")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCardClick = () => {
    navigate(`/imovel/${property_code}`)
  }

  return {
    isAgent,
    isAuthenticated,
    isLoading,
    handleEditClick,
    handleCardClick
  }
}