"use client";
import { useSession } from "next-auth/react";

const GOD_MODE_EMAIL = "aldrinbino275@gmail.com";

export function useAppMode() {
  const { data: session, status } = useSession();
  
  const isLoggedIn = status === "authenticated";
  const userEmail = session?.user?.email ?? "";
  const isGodMode = isLoggedIn && userEmail === GOD_MODE_EMAIL;
  
  return {
    isLoggedIn,
    isGodMode,
    userEmail,
    userName: session?.user?.name ?? "",
    userImage: session?.user?.image ?? "",
    status,
  };
}
