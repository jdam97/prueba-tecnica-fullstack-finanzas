"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth/client";
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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { MovementForm } from "@/components/movement-form";

interface Movement {
  id: string;
  concept: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: string;
  user?: {
    name: string;
    email: string;
  };
}

export default function MovementsPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [movements, setMovements] = useState<Movement[]>([]);

  const fetchMovements = async () => {
    try {
      const endpoint =
        user?.role === "ADMIN"
          ? "/api/transactions"
          : `/api/transactions?id=${user?.id}`;

      const response = await fetch(endpoint, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      setMovements(data || []);
    } catch (err) {
      console.error("Error fetching movements:", err);
    }
  };

  const deleteMovement = async (id: string) => {
    try {
      await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });
      setMovements((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Error deleting movement:", err);
    }
  };

  useEffect(() => {
    if (!isPending && user) {
      fetchMovements();
    }
  }, [isPending, user]);

  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Movimientos</h1>
          <p className='text-gray-600'>
            {user?.role === "ADMIN"
              ? "Gestiona todos los movimientos"
              : "Gestiona tus movimientos"}
          </p>
        </div>
        {user?.role === "ADMIN" && <MovementForm onSuccess={fetchMovements} />}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Movimientos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Concepto</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Usuario</TableHead>
                {user?.role === "ADMIN" && <TableHead>Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell className='font-medium'>
                    {movement.concept}
                  </TableCell>
                  <TableCell
                    className={`font-bold ${
                      movement.type === "INCOME"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {movement.type === "INCOME" ? "+" : "-"}$
                    {movement.amount.toLocaleString("es-CO")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        movement.type === "INCOME" ? "default" : "Ingreso"
                      }
                    >
                      {movement.type === "INCOME" ? "Ingreso" : "Egreso"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(movement.date).toLocaleDateString("es-CO")}
                  </TableCell>
                  <TableCell>{movement.user?.name ?? "Sin nombre"}</TableCell>
                  {user?.role === "ADMIN" && (
                    <TableCell>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => deleteMovement(movement.id)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
