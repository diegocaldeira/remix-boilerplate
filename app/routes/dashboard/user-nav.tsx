import { useContext } from "react"
import { NavLink, useFetcher, useRouteLoaderData } from "@remix-run/react"
import {
  BookOpenText,
  CreditCard,
  Layers2,
  LogOut,
  TextSelect,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { type loader as dashboardLoader } from "./route"
import { SidebarContext } from "./sidebar.context"

export function UserNav() {
  const fetcher = useFetcher()
  const data = useRouteLoaderData<typeof dashboardLoader>(
    "routes/dashboard/route"
  )
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {data?.user.fullName?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {data?.user.fullName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {data?.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <NavigationLink to="projects">
                <Layers2 className="mr-2 h-4 w-4" />
                Seus Projetos
              </NavigationLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <NavigationLink to="plans">
                <CreditCard className="mr-2 h-4 w-4" />
                Assinaturas
              </NavigationLink>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() =>
              fetcher.submit({}, { method: "post", action: "/auth/logout" })
            }
          >
            <LogOut className="mr-2 h-4 w-4" />
            Desconectar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

type NavigationLinkProps = {
  to: string
  children: React.ReactNode
}

const NavigationLink = ({ to, children }: NavigationLinkProps) => {
  const { onNavLinkClick } = useContext(SidebarContext)
  return (
    <NavLink
      to={to}
      className="block"
      end
      onClick={() => {
        onNavLinkClick?.()
      }}
    >
      {({ isActive }) => (
        <Button
          variant="ghost"
          className={cn("w-full justify-start", {
            "bg-zinc-100 font-semibold dark:bg-zinc-900": isActive,
          })}
        >
          {children}
        </Button>
      )}
    </NavLink>
  )
}
