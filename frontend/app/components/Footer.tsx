'use client';

import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-12">
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-sm text-gray-500">
                            &copy; {currentYear} BananaShop. Todos os direitos reservados.
                        </p>
                    </div>
                    <div className="flex space-x-6">
                        <Link href="/termos" className="text-sm text-gray-500 hover:text-gray-700">
                            Termos de Uso
                        </Link>
                        <Link href="/privacidade" className="text-sm text-gray-500 hover:text-gray-700">
                            Política de Privacidade
                        </Link>
                        <Link href="/contato" className="text-sm text-gray-500 hover:text-gray-700">
                            Contato
                        </Link>
                    </div>
                </div>
                <div className="mt-4 text-center md:text-left">
                    <p className="text-xs text-gray-400">
                        BananaShop - Plataforma de vendas online segura e confiável.
                    </p>
                </div>
            </div>
        </footer>
    );
}
