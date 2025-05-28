import React from 'react'
import { CrmDashboard } from '@/components/advertiser/dashboard/CrmDashboard'
import { useAuth } from '@/hooks/useAuth'
import { AdvertiserLayout } from '@/components/advertiser/layout/AdvertiserLayout'

export default function CrmPage() {
  const { user } = useAuth()
  if (!user) return null
  // Verifica se é anunciante via metadata, se existir
  if (user.user_metadata?.user_type && user.user_metadata.user_type !== 'anunciante') return null
  return (
    <AdvertiserLayout>
      <CrmDashboard advertiserId={user.id} />
    </AdvertiserLayout>
  )
} 