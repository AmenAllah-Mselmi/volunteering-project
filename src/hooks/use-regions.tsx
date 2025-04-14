"use client"

import { useState, useEffect } from "react"

type Region = {
  _id: string
  name: string
  code: string
}

export function useRegions() {
  const [regions, setRegions] = useState<Region[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchRegions() {
      try {
        setIsLoading(true)
       // const data = await getRegions()
       // setRegions(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Erreur lors du chargement des régions"))
        console.error("Erreur lors du chargement des régions:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRegions()
  }, [])

  return { regions, isLoading, error }
}

