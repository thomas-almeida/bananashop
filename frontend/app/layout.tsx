import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import { Provider } from "./Provider";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "BananaShop - Venda no pix no instagram",
  description: "O Bananashop é uma plataforma onde você pode criar um linktree dos seus produtos, permitindo vendas diretas via PIX, sem ficar combinando valores na sua DM e perdendo vendas.",
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    'google-site-verification': 'W7dmGvXzWzFNhTpra6A6bu3AuTHIyzBLRfiskuH0__I'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
