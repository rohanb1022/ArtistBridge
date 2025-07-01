"use client";

/* eslint-disable react-hooks/exhaustive-deps */

import { getCookie } from "cookies-next";
import { usePathname , useRouter} from "next/navigation";
import { useEffect } from "react";

export function useProtectedRoute(){

    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const token = getCookie("auth_token");
        const protectedRoute = ["/home" , "/profile" , "/bookings"].some((path) => {
            pathname.startsWith(path)})

        if (!token && protectedRoute) {
            router.replace("/auht/artist/login"); // Redirect to login if no token found and trying to access protected route
        }
    } , [pathname] )
}