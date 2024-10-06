import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Toaster, toast } from "react-hot-toast"
import {
  ChevronUpIcon,
  ChevronDownIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline"
import { Input } from "@/components/Signup12/Ui/Input"
import { Button } from "@/components/Signup12/Ui/Button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Signup12/Ui/Table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Signup12/Ui/Dialog"
import { Label } from "@/components/Signup12/Ui/Label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Signup12/Ui/Select"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
  gender: "male" | "female" | "other"
  location: string
  birthday: Date
}

export default function AdminManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User
    direction: "ascending" | "descending"
  } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [newUser, setNewUser] = useState<Omit<User, "_id">>({
    firstName: "",
    lastName: "",
    email: "",
    role: "admin",
    gender: "male",
    location: "Bacoor",
    birthday: new Date(),
  })

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users/admins")
      const data = await res.json()
      if (data.success) {
        setUsers(data.users)
      } else {
        toast.error("Failed to fetch users.")
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Error fetching users.")
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSort = (key: keyof User) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const sortedUsers = React.useMemo(() => {
    const sortableUsers = [...users]
    if (sortConfig !== null) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }
    return sortableUsers
  }, [users, sortConfig])

  const filteredUsers = sortedUsers.filter(
    (user) =>
      Object.values(user).some((value) =>
        value ? value.toString().toLowerCase().includes(searchTerm.toLowerCase()) : false
      )
  )

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (data.success) {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id))
        toast.success("User deleted successfully!")
      } else {
        toast.error("Failed to delete user.")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Error deleting user.")
    }
  }

  const handleEditRole = async (id: string, newRole: string) => {
    try {
      const lowerCaseRole = newRole.toLowerCase()
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: lowerCaseRole }),
      })
      const data = await res.json()
      if (data.success) {
        if (lowerCaseRole === "user") {
          setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id))
        } else {
          setUsers((prevUsers) =>
            prevUsers.map((user) => (user._id === id ? { ...user, role: lowerCaseRole } : user))
          )
        }
        toast.success("Role updated successfully!")
      } else {
        toast.error("Failed to update role.")
      }
    } catch (error) {
      console.error("Error updating role:", error)
      toast.error("Error updating role.")
    }
  }

  const handleAddUser = async () => {
    try {
      const newUserWithLowerCaseRole = { ...newUser, role: newUser.role.toLowerCase() }
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserWithLowerCaseRole),
      })
      const data = await res.json()
      if (data.success) {
        setUsers([...users, { ...newUserWithLowerCaseRole, _id: data.user._id }])
        setNewUser({
          firstName: "",
          lastName: "",
          email: "",
          role: "admin",
          gender: "male",
          location: "Bacoor",
          birthday: new Date(),
        })
        toast.success("New user added successfully!")
      } else {
        toast.error("Failed to add user.")
      }
    } catch (error) {
      console.error("Error adding user:", error)
      toast.error("Error adding user.")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#fae8b4] p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center"
    >
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-6xl bg-white rounded-lg shadow-xl overflow-hidden"
      >
        <div className="p-4 sm:p-6 bg-gray-800 text-white flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">Admin Management</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-green-500 hover:bg-green-600 text-white">
                <UserPlusIcon className="h-5 w-5 mr-2" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Admin</DialogTitle>
                <DialogDescription>
                  Enter the details of the new admin here. Click save when youre done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="firstName" className="text-right">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lastName" className="text-right">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={handleAddUser}>Save</Button>
            </DialogContent>
          </Dialog>
        </div>

        <div className="p-4 sm:p-6">
          <div className="mb-4 relative">
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  {["firstName", "lastName", "email", "role"].map((key) => (
                    <TableHead
                      key={key}
                      className="cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => handleSort(key as keyof User)}
                    >
                      <div className="flex items-center">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                        {sortConfig?.key === key &&
                          (sortConfig.direction === "ascending" ? (
                            <ChevronUpIcon className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronDownIcon className="h-4 w-4 ml-1" />
                          ))}
                      </div>
                    </TableHead>
                  ))}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredUsers.map((user) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white"
                    >
                      <TableCell>{user.firstName}</TableCell>
                      <TableCell>{user.lastName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(value) => handleEditRole(user._id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">admin</SelectItem>
                            <SelectItem value="user">user</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(user._id)}>
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}