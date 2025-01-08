import { Separator } from '@/components/ui/separator'
import React, { ReactNode } from 'react'

export default function layout({children}:{children:ReactNode}) {
  return (
    <div className='flex min-h-screen max-h-screen'>
    {children}
    </div>
  )
}
