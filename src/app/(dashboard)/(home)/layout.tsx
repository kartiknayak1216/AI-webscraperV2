"use client"
import React, { Suspense } from 'react'
import { Separator } from '@/components/ui/separator'
import {  SidebarMenuSkeleton } from '@/components/ui/sidebar'
import Sidebar from '@/components/global/sidebar'
import Minisidebar from '@/components/global/minisidebar'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { ModeToggle } from '@/components/global/moddletoggle'
import { UserButton,  useUser } from '@clerk/nextjs'

export default function layout({children}:{children:React.ReactNode}) {
  const {user} =  useUser()
    return (
    <div className='flex min-h-screen h-full'>
         <Suspense  fallback={<SidebarMenuSkeleton/>}><Sidebar/>
         </Suspense> 
<div className='flex flex-col flex-1 min-h-screen'>
<header className=' items-center flex justify-between px-8 py-5 h-[68px] container'>
          <div className='mr-2'><Minisidebar/></div>
          <Breadcrumb/> 
          <div className='flex gap-x-2'>
          <ModeToggle/>
            {user ? <UserButton afterSwitchSessionUrl='/' /> : null}
            </div>
          </header>
            <Separator />
<div className='overflow-y-auto overflow-x-hidden'>
<div className="flex-1 container py-4 text-accent-foreground">
</div>
{children}
</div>
</div>
</div>
  )
}
