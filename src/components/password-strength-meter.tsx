"use client"

import { cn } from "@/lib/utils"
import * as React from "react"

interface PasswordStrengthMeterProps {
  password: string
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0

    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    return strength
  }

  const strength = calculatePasswordStrength(password)
  const strengthText = [
    "Very weak",
    "Weak",
    "Fair",
    "Good",
    "Strong",
    "Very strong"
  ][strength]

  return (
    <div className="space-y-1">
      <div className="flex h-2 items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn("h-full w-full rounded-full", i < strength ? "bg-green-500" : "bg-muted")}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        {strengthText}
      </p>
    </div>
  )
}