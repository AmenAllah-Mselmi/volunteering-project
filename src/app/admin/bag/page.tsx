"use client"

import { DataTable } from "./data-table"
import { bagColumns } from "./columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import axios from "axios"
import { Toaster } from "@/components/ui/toaster"

interface ProductItem {
  product: {
    _id: string
    name: string
    unit: string
  }
  quantity: number
}

interface Bag {
  _id: string
  name: string
  description: string
  products: ProductItem[]
  totalQuantity: number
  remainingQuantity: number
  createdAt: string
}

export default function BagsPage() {
  const [bags, setBags] = useState<Bag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBags = async () => {
      try {
        const response = await axios.get('http://localhost:9090/api/bags')
        setBags(response.data)
      } catch (err) {
        setError('Failed to fetch bags')
        console.error('Error fetching bags:', err)
      } finally {
        setLoading(false)
      }
    }

    const interval=setInterval(fetchBags,5000);
    fetchBags()
    return () => clearInterval(interval);
  }, [])

  if (loading) {
    return (
      <div className="mx-auto py-10 flex flex-col items-center w-screen h-screen">
        <div className="w-11/12">
          <div className="flex justify-between items-center mb-6 w-4/5">
            <h1 className="text-2xl font-bold">Food Bags</h1>
            <Button asChild>
              <Link href="/admin/bag/create">Create New Bag</Link>
            </Button>
          </div>
          <div className="w-full text-center">Loading bags...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto py-10 flex flex-col items-center w-screen h-screen">
        <div className="w-11/12">
          <div className="flex justify-between items-center mb-6 w-4/5">
            <h1 className="text-2xl font-bold">Food Bags</h1>
            <Button asChild>
              <Link href="/admin/bag/create">Create New Bag</Link>
            </Button>
          </div>
          <div className="w-full text-center text-red-500">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto py-10 flex flex-col items-center w-screen h-screen">
      <div className="w-11/12">
        <div className="flex justify-between items-center mb-6 w-4/5">
          <h1 className="text-2xl font-bold">Food Bags</h1>
          <Button asChild>
            <Link href="/admin/bag/create">Create New Bag</Link>
          </Button>
        </div>
        <div className="w-full">
          <DataTable columns={bagColumns} data={bags} />
        </div>
      </div>
      <Toaster />
    </div>
  )
}