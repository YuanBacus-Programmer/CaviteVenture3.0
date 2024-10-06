"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { ChevronUpIcon, ChevronDownIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/Signup12/Ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Signup12/Ui/Table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Signup12/Ui/Select";
import { Button } from "@/components/Signup12/Ui/Button";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: "ascending" | "descending" } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all users from the API
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.success) {
        const userRoleOnly = data.users.filter((user: User) => user.role.toLowerCase() === "user");
        setUsers(userRoleOnly); // Only set users with the role 'user'
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users");
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users on component mount
  }, []);

  // Sorting users by key
  const handleSort = (key: keyof User) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
    const sortableUsers = [...users];
    if (sortConfig !== null) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  // Ensure all values are strings before checking for search term
  const filteredUsers = sortedUsers.filter((user) =>
    Object.values(user).some((value) =>
      value ? value.toString().toLowerCase().includes(searchTerm.toLowerCase()) : false
    )
  );

  // Handle role update
  const handleEditRole = async (id: string, newRole: string) => {
    try {
      const lowerCaseRole = newRole.toLowerCase(); // Ensure role is lowercase
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: lowerCaseRole }),
      });
      const data = await res.json();
      if (data.success) {
        if (lowerCaseRole === "admin") {
          setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id)); // Remove user if promoted to admin
        } else {
          setUsers((prevUsers) =>
            prevUsers.map((user) => (user._id === id ? { ...user, role: lowerCaseRole } : user))
          );
        }
        toast.success("Role updated successfully!");
      } else {
        toast.error("Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Error updating role");
    }
  };

  // Handle user delete
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
        toast.success("User deleted successfully!");
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    }
  };

  return (
    <div className="min-h-screen bg-[#fae8b4] p-8 flex flex-col items-center justify-center">
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden"
      >
        <div className="p-6 bg-gray-800 text-white flex justify-between items-center">
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        <div className="p-6">
          <div className="mb-4 relative">
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
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
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <TableCell>{user.firstName}</TableCell>
                      <TableCell>{user.lastName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Select value={user.role} onValueChange={(value) => handleEditRole(user._id, value)}>
                          <SelectTrigger className="col-span-3">
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
    </div>
  );
}
