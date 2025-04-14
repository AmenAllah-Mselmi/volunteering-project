"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { Bag } from "@/types"

const TUNISIAN_REGIONS = [
  { id: "1", name: "Ariana" },
  { id: "2", name: "Béja" },
  { id: "3", name: "Ben Arous" },
  { id: "4", name: "Bizerte" },
  { id: "5", name: "Gabès" },
  { id: "6", name: "Gafsa" },
  { id: "7", name: "Jendouba" },
  { id: "8", name: "Kairouan" },
  { id: "9", name: "Kasserine" },
  { id: "10", name: "Kébili" },
  { id: "11", name: "Le Kef" },
  { id: "12", name: "Mahdia" },
  { id: "13", name: "La Manouba" },
  { id: "14", name: "Médenine" },
  { id: "15", name: "Monastir" },
  { id: "16", name: "Nabeul" },
  { id: "17", name: "Sfax" },
  { id: "18", name: "Sidi Bouzid" },
  { id: "19", name: "Siliana" },
  { id: "20", name: "Sousse" },
  { id: "21", name: "Tataouine" },
  { id: "22", name: "Tozeur" },
  { id: "23", name: "Tunis" },
  { id: "24", name: "Zaghouan" }
]

const API_URL = "http://localhost:9090/api"

interface Volunteer {
  id: string
  name: string
  email: string
  Tel: string
  region: string
  role: "volunteer" | "admin"
}

interface DistributionFormData {
  bagId: string
  region: string
  quantity: number
  distributedTo: string
  notes: string
  distributionDate: Date
}

export default function UpdateDistributionPage() {
  const router = useRouter()
  const params = useParams()
  const distributionId = params.id as string

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [date, setDate] = useState<Date>(new Date())
  
  const [formData, setFormData] = useState<DistributionFormData>({
    bagId: "",
    region: "",
    quantity: 1,
    distributedTo: "",
    notes: "",
    distributionDate: new Date()
  })

  const [bags, setBags] = useState<Bag[]>([])
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [originalQuantity, setOriginalQuantity] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bagsResponse, volunteersResponse, distributionResponse] = await Promise.all([
          fetch(`${API_URL}/bags`),
          fetch(`${API_URL}/volunteers?role=volunteer`),
          fetch(`${API_URL}/distributions/${distributionId}`)
        ])

        if (!bagsResponse.ok) throw new Error("Erreur lors du chargement des sacs")
        if (!volunteersResponse.ok) throw new Error("Erreur lors du chargement des volontaires")
        if (!distributionResponse.ok) throw new Error("Erreur lors du chargement de la distribution")

        const [bagsData, volunteersData, distributionData] = await Promise.all([
          bagsResponse.json(),
          volunteersResponse.json(),
          distributionResponse.json()
        ])

        setBags(bagsData)
        setVolunteers(volunteersData)
        
        // Pre-fill form with existing distribution data
        setFormData({
          bagId: distributionData.bag._id,
          region: distributionData.region._id,
          quantity: distributionData.quantityDistributed,
          distributedTo: distributionData.distributedTo._id,
          notes: distributionData.notes || "",
          distributionDate: new Date(distributionData.distributionDate)
        })
        setOriginalQuantity(distributionData.quantityDistributed)
        setDate(new Date(distributionData.distributionDate))
      } catch (error) {
        toast({
          title: "Erreur",
          description: error instanceof Error ? error.message : "Erreur inconnue",
          variant: "destructive",
        })
      } finally {
        setIsFetching(false)
      }
    }

    fetchData()
  }, [distributionId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || 0 : value
    }))
  }

  const handleSelectChange = (name: keyof DistributionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.quantity <= 0) {
      toast({
        title: "Erreur",
        description: "La quantité doit être supérieure à 0",
        variant: "destructive",
      })
      return
    }

    if (!formData.bagId || !formData.region || !formData.distributedTo) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/distributions/${distributionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          originalQuantity, // Send original quantity for proper quantity adjustment
          distributionDate: date.toISOString()
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de la mise à jour de la distribution")
      }

      toast({
        title: "Succès",
        description: "Distribution mise à jour avec succès",
      })

      router.push("/admin/distribution")
      router.refresh()
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur inconnue",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="container py-10 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Chargement des données...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10 flex flex-col items-center w-screen">
      <h1 className="text-2xl font-bold mb-6">Modifier Distribution</h1>
      
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Modifier la distribution</CardTitle>
          <CardDescription>
            Mettez à jour les détails de cette distribution
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bag">Sac *</Label>
                <Select
                  name="bag"
                  value={formData.bagId}
                  onValueChange={(value) => handleSelectChange("bagId", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un sac" />
                  </SelectTrigger>
                  <SelectContent>
                    {bags.map((bag) => (
                      <SelectItem key={`bag-${bag._id}`} value={bag._id}>
                        {bag.name} (Disponible: {bag.remainingQuantity + originalQuantity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Région *</Label>
                <Select
                  name="region"
                  value={formData.region}
                  onValueChange={(value) => handleSelectChange("region", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une région" />
                  </SelectTrigger>
                  <SelectContent>
                    {TUNISIAN_REGIONS.map((region) => (
                      <SelectItem key={`region-${region.id}`} value={region.name}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantité *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Quantité originale: {originalQuantity}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="distributedTo">Bénévole *</Label>
                <Select
                  name="distributedTo"
                  value={formData.distributedTo}
                  onValueChange={(value) => handleSelectChange("distributedTo", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un bénévole" />
                  </SelectTrigger>
                  <SelectContent>
                    {volunteers.map((volunteer) => (
                      <SelectItem key={`volunteer-${volunteer._id}`} value={volunteer.name}>
                        {volunteer.name} ({volunteer.region})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Date de distribution *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: fr }) : "Choisir une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Informations supplémentaires..."
                rows={3}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/distribution")}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Mettre à jour
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}