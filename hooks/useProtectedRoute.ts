"use client";

/* eslint-disable react-hooks/exhaustive-deps */

import { getCookie } from "cookies-next";
import { usePathname , useRouter} from "next/navigation";
import { useEffect } from "react";

export function useProtectedRoute(){

    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const token = getCookie("token");
        console.log(token)
        const protectedRoute = ["/artist/home" , "/profile" , "/bookings"].some((path) => {
            pathname.startsWith(path)})

        if (!token && protectedRoute) {
            router.replace("/auth/artist/login"); // Redirect to login if no token found and trying to access protected route
        }
    } , [pathname] )
}