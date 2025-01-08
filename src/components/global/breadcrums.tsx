"use client"
import { usePathname } from 'next/navigation'
import React from 'react'

export default function Breadcrumb() {
    const pathname =usePathname()

    let message = "Welcome to the page!";
  let label 
    switch (pathname) {
        case "/":
            message = "Welcome to the Home page!";
            label="Dashboard"
            break;
        case "/workflow":
            message = "Here are your workflows.";
            label="Workflows"

            break;
        case "/billing":
            message = "Billing information is displayed here.";
            label="Billing"

            break;
        case "/credential":
            message = "Manage your credentials here.";
            label="Credentials"

            break;
        default:
            message = "Explore our pages.";
            label=""

            break;
    }

  return (
    <div className=' container'>
    <div className='flex flex-col justify-center'>
                <div className="text-3xl rounded-md bg-gradient-to-r from-primary/60 to-primary/45 text-transparent bg-clip-text ">
            {label}</div>
        </div></div>  
  )
}
