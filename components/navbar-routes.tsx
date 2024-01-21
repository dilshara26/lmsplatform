"use client"

import {UserButton} from "@clerk/nextjs"
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation"
import {Button} from "@/components/ui/button";
import {LogOut} from "lucide-react";
import {SearchInput} from "@/components/search-input";
import { useUser } from '@clerk/nextjs';



export const NavBarRoutes = () => {
    const pathname = usePathname();
    const { user } = useUser();
    const router = useRouter();
    const isTeacherPage = pathname?.startsWith("/teacher");
    const isCoursePage = pathname?.includes("/courses");
    const isSearchPage = pathname == "/search" || "/"
    let isUser = false;
    if(user){
        isUser= true;
    }

    return (
        <>
            {isSearchPage && (
                <div className="hidden md:block">
                    <SearchInput/>
                </div>
            )

            }
            <div className="flex gap-x-2 ml-auto">
                {isTeacherPage || isCoursePage ? (
                    <Link href="/">
                        <Button size="sm" variant="ghost">
                            <LogOut className="h-4 w-4 mr-2"/>
                            Exit
                        </Button>
                    </Link>
                ) : (
                    <Link href="/teacher/courses">
                        <Button size="sm" variant="ghost">
                            Teacher mode
                        </Button>
                    </Link>
                )}
                <UserButton afterSignOutUrl="/"/>
                {!isUser && (
                    <Link href="/sign-in">
                        <Button size="sm" >
                            Sign in
                        </Button>
                    </Link>
                )}
            </div>
        </>
    )
}