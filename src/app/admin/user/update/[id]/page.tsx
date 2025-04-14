"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toaster, toast } from "sonner"
import { UserPlus, Mail, Phone, MapPin } from "lucide-react"

interface Region {
  _id: string
  name: string
  code: string
}

interface VolunteerData {
  _id?: string
  name: string
  email: string
  Tel: string
  region: string
  role: string
}

export default function VolunteerForm() {
  const params = useParams()
  const router = useRouter()
  const volunteerId = params.id as string

  const [formData, setFormData] = useState<VolunteerData>({
    name: "",
    email: "",
    Tel: "",
    region: "",
    role: "volunteer"
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(!!volunteerId)

  const tunisianRegions: Region[] = [
    { _id: "1", name: "Ariana", code: "12" },
    { _id: "2", name: "Béja", code: "21" },
    { _id: "3", name: "Ben Arous", code: "13" },
    { _id: "4", name: "Bizerte", code: "23" },
    { _id: "5", name: "Gabès", code: "81" },
    { _id: "6", name: "Gafsa", code: "71" },
    { _id: "7", name: "Jendouba", code: "32" },
    { _id: "8", name: "Kairouan", code: "41" },
    { _id: "9", name: "Kasserine", code: "42" },
    { _id: "10", name: "Kébili", code: "73" },
    { _id: "11", name: "Le Kef", code: "33" },
    { _id: "12", name: "Mahdia", code: "51" },
    { _id: "13", name: "La Manouba", code: "14" },
    { _id: "14", name: "Médenine", code: "82" },
    { _id: "15", name: "Monastir", code: "52" },
    { _id: "16", name: "Nabeul", code: "15" },
    { _id: "17", name: "Sfax", code: "61" },
    { _id: "18", name: "Sidi Bouzid", code: "43" },
    { _id: "19", name: "Siliana", code: "34" },
    { _id: "20", name: "Sousse", code: "53" },
    { _id: "21", name: "Tataouine", code: "83" },
    { _id: "22", name: "Tozeur", code: "72" },
    { _id: "23", name: "Tunis", code: "11" },
    { _id: "24", name: "Zaghouan", code: "22" }
  ]

  useEffect(() => {
    if (volunteerId) {
      const fetchVolunteer = async () => {
        try {
          const response = await axios.get(`http://localhost:9090/api/volunteers/${volunteerId}`)
          const volunteerData = {
            name: response.data.name || "",
            email: response.data.email || "",
            Tel: response.data.Tel || "",
            region: response.data.region || "",
            role: response.data.role || "volunteer"
          }
          setFormData(volunteerData)
        } catch (error) {
          console.error("Error fetching volunteer:", error)
          toast.error("Erreur", {
            description: "Impossible de charger les données du bénévole",
          })
        } finally {
          setIsLoading(false)
        }
      }
      fetchVolunteer()
    }
  }, [volunteerId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, region: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (volunteerId) {
        await axios.put(`http://localhost:9090/api/volunteers/${volunteerId}`, formData)
        toast.success("Mise à jour réussie", {
          description: "Les informations du bénévole ont été mises à jour.",
        })
        router.push('/admin/user')
      } else {
        await axios.post('http://localhost:9090/api/volunteers', formData)
        toast.success("Inscription réussie", {
          description: "Merci pour votre engagement en tant que bénévole.",
        })
        // Reset form after successful submission for new volunteers
        setFormData({
          name: "",
          email: "",
          Tel: "",
          region: "",
          role: "volunteer"
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Erreur", {
        description: "Une erreur s'est produite lors de l'envoi du formulaire.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto p-4 md:p-0 w-screen flex justify-center items-center">
        <div className="border-0 shadow-lg w-9/12 p-8 text-center">
          Chargement des données...
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto p-4 md:p-0 w-screen flex justify-center items-center">
      <Toaster position="top-center" richColors />
      
      <Card className="border-0 shadow-lg w-9/12">
        <CardHeader className="bg-blue-600 text-primary-foreground rounded-t-lg pb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-primary-foreground text-primary rounded-full mx-auto mb-4">
            <UserPlus size={28} />
          </div>
          <CardTitle className="text-center text-2xl font-bold">
            {volunteerId ? "Modifier Bénévole" : "Devenir Bénévole"}
          </CardTitle>
          <CardDescription className="text-center text-primary-foreground/80">
            {volunteerId ? "Mettez à jour les informations du bénévole" : "Rejoignez notre équipe et faites la différence"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-8">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-blue-600">
                Nom complet
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Entrez votre nom"
                  className="pl-10 h-12"
                  required
                />
                <UserPlus className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-blue-600">
                Adresse email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="exemple@email.com"
                  className="pl-10 h-12"
                  required
                  pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
                />
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="Tel" className="text-sm font-medium text-blue-600">
                Numéro de téléphone
              </Label>
              <div className="relative">
                <Input
                  id="Tel"
                  name="Tel"
                  value={formData.Tel}
                  onChange={handleChange}
                  placeholder="Entrez votre numéro de téléphone"
                  className="pl-10 h-12"
                  required
                />
                <Phone className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="region" className="text-sm font-medium text-blue-600">
                Région d'intervention
              </Label>
              <div className="relative mb-8">
                <Select 
                  value={formData.region}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger className="pl-10 h-12">
                    <SelectValue placeholder="Sélectionnez votre région">
                      {formData.region || "Sélectionnez votre région"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {tunisianRegions.map((region) => (
                      <SelectItem key={region._id} value={region.name}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pb-8">
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium bg-blue-600" 
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? "Traitement en cours..." 
                : volunteerId 
                  ? "Mettre à jour" 
                  : "S'inscrire comme bénévole"}
            </Button>
            <p className="text-xs text-center text-muted-foreground px-4">
              {volunteerId 
                ? "Les modifications seront appliquées immédiatement."
                : "En vous inscrivant, vous acceptez de recevoir des informations concernant les activités bénévoles."}
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}