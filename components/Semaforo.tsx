'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Transaction {
    monto: number
}

interface FinancialConfig {
    ingreso_mensual: number
    gastos_fijos: number
    gastos_operativos: number
}

interface SemaforoProps {
    config: FinancialConfig | null
    todayTransactions: Transaction[] | null
}

export function Semaforo({ config, todayTransactions }: SemaforoProps) {
    if (!config) {
        return <div className="p-4 text-center">Cargando configuración...</div>
    }

    // Calculate Daily Capacity
    // Formula: (ingreso_mensual - gastos_fijos - gastos_operativos) / 30
    const dailyCapacity = (
        (config.ingreso_mensual - config.gastos_fijos - config.gastos_operativos) / 30
    )

    // Calculate Spent Today
    const spentToday = todayTransactions?.reduce((acc, curr) => acc + curr.monto, 0) || 0

    // Calculate Remaining for Today
    // "Si gasto menos de eso, el saldo se acumula para mañana" -> implying we need to execute that logic.
    // For V1, we show what is available TODAY based on the daily capacity vs spent today.
    // The accumulation logic requires historical data which we assume is handled by the "saldo_actual_banco" 
    // or a more complex query. Copilot interpretation: Start with simple daily view.
    const remaining = dailyCapacity - spentToday

    // Determine Semantic Color
    // Green: > 50% remaining
    // Yellow: 20% - 50% remaining
    // Red: < 20% remaining (or negative)
    let statusColor = "bg-green-500"
    let statusText = "Excelente"
    const percentage = (remaining / dailyCapacity) * 100

    if (percentage < 20) {
        statusColor = "bg-red-500"
        statusText = "Crítico"
    } else if (percentage < 50) {
        statusColor = "bg-yellow-500"
        statusText = "Precaución"
    }

    return (
        <div className="flex flex-col items-center justify-center p-6 space-y-6">
            <div className={cn("relative w-48 h-48 rounded-full flex items-center justify-center border-8 border-gray-200 shadow-xl", statusColor)}>
                <div className="absolute inset-2 rounded-full bg-white dark:bg-gray-900 flex flex-col items-center justify-center text-center p-2">
                    <span className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Hoy puedes gastar</span>
                    <span className={cn("text-4xl font-bold mt-1", percentage < 20 ? "text-red-500" : "text-gray-900 dark:text-gray-100")}>
                        ${remaining.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-400 mt-2">Capacidad: ${dailyCapacity.toFixed(2)}</span>
                </div>
            </div>

            <div className="text-center">
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Estado: <span className="font-bold">{statusText}</span></p>
                <p className="text-sm text-gray-500">Gastado hoy: ${spentToday.toFixed(2)}</p>
            </div>
        </div>
    )
}
