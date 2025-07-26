import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link"    
import { DollarSign, Home, TrendingUp, Users, BarChart3, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSession, signOut } from "@/lib/auth/client";

export default function NavBar() {
    const { data: session, isPending: loading } = useSession();
    const navigation = [
        { name: "Dashboard", href: "/dashboard", icon: Home, roles: ["ADMIN", "USER"] },
        { name: "Movimientos", href: "/dashboard/movements", icon: TrendingUp, roles: ["ADMIN", "USER"] },
        { name: "Usuarios", href: "/dashboard/users", icon: Users, roles: ["ADMIN"] },
        { name: "Reportes", href: "/dashboard/reports", icon: BarChart3, roles: ["ADMIN"] },
      ]
      const user = session?.user;
      const filteredNavigation = navigation.filter((item) => user && item.roles.includes(user.role))
      const pathname = usePathname();
      

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">FinanceApp</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors",
                    pathname === item.href
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.email}</p>
                    <p className="text-xs text-muted-foreground">Rol: {user?.role}</p>
                  </div>
                </div>
                <DropdownMenuItem onClick={async () => {
                  await signOut();
                  window.location.href = "/login";
                  }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      </nav>
  )
}
