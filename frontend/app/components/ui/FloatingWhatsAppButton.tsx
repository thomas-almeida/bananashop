'use client';

import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

export function FloatingWhatsAppButton() {
    // Número de telefone no formato internacional (ex: 5511999999999)
    const phoneNumber = '5511949098312'; // Substitua pelo número desejado
    const message = 'Olá, gostaria de mais informações sobre o Bananashop!';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Link
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg transition-all duration-300 transform hover:scale-110"
                aria-label="Fale conosco pelo WhatsApp"
            >
                <MessageCircle className="w-7 h-7" />
            </Link>
        </div>
    );
}
