'use client';

import { useChat } from '@ai-sdk/react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Send } from 'lucide-react';

export function Chat() {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

    return (
        <Card className="w-full h-[500px] flex flex-col">
            <CardHeader>
                <CardTitle className="text-lg">Asistente Financiero (Gemini)</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-10">
                        Pregúntame: "¿Puedo comprar una bicicleta de $200?"
                    </div>
                )}
                {messages.map(m => (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg px-4 py-2 ${m.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                            }`}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 text-sm text-gray-500 italic">
                            Escribiendo...
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="p-4 border-t">
                <form onSubmit={handleSubmit} className="flex w-full space-x-2">
                    <input
                        className="flex-1 px-4 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Escribe tu pregunta..."
                    />
                    <button
                        type="submit"
                        className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        disabled={isLoading}
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </CardFooter>
        </Card>
    );
}
