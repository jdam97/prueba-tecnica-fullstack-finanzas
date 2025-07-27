"use client"

import {DollarSign,Download,TrendingDown,TrendingUp,Users,} from "lucide-react"
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth/client"
import { useEffect, useState } from "react"
import router from "next/router"

export default function Reports() {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    incomeCount: 0,
    expenseCount: 0,
    totalTransactions: 0,
    totalUsers: 0,
  })

  const { data: session, isPending } = useSession()
  const user = session?.user

  const getSummaryData = async () => {
    try {
      const endpoint =
        user?.role === "ADMIN"
          ? "/api/dashboard/summary"
          : `/api/dashboard/summary?id=${user?.id}`

      const res = await fetch(endpoint, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })

      const data = await res.json()
      setSummary(data)
    } catch (error) {
      console.error("Error fetching summary:", error)
    }
  }

  useEffect(() => {
    if (!isPending && user) {
      getSummaryData()
    }
  }, [isPending, user])

  const {
    totalIncome,
    totalExpense,
    balance,
    incomeCount,
    expenseCount,
    totalTransactions,
    totalUsers,
  } = summary

  const incomePercentage =
    totalIncome + totalExpense > 0
      ? (totalIncome / (totalIncome + totalExpense)) * 100
      : 0
  const expensePercentage = 100 - incomePercentage

  const downloadCSV = () => {
    const csvContent = [
      "Total Income,Total Expense,Balance,Income Count,Expense Count,Total Transactions",
      `${totalIncome},${totalExpense},${balance},${incomeCount},${expenseCount},${totalTransactions}`,
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "resumen_financiero.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    if (!isPending && user?.role !== "ADMIN") {
      router.push("/unauthorized")
    }
  }, [isPending, user, router])

  if (user?.role !== "ADMIN") return null

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
          <p className="text-gray-600">Análisis financiero del sistema</p>
        </div>
        <Button onClick={downloadCSV}>
          <Download className="mr-2 h-4 w-4" />
          Descargar CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalIncome.toLocaleString("es-CO")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Egresos Totales</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${totalExpense.toLocaleString("es-CO")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saldo Actual</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                balance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${balance.toLocaleString("es-CO")}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gráfico de Ingresos vs Egresos</CardTitle>
            <CardDescription>Distribución porcentual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Ingresos</span>
              <span>{incomePercentage.toFixed(1)}%</span>
            </div>
            <div className="h-3 w-full bg-gray-200 rounded-full">
              <div
                className="h-3 bg-green-500 rounded-full transition-all"
                style={{ width: `${incomePercentage}%` }}
              />
            </div>

            <div className="flex justify-between">
              <span>Egresos</span>
              <span>{expensePercentage.toFixed(1)}%</span>
            </div>
            <div className="h-3 w-full bg-gray-200 rounded-full">
              <div
                className="h-3 bg-red-500 rounded-full transition-all"
                style={{ width: `${expensePercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen de Movimientos</CardTitle>
            <CardDescription>Detalle total de transacciones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Total de movimientos:</span>
              <span className="font-bold">{totalTransactions}</span>
            </div>
            <div className="flex justify-between">
              <span>Movimientos de ingreso:</span>
              <span className="font-bold text-green-600">{incomeCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Movimientos de egreso:</span>
              <span className="font-bold text-red-600">{expenseCount}</span>
            </div>
            <div className="border-t pt-4 flex justify-between">
              <span className="font-medium">Balance final:</span>
              <span
                className={`font-bold ${
                  balance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ${balance.toLocaleString("es-CO")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
