"use client"
import { DataTable } from "./data-table"
import { userColumns } from "./columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import axios from 'axios'
import { useEffect, useState } from 'react'

interface User {
  _id: string
  name: string
  email: string
  role: string
  region:string  | null
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:9090/api/volunteers')
        setUsers(response.data)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch users')
        setLoading(false)
        console.error('Error fetching users:', err)
      }
    }
    const interval=setInterval(fetchUsers,5000);
    fetchUsers()
    return () => clearInterval(interval);
  }, [])

  if (loading) {
    return <div className="mx-auto py-10 flex justify-center">Loading...</div>
  }

  // if (error) {
  //   return <div className="mx-auto py-10 flex justify-center text-red-500">{error}</div>
  // }

  return (
    <div className="mx-auto py-10 flex flex-col items-center w-screen h-screen">
      <div className="w-11/12">
        <div className="flex justify-between items-center mb-6 w-4/5">
          <h1 className="text-2xl font-bold">Manage Users</h1>
          <Button asChild>
            <Link href="/admin/user/create">Add New User</Link>
          </Button>
        </div>
        <div className="w-full">
          <DataTable columns={userColumns} data={users} />
        </div>
      </div>
    </div>
  )
}