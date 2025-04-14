"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { Toaster, toast } from "sonner"
import { PlusCircle, MinusCircle, Package, ShoppingBag, FileText, Hash, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type ProductItem = {
  id: string
  productId: string
  quantity: number
}

interface Product {
  _id: string
  name: string
  unit: string
}

interface Bag {
  _id: string
  name: string
  description: string
  totalQuantity: number
  products: {
    product: {
      _id: string
      name: string
      unit: string
    }
    quantity: number
  }[]
}

export default function BagEditForm() {
  const router = useRouter()
  const params = useParams()
  const bagId = params.id as string

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    totalQuantity: 1,
  })

  const [products, setProducts] = useState<ProductItem[]>([])
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch available products
        const productsResponse = await axios.get('http://localhost:9090/api/products')
        console.log('Products response:', productsResponse.data)
        
        if (Array.isArray(productsResponse.data.data)) {
          setAvailableProducts(productsResponse.data.data)
        } else {
          console.error('Expected array but got:', productsResponse.data)
          throw new Error("Invalid products data format")
        }

        // Fetch bag data
        const bagResponse = await axios.get(`http://localhost:9090/api/bags/${bagId}`)
        const bagData: Bag = bagResponse.data

        // Set form data
        setFormData({
          name: bagData.name,
          description: bagData.description || "",
          totalQuantity: bagData.totalQuantity,
        })

        // Set products with unique IDs
        setProducts(
          bagData.products.map(item => ({
            id: crypto.randomUUID(),
            productId: item.product._id,
            quantity: item.quantity
          }))
        )

      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Error", {
          description: "Failed to load bag data",
        })
        router.push("/admin/bag")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [bagId, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: Math.max(1, Number(value) || 1) }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }))
  }

  const handleProductChange = (id: string, field: "productId" | "quantity", value: string | number) => {
    setProducts(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    )
    if (errors.products) setErrors(prev => ({ ...prev, products: "" }))
  }

  const addProduct = () => {
    if (availableProducts.length > 0) {
      setProducts(prev => [...prev, { 
        id: crypto.randomUUID(), 
        productId: availableProducts[0]._id, // Default to first available product
        quantity: 1 
      }])
    }
  }

  const removeProduct = (id: string) => {
    if (products.length > 1) {
      setProducts(prev => prev.filter(item => item.id !== id))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Bag name is required"
    if (formData.totalQuantity < 1) newErrors.totalQuantity = "Total quantity must be at least 1"

    const hasInvalidProduct = products.some(p => !p.productId || p.quantity < 1)
    if (hasInvalidProduct) newErrors.products = "All products must be selected with valid quantities"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error("Validation Error", {
        description: "Please fix the errors in the form",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const bagData = {
        name: formData.name,
        description: formData.description,
        totalQuantity: formData.totalQuantity,
        products: products.map(p => ({
          product: p.productId,
          quantity: p.quantity
        })),
      }

      await axios.put(`http://localhost:9090/api/bags/${bagId}`, bagData)

      toast.success("Bag Updated", {
        description: `${formData.name} has been updated successfully`,
        action: {
          label: "View Bags",
          onClick: () => router.push("/bags")
        },
      })

      router.push("/admin/bag")
    } catch (error) {
      console.error("Error updating bag:", error)
      toast.error("Update Failed", {
        description: axios.isAxiosError(error) 
          ? error.response?.data?.message || "Server error occurred"
          : "An unexpected error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateTotalItems = () => products.reduce((sum, p) => sum + p.quantity, 0)

  if (isLoading) {
    return (
      <div className="mx-auto p-4 md:p-0 w-screen flex justify-center items-center">
        <Card className="border-0 shadow-lg overflow-hidden w-9/12 p-8 text-center">
          Loading bag data...
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto p-4 md:p-0 w-screen flex justify-center items-center">
      <Toaster position="top-center" richColors />
      <Card className="border-0 shadow-lg overflow-hidden w-9/12">
        <CardHeader className="text-primary-foreground pb-8 bg-blue-600">
          <div className="flex items-center justify-center w-16 h-16 bg-primary-foreground text-primary rounded-full mx-auto mb-4">
            <ShoppingBag size={28} />
          </div>
          <CardTitle className="text-center text-2xl font-bold">Edit Food Bag</CardTitle>
          <CardDescription className="text-center text-primary-foreground/80">
            Update contents for distribution
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-8">
            <div className="grid gap-6 md:grid-cols-2">
              {/* General Information */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  General Information
                </h3>
                <Separator />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-blue-600">
                  Bag Name *
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter bag name"
                    className={`pl-10 h-12 ${errors.name ? "border-destructive" : ""}`}
                  />
                  <Package className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" /> {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalQuantity" className="text-sm font-medium text-blue-600">
                  Total Quantity *
                </Label>
                <div className="relative">
                  <Input
                    id="totalQuantity"
                    name="totalQuantity"
                    type="number"
                    min="1"
                    value={formData.totalQuantity}
                    onChange={handleNumberChange}
                    className={`pl-10 h-12 ${errors.totalQuantity ? "border-destructive" : ""}`}
                  />
                  <Hash className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                </div>
                {errors.totalQuantity && (
                  <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" /> {errors.totalQuantity}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="text-sm font-medium text-blue-600">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the contents and purpose of this bag..."
                  className="min-h-[100px] resize-none"
                />
              </div>

              {/* Products Section */}
              <div className="space-y-4 md:col-span-2 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Bag Contents *
                  </h3>
                  <Badge variant="outline" className="font-normal">
                    {products.length} product(s) · {calculateTotalItems()} item(s)
                  </Badge>
                </div>
                <Separator />

                {errors.products && (
                  <div className="bg-destructive/10 text-destructive rounded-md p-3 flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {errors.products}
                  </div>
                )}

                {availableProducts.length === 0 ? (
                  <div className="text-center py-4 text-destructive">
                    No products available. Please add products first.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map((product, index) => (
                      <div key={product.id} className="grid grid-cols-12 gap-3 items-end">
                        <div className="col-span-7 space-y-1">
                          <Label htmlFor={`product-${product.id}`} className="text-xs text-blue-600">
                            Product {index + 1}
                          </Label>
                          <Select
                            value={product.productId}
                            onValueChange={(value) => handleProductChange(product.id, "productId", value)}
                          >
                            <SelectTrigger id={`product-${product.id}`}>
                              <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableProducts.map((p) => (
                                <SelectItem key={p._id} value={p._id}>
                                  {p.name} ({p.unit})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="col-span-3 space-y-1">
                          <Label htmlFor={`quantity-${product.id}`} className="text-xs text-blue-600">
                            Quantity
                          </Label>
                          <Input
                            id={`quantity-${product.id}`}
                            type="number"
                            min="1"
                            value={product.quantity}
                            onChange={(e) =>
                              handleProductChange(product.id, "quantity", Math.max(1, Number(e.target.value) || 1))
                            }
                            className="h-10"
                          />
                        </div>

                        <div className="col-span-2 flex justify-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-full"
                            onClick={() => removeProduct(product.id)}
                            disabled={products.length === 1}
                          >
                            <MinusCircle className="h-5 w-5 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full mt-2 border-dashed" 
                      onClick={addProduct}
                      disabled={availableProducts.length === 0}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Product
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pb-8 pt-2">
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700" 
              disabled={isSubmitting || availableProducts.length === 0}
            >
              {isSubmitting ? "Updating..." : "Update Bag"}
            </Button>
            <p className="text-xs text-center text-muted-foreground px-4">
              Note: Remaining quantity will not be updated by this form
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}