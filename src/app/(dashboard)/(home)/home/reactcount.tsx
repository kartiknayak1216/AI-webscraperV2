"use client"
import React from 'react'
import CountUp from 'react-countup'

export default function Rectcounup({num}:{num:number}) {
  return (
<CountUp end={num} />  )
}
