"use client"

import { useUser } from "@clerk/nextjs"

export function useAppMode() {
  const { user, isLoaded } = useUser()
  // Ensure the email matches the God Mode creator EXACTLY
  const isGodMode = user?.primaryEmailAddress?.emailAddress === 'aldrinbino275@gmail.com'
  
  return { isGodMode, isLoaded, user }
}
