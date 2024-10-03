// import { useState } from "react"

// import { Logo } from "@/lib/brand/logo"
// import { HamburgerMenuIcon } from "@radix-ui/react-icons"

// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// import { Sidebar } from "./sidebar"
// import { SidebarContext } from "./sidebar.context"
import { ThemeToggle } from "./theme-toggle"
import { UserNav } from "./user-nav"

type Props = {
  children: React.ReactNode
}

export function Shell({ children }: Props) {
  // const [hamMenuOpen, setHamMenuOpen] = useState(false)

  // const closeHamMenu = () => {
  //   setHamMenuOpen(false)
  // }

  return (
    <div className="h-full">
      <div className="flex h-full">
        {/* <div className="hidden w-72 border-r bg-background md:block">
          <Sidebar />
        </div> */}
        <div className="flex-grow">
          <div className="flex h-14 w-full items-end justify-between px-4 md:justify-end">
            {/* <div className="flex items-center md:hidden">
              <Sheet open={hamMenuOpen} onOpenChange={setHamMenuOpen}>
                <SheetTrigger>
                  <HamburgerMenuIcon height={18} width={18} />
                </SheetTrigger>
                <SheetContent side="left" className="px-2">
                  <SidebarContext.Provider
                    value={{ onNavLinkClick: closeHamMenu }}
                  >
                    <Sidebar />
                  </SidebarContext.Provider>
                </SheetContent>
              </Sheet>
            </div> */}
            <div className="flex h-14 items-center space-x-3 px-8 pt-6">
              {/* TODO: drive this logo using brand config */}
              <img
                className="mt-1 h-32"
                src="/app/lib/brand/logo-aicaldeira.png"
                alt="AI Caldeira"
              />
            </div>
            <div className="flex items-start space-x-3">
              <UserNav />
              <ThemeToggle />
            </div>
          </div>

          {/* content */}
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  )
}
