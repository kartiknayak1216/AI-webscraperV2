"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { CoinsIcon, HomeIcon, Layers2Icon, MenuIcon, ShieldCheckIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";
import { Sidebaritems } from "@/lib/types/sidebar";

export default function Minisidebar() {


  const pathname = usePathname();

  return (
    <div className="md:hidden">
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline"><MenuIcon/></Button>
      </SheetTrigger>
      <SheetContent className="p-4">
        <nav className="flex flex-col gap-4">
          {Sidebaritems.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className={buttonVariants({
                variant: pathname === item.link ? "sidebarActive" : "sidebarIcon",
              })}
              aria-current={pathname === item.link ? "page" : undefined}
            >
              <div className="flex items-center gap-2">
                <item.icon size={20} />
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet></div>
  )
}
