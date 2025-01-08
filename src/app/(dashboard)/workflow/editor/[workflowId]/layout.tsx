import { Separator } from '@/components/ui/separator'
import React, { ReactNode } from 'react'
import ExecutionButton from './_execution/executionbutton'
import Taskmenu from './_component/taskmenu'

export default function layout({children}:{children:ReactNode}) {
  return (
    <div className='flex min-h-screen max-h-screen'>
        <Taskmenu />
    {children}
    </div>
  )
}
