"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react"

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastContextType {
  toast: (type: ToastType, message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (type: ToastType, message: string) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastItem key={t.id} t={t} onDismiss={() => setToasts(prev => prev.filter(x => x.id !== t.id))} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ t, onDismiss }: { t: Toast, onDismiss: () => void }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-tvGreen" />,
    error: <XCircle className="w-5 h-5 text-tvRed" />,
    warning: <AlertCircle className="w-5 h-5 text-tvAmber" />,
    info: <Info className="w-5 h-5 text-tvBlue" />,
  }

  const colors = {
    success: 'border-tvGreen/30 bg-tvGreen/5',
    error: 'border-tvRed/30 bg-tvRed/5',
    warning: 'border-tvAmber/30 bg-tvAmber/5',
    info: 'border-tvBlue/30 bg-tvBlue/5',
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      className={`glass-card p-4 rounded-2xl border flex items-center gap-3 min-w-[300px] shadow-2xl ${colors[t.type]}`}
    >
      <div className="shrink-0">{icons[t.type]}</div>
      <p className="text-sm font-bold text-white flex-grow">{t.message}</p>
      <button onClick={onDismiss} className="text-gray-500 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
      <motion.div 
         initial={{ width: "100%" }}
         animate={{ width: "0%" }}
         transition={{ duration: 5, ease: "linear" }}
         className={`absolute bottom-0 left-0 h-0.5 rounded-full ${t.type === 'success' ? 'bg-tvGreen' : t.type === 'error' ? 'bg-tvRed' : t.type === 'warning' ? 'bg-tvAmber' : 'bg-tvBlue'}`}
      />
    </motion.div>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error("useToast must be used within ToastProvider")
  return context
}
