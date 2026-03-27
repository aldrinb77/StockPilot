"use client"

import { useState, useEffect } from "react"
import { useUserProfile } from "@/hooks/useUserProfile"
import { PersonalSetup } from "./PersonalSetup"

export function OnboardingFlow() {
  const { isSetupComplete } = useUserProfile()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!isSetupComplete) {
      const timer = setTimeout(() => setShow(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [isSetupComplete])

  if (!show || isSetupComplete) return null

  return <PersonalSetup onComplete={() => setShow(false)} />
}
