import { ImovelView } from "@/components/imovel/ImovelView"
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ImovelPage({
  params
}: {
  params: { property_code: string }
}) {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('property_code', params.property_code)
    .maybeSingle()

  if (!property) {
    notFound()
  }

  const { data: { user } } = await supabase.auth.getUser()
  const canEdit = !!user && user.id === property.agent_id

  return <ImovelView property={property} canEdit={canEdit} />
}