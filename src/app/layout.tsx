import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../index.css";
import { Toaster } from "@/components/ui/toaster";

import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Tooth World Dental Clinic",
    description: "Modern dental care for your perfect smile",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>}>
                    {children}
                </Suspense>
                <Toaster />
            </body>
        </html>
    );
}
