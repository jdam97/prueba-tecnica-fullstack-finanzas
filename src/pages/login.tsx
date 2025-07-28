"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { authClient } from "@/lib/auth/client";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const handleGithubLogin = async () => {
    setLoading(true);
    try {
      const res = await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });
      console.log(res);
      // Ahora deberías ver el role en la respuesta
    } catch (error) {
      console.error("Error al iniciar sesión con GitHub:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold'>
            Sistema de Gestión
          </CardTitle>
          <CardDescription>
            Inicia sesión para acceder al sistema de ingresos y egresos
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Button
            onClick={handleGithubLogin}
            disabled={loading}
            className='w-full bg-transparent'
            variant='outline'
          >
            <Github className='mr-2 h-4 w-4' />
            {loading ? "Iniciando sesión..." : "Continuar con GitHub"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
export default Login;