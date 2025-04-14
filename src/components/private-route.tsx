"use client"

import { useRouter } from "next/navigation"
import { ReactNode, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export function PrivateRoute({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")

    if (token) {
      setIsAuthenticated(true) // Token exists, render children
    } else {
      router.push("/login") // No token, redirect
    }
  }, [router])

  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}

export function logout() {
  localStorage.removeItem("token")
  sessionStorage.removeItem("token")
  window.location.href = "/login"
}
