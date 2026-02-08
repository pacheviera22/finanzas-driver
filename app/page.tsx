import { Semaforo } from '@/components/Semaforo'
import { Chat } from '@/components/Chat'
import { supabase } from '@/lib/supabase'

export const revalidate = 0; // Disable static caching for this page

export default async function Home() {
    // Fetch Configuration
    const { data: config, error: configError } = await supabase
        .from('configuracion_financiera')
        .select('*')
        .single()

    // Fetch Today's Transactions
    const today = new Date().toISOString().split('T')[0]
    const { data: transactions, error: txError } = await supabase
        .from('transacciones')
        .select('monto')
        .eq('fecha', today)

    if (configError) {
        console.error("Error fetching config:", configError);
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8 font-sans">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    Finanzas Driver
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Control inteligente para tu día a día
                </p>
            </header>

            <main className="max-w-4xl mx-auto space-y-8">
                {/* Semáforo Section */}
                <section>
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <h2 className="text-xl font-semibold p-6 pb-0 border-b border-gray-100 dark:border-gray-800">
                            Semáforo Financiero
                        </h2>
                        <Semaforo config={config} todayTransactions={transactions || []} />
                    </div>
                </section>

                {/* Chat Section */}
                <section>
                    <Chat />
                </section>
            </main>
        </div>
    )
}
