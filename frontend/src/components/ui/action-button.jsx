"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface ActionButtonProps {
  children: ReactNode
  variant?: "primary" | "secondary" | "outline"
  icon?: ReactNode
  className?: string
  onClick?: () => void
}

export function ActionButton({ children, variant = "primary", icon, className, onClick }: ActionButtonProps) {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary/10",
  }

  return (
    <Button
      onClick={onClick}
      className={cn(
        "rounded-full px-6 py-3 h-auto text-base font-medium transition-all duration-200",
        variants[variant],
        className,
      )}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Button>
  )
}
