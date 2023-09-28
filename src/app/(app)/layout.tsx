import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { QueryProvider } from "@/shared/providers/query-provider";
import { ToastProvider } from "@/shared/providers/toast-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { ModalProvider } from "@/shared/providers/modal-provider";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Мои дети",
  description: "Детский сад - управление детьми",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="ru">
        <body className={inter.className}>
          <QueryProvider>
            <ToastProvider />
            <ModalProvider />
            {children}
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
