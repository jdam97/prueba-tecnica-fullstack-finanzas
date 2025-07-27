"use client";

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserEditForm } from "@/components/userEdit-form";
import { useSession } from "@/lib/auth/client";

type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  phone?: string;
};

export default function UsersPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!isPending && user?.role !== "ADMIN") {
      router.push("/unauthorized");
    }
  }, [isPending, user, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    if (user?.role === "ADMIN") {
      fetchUsers();
    }
  }, [user]);

  if (!session || session.user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Usuarios</h1>
        <p className='text-gray-600'>Gestiona los usuarios del sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className='font-medium'>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={u.role === "ADMIN" ? "default" : "secondary"}
                    >
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <UserEditForm user={u} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
