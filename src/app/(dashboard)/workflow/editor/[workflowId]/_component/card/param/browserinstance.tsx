import { TaskParams } from '@/lib/types/task'
import React from 'react'

export default function BrowserInstance({param}:{param:TaskParams}) {
  return (
    <div className='text-xs'>{param.name}</div>
  )
}
