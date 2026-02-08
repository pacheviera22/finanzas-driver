export interface FinancialConfig {
    ingreso_mensual: number
    gastos_fijos: number
    gastos_operativos: number
}

export interface Transaction {
    monto: number
}

export function calculateFinancialStatus(config: FinancialConfig, todayTransactions: Transaction[]) {
    const dailyCapacity = (config.ingreso_mensual - config.gastos_fijos - config.gastos_operativos) / 30
    const spentToday = todayTransactions.reduce((acc, curr) => acc + curr.monto, 0)
    const remainingToday = dailyCapacity - spentToday

    return {
        dailyCapacity,
        spentToday,
        remainingToday,
        status: remainingToday > (dailyCapacity * 0.5) ? 'Excelente' : remainingToday > (dailyCapacity * 0.2) ? 'Precaución' : 'Crítico'
    }
}
