'use client'

import { ColumnDef } from "@tanstack/react-table"
import { Bag } from "@/types"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import axios from "axios"
import { toast } from "react-toastify"
import { useState } from "react"
const DeleteModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the Bag
            and remove the data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
export const bagColumns: ColumnDef<Bag>[] = [
  {
    accessorKey: "name",
    header: "Bag Name",
    cell: ({ row }) => (
      <Link 
        href={`/admin/bags/${row.original._id}`}
        className="font-medium hover:underline"
      >
        {row.getValue("name")}
      </Link>
    )
  },
  {
    accessorKey: "products",
    header: "Contents",
    cell: ({ row }) => {
      const products = row.original.products
      return (
        <div className="flex flex-wrap gap-1">
          {products.map((item, index) => (
            <Badge key={index} variant="outline">
              {item.quantity} {item.product.unit} {item.product.name}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "remainingQuantity",
    header: "Available",
    cell: ({ row }) => {
      const remaining = row.original.remainingQuantity
      const total = row.original.totalQuantity
      return `${remaining} / ${total}`
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const bag = row.original
      const [isDeleteOpen, setDeleteOpen] = useState(false)

      const closeDeleteModal = () => {
        setDeleteOpen(false)
      }

      const handleConfirm = async() => {
        const request=await axios.delete(`http://localhost:9090/api/bags/${bag._id}`);
        console.log(`Deleting attendee ${bag._id}`)
        toast({
          title: " successful delete",
          description: `Attendee ${request.data.Name} has been successfully deleted.`,
        });
        closeDeleteModal()
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem   onSelect={(e) => {
              e.preventDefault()
              setDeleteOpen(true)
            }}>
             Delete
            </DropdownMenuItem>
            <DropdownMenuItem >
              <Link href={`/admin/bag/update/${bag._id}`}>Edit</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
          <DeleteModal isOpen={isDeleteOpen} onClose={closeDeleteModal} onConfirm={handleConfirm} />
        </DropdownMenu>
      )
    },
  },
]