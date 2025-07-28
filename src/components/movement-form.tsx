"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "@/lib/auth/client";

export const MovementForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    concept: "",
    amount: "",
    type: "INCOME",
    date: new Date().toISOString(),
  });

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (value: string) => {
    setForm({ ...form, type: value });
  };

  const handleSubmit = async () => {
    try {
      const isoDate = new Date(form.date).toISOString();
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          amount: parseFloat(form.amount),
          date: isoDate,
          userId,
        }),
      });

      if (!res.ok) throw new Error("Error al crear movimiento");
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("❌ Error creando movimiento:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nuevo Movimiento</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[500px]'>
        <h2 className='text-xl font-semibold mb-4'>Agregar Movimiento</h2>
        <div className='space-y-4'>
          <div>
            <Label htmlFor='concept'>Concepto</Label>
            <Input
              name='concept'
              value={form.concept}
              onChange={handleChange}
              placeholder='Ej. Pago de servicio'
            />
          </div>
          <div>
            <Label htmlFor='amount'>Monto</Label>
            <Input
              type='number'
              name='amount'
              value={form.amount}
              onChange={handleChange}
              placeholder='Ej. 50000'
            />
          </div>
          <div>
            <Label>Tipo</Label>
            <Select value={form.type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder='Seleccionar tipo' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='INCOME'>Ingreso</SelectItem>
                <SelectItem value='EXPENSE'>Egreso</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor='date'>Fecha</Label>
            <Input
              type='datetime-local'
              name='date'
              value={form.date}
              onChange={handleChange}
            />
          </div>
          <div className='flex justify-end pt-4'>
            <Button onClick={handleSubmit}>Guardar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
