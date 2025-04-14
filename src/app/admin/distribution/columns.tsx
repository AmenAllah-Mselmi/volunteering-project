'use client'

import { ColumnDef } from "@tanstack/react-table"
import { Distribution } from "@/types"
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
import axios from "axios"
import { toast } from "react-toastify"
import { useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
const DeleteModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the distribution
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
export const distributionColumns: ColumnDef<Distribution>[] = [
  {
    accessorKey: "bag.name",
    header: "Bag",
  },
  {
    accessorKey: "region",
    header: "Region",
  },
  {
    accessorKey: "quantityDistributed",
    header: "Quantity",
  },
  {
    accessorKey: "distributedTo",
    header: "Distributed To",
  },
  {
    accessorKey: "distributionDate",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.distributionDate)
      return date.toLocaleDateString()
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const distribution = row.original
      const [isDeleteOpen, setDeleteOpen] = useState(false)

      const closeDeleteModal = () => {
        setDeleteOpen(false)
      }

      const handleConfirm = async() => {
        const request=await axios.delete(`http://localhost:9090/api/distributions/${distribution._id}`);
        console.log(`Deleting attendee ${distribution._id}`)
        toast({
          title: " successful delete",
          description: `distribution ${request.data.Name} has been successfully deleted.`,
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
            <DropdownMenuItem  onSelect={(e) => {
              e.preventDefault()
              setDeleteOpen(true)
            }}>
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/distribution/update/${distribution._id}`}>
                Edit
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
          <DeleteModal isOpen={isDeleteOpen} onClose={closeDeleteModal} onConfirm={handleConfirm} />
        </DropdownMenu>
      )
    },
  },
]