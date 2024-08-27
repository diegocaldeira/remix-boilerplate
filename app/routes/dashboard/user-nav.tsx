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
              <NavigationLink to="ai-writers">
                <BookOpenText className="mr-2 h-4 w-4" />
                AI Writers
              </NavigationLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <NavigationLink to="copywriting">
                <TextSelect className="mr-2 h-4 w-4" />
                AI Copywriting
              </NavigationLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <NavigationLink to="ai-social">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="mr-2 h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                  />
                </svg>
                AI Social
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
