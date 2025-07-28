import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil } from "lucide-react";
import { useSession, signOut } from "@/lib/auth/client";

type Props = {
  user: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "USER";
  };
};

export const UserEditForm = ({ user }: Props) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<"ADMIN" | "USER">(user.role);
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession(); // <-- AÑADIDO

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, name, email, role }),
      });

      if (res.ok) {
        setOpen(false);

        // 🚨 Cierra sesión si el usuario se autoedita y cambia su rol
        const sessionTyped = session as any; // FORZAR tipo any para evitar error TS

        if (sessionTyped?.user?.id === user.id && sessionTyped.user.role !== role) {
          await signOut();
          window.location.href = "/login";
        } else {
          window.location.reload();
        }
      } else {
        console.error("Error al actualizar el usuario");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //   const isSelfEditing = session?.user?.id === user.id // <-- Para desactivar el campo de rol si es él mismo

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          <Pencil className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <Label>Nombre</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label>Rol</Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as "ADMIN" | "USER")}
            //   disabled={isSelfEditing} // 🔒 evita que se cambie su propio rol (opcional)
            >
              <SelectTrigger>
                <SelectValue placeholder='Seleccionar rol' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ADMIN'>Admin</SelectItem>
                <SelectItem value='USER'>Usuario</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex justify-end'>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
