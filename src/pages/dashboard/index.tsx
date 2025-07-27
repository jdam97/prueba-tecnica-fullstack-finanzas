import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { useSession, signOut } from "@/lib/auth/client";

 function dashboard() {
  const [dataSumary, setDataSumary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    totalUsers: 0,
  });
  const [recentMovements, setRecentMovements] = useState([]);
  const { data: session, isPending } = useSession();
  const user = session?.user;

  //summary
  const getSummaryData = async (user: any) => {
    try {
      const endpoint = user?.role === "ADMIN"
        ? "/api/dashboard/summary"
        : `/api/dashboard/summary?id=${user?.id}`;
  
      const res = await fetch(endpoint, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
  
      const data = await res.json();
      setDataSumary(data);
    } catch (error) {
      console.error("Error fetching summary data:", error);
    }
  };

  //movimientos recientes
  const getRecentMovements = async (user: any) => {
    try {
      const endpoint = user?.role === "ADMIN"
        ? "/api/dashboard/recent"
        : `/api/dashboard/recent?id=${user?.id}`;
  
      const response = await fetch(endpoint, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
  
      setRecentMovements(data || [])
    } catch (err) {
      console.error("Error fetching recents:", err);
    }
  };

  useEffect(() => {
    if (!isPending && user) {
      getSummaryData(user);
      getRecentMovements(user);
    }
  }, [isPending, user]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bienvenido, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user?.role === "ADMIN" ? "Ingresos Totales" : "Mis Ingresos"}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${dataSumary.totalIncome.toLocaleString("es-CO") }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user?.role === "ADMIN" ? "Egresos Totales" : "Mis Egresos"}
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${dataSumary.totalExpense.toLocaleString("es-CO")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user?.role === "ADMIN" ? "Balance Total" : "Mi Balance"}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                dataSumary.balance  >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${dataSumary.balance.toLocaleString("es-CO") }
            </div>
          </CardContent>
        </Card>

        {user?.role === "ADMIN" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dataSumary.totalUsers}</div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Movimientos Recientes</CardTitle>
            <CardDescription>
              {user?.role === "ADMIN" ? "Últimos movimientos del sistema" : "Tus últimos movimientos"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMovements.map((movement) => (
                <div key={movement?.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{movement.concept}</p>
                    <p className="text-sm text-gray-600">
                      {movement.date} • {movement.userName}
                    </p>
                  </div>
                  <div className={`font-bold ${movement.type === "INCOME" ? "text-green-600" : "text-red-600"}`}>
                    {movement.type === "INCOME" ? "+" : "-"}${movement.amount.toLocaleString("es-CO") }
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen por Tipo</CardTitle>
            <CardDescription>Distribución de ingresos y egresos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Ingresos</span>
                </div>
                <span className="font-bold text-green-600">
                  ${dataSumary.totalIncome.toLocaleString("es-CO") }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Egresos</span>
                </div>
                <span className="font-bold text-red-600">
                  ${dataSumary.totalExpense.toLocaleString("es-CO")  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
export default dashboard;