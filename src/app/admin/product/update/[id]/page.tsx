"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from "axios"
import { Toaster, toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  name: z.string().min(1, "Le nom du produit est requis"),
  quantity: z.coerce.number().min(0, "La quantité ne peut pas être négative"),
  unit: z.string().min(1, "L'unité est requise"),
  totalQuantity: z.coerce.number().min(0, "La quantité totale ne peut pas être négative"),
})

export default function ProductEditForm() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      quantity: 0,
      unit: "",
      totalQuantity: 0,
    },
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:9090/api/products/${productId}`)
        const productData = response.data.data
        console.log(response.data.data)
        // Set form values with the fetched product data
        form.reset({
          name: productData.name || "",
          quantity: productData.quantity || 0,
          unit: productData.unit || "",
          totalQuantity: productData.totalQuantity || 0,
        })
      } catch (error) {
        console.error("Error fetching product:", error)
        toast.error("Erreur", {
          description: "Impossible de charger les données du produit",
        })
        router.push("/admin/product")
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId, form, router])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      
      await axios.put(`http://localhost:9090/api/products/${productId}`, values)

      toast.success("Produit mis à jour", {
        description: `Le produit "${values.name}" a été modifié avec succès.`,
        action: {
          label: "Voir",
          onClick: () => router.push("/admin/product")
        },
      })

      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Erreur lors de la mise à jour", {
        description: axios.isAxiosError(error) 
          ? error.response?.data?.message || "Erreur serveur"
          : "Une erreur est survenue lors de la modification du produit",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto py-10 flex w-screen justify-center">
        <Card className="w-8/12 mx-auto my-auto p-8 text-center">
          Chargement des données du produit...
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto py-10 flex w-screen justify-center">
      <Toaster position="top-center" richColors expand closeButton />
      <Card className="w-8/12 mx-auto my-auto">
        <CardHeader>
          <CardTitle>Modifier le produit</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du produit</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Entrez le nom du produit" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantité</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          placeholder="0" 
                          {...field} 
                          value={field.value || 0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unité</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une unité">
                              {field.value || "Sélectionnez une unité"}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="kg">Kilogramme (kg)</SelectItem>
                          <SelectItem value="g">Gramme (g)</SelectItem>
                          <SelectItem value="L">Litre (L)</SelectItem>
                          <SelectItem value="ml">Millilitre (ml)</SelectItem>
                          <SelectItem value="unité">Unité</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="totalQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantité totale (unité)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        placeholder="0" 
                        {...field} 
                        value={field.value || 0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push("/admin/product")}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Mise à jour en cours..." : "Mettre à jour"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}