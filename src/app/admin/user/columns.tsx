'use client'

import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import axios from "axios"
import { toast } from "react-toastify"
import { useState } from "react"
import { useRouter } from "next/router"
const DeleteModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the volunteer
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
export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link 
        href={`/admin/users/${row.original._id}`}
        className="font-medium hover:underline"
      >
        {row.getValue("name")}
      </Link>
    )
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      return (
        <Badge variant={role === 'admin' ? 'default' : 'secondary'}>
          {role}
        </Badge>
      )
    },
  },
  {
    accessorKey: "region",
    header: "Region",
    cell: ({ row }) => {
      const region = row.original.region
      return region ? `${region} ` : 'N/A'
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      const [isDeleteOpen, setDeleteOpen] = useState(false)

      const closeDeleteModal = () => {
        setDeleteOpen(false)
      }

      const handleConfirm = async() => {
        const request=await axios.delete(`http://localhost:9090/api/volunteers/${user._id}`);
        console.log(`Deleting attendee ${user._id}`)
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
            <DropdownMenuItem asChild>
              <Link href={`/admin/user/update/${user._id}`}>Edit</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
          <DeleteModal isOpen={isDeleteOpen} onClose={closeDeleteModal} onConfirm={handleConfirm} />
        </DropdownMenu>
      )
    },
  },
]