import { useAlertSystem } from "@/hooks/useAlertSystem"
import { useStore } from "@/store/store"
import { useEffect } from "react"

export function BugFixClient() {
  const { checkStreak } = useStore()
  
  useEffect(() => {
    checkStreak()
  }, [checkStreak])

  useAlertSystem()
  return null
}
