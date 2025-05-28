import React from 'react'
import { useMediaQuery } from '@/hooks/use-mobile'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import AdvertiserSidebar from '@/components/advertiser/AdvertiserSidebar'

interface AdvertiserLayoutProps {
  children: React.ReactNode
}

export function AdvertiserLayout({ children }: AdvertiserLayoutProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdvertiserSidebar />
        <SidebarInset className="overflow-y-auto pb-20 fancy-scrollbar">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
} 