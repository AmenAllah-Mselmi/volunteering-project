"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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

export default function ProductCreateForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      quantity: 0,
      unit: "",
      totalQuantity: 0,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      
      const response = await axios.post('http://localhost:9090/api/products', {
        ...values,
        remainingQuantity: values.totalQuantity
      })

      toast.success("Produit créé avec succès", {
        description: `Le produit "${values.name}" a été ajouté à votre inventaire.`,
        action: {
          label: "Voir",
          onClick: () => router.push("/admin/product")
        },
      })

      form.reset()
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Erreur lors de la création", {
        description: axios.isAxiosError(error) 
          ? error.response?.data?.message || "Erreur serveur"
          : "Une erreur est survenue lors de la création du produit",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto py-10 flex w-screen justify-center">
      <Toaster position="top-center" richColors expand closeButton />
      <Card className="w-8/12 mx-auto my-auto">
        <CardHeader>
          <CardTitle>Créer un nouveau produit</CardTitle>
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
                      <Input placeholder="Entrez le nom du produit" {...field} />
                    </FormControl>
                    <FormDescription>Le nom doit être unique</FormDescription>
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
                        <Input type="number" min="0" placeholder="0" {...field} />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une unité" />
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
                      <Input type="number" min="0" placeholder="0" {...field} />
                    </FormControl>
                    <FormDescription>La quantité restante sera initialement égale à la quantité totale</FormDescription>
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
                  {isSubmitting ? "Création en cours..." : "Créer le produit"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}