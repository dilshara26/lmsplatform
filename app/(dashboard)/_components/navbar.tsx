import { MobileSidebar } from "./mobile-sidebar"
import { NavBarRoutes } from "@/components/navbar-routes"

export const NavBar = ()=>{
    return(
        <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
            <MobileSidebar/>
            <NavBarRoutes/>
        </div>


    )
}