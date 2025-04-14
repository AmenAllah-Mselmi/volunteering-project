"use client"

import { DataTable } from "./data-table"
import { productColumns } from "./columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import axios from "axios"
import { Toaster } from "@/components/ui/toaster"

interface Product {
  _id: string
  name: string
  quantity: number
  unit: string
  totalQuantity: number
  remainingQuantity: number
  createdAt: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:9090/api/products')
        setProducts(response.data.data)
      } catch (err) {
        setError('Failed to fetch products')
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    const interval=setInterval(fetchProducts,5000);
    fetchProducts()
    return () => clearInterval(interval);
  }, [])

  if (loading) {
    return (
      <div className="mx-auto py-10 flex flex-col items-center w-screen h-screen">
        <div className="w-11/12">
          <div className="flex justify-between items-center mb-6 w-4/5">
            <h1 className="text-2xl font-bold">Manage Products</h1>
            <Button asChild>
              <Link href="/admin/product/create">Add New Product</Link>
            </Button>
          </div>
          <div className="w-full text-center">Loading products...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto py-10 flex flex-col items-center w-screen h-screen">
        <div className="w-11/12">
          <div className="flex justify-between items-center mb-6 w-4/5">
            <h1 className="text-2xl font-bold">Manage Products</h1>
            <Button asChild>
              <Link href="/admin/product/create">Add New Product</Link>
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
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <Button asChild>
            <Link href="/admin/product/create">Add New Product</Link>
          </Button>
        </div>
        <div className="w-full">
          <DataTable columns={productColumns} data={products} />
        </div>
      </div>
      <Toaster />
    </div>
  )
}