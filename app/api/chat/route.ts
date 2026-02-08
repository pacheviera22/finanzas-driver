import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { supabase } from '@/lib/supabase';
import { calculateFinancialStatus } from '@/lib/finance';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    // 1. Fetch Context
    const { data: config } = await supabase.from('configuracion_financiera').select('*').single();

    let contextText = "No financial data available.";

    if (config) {
        const today = new Date().toISOString().split('T')[0];
        const { data: transactions } = await supabase
            .from('transacciones')
            .select('monto')
            .eq('fecha', today);

        const stats = calculateFinancialStatus(config, transactions || []);

        contextText = `
      Financial Context:
      - Monthly Income: $${config.ingreso_mensual}
      - Fixed Expenses: $${config.gastos_fijos}
      - Operating Expenses: $${config.gastos_operativos}
      - Bank Balance: $${config.saldo_actual_banco}
      - Daily Capacity (Safe to spend daily): $${stats.dailyCapacity.toFixed(2)}
      - Spent Today: $${stats.spentToday.toFixed(2)}
      - Remaining for Today: $${stats.remainingToday.toFixed(2)}
      - Status: ${stats.status}
    `;
    }

    const systemCallback = `You are a financial assistant for an Uber driver.
  Your goal is to help the user make financial decisions based on their current "Financial Traffic Light" (Semáforo Financiero).
  
  ${contextText}
  
  If the user asks if they can buy something:
  1. Check the item price against 'Remaining for Today' or 'Bank Balance' depending on context.
  2. If price < Remaining for Today, say YES, it fits in your daily budget.
  3. If price > Remaining for Today but < Bank Balance, warn them: "You have the money, but it exceeds your daily safe limit. This will impact future days."
  4. If price > Bank Balance, say NO.
  
  Keep answers short, encouraging, and financially responsible.
  `;

    // 2. Call Gemini
    try {
        const result = await streamText({
            model: google('models/gemini-1.5-flash'),
            system: systemCallback,
            messages,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error("AI Error:", error);
        return new Response("Error communicating with AI service. Please check API Key.", { status: 500 });
    }
}
