import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "PixelCodes | Licencias Oficiales de Software & Keys",
  description: "La tienda premium de activación de licencias digitales de software, antivirus y sistemas operativos más barata y segura.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#04060d] text-gray-100 selection:bg-[#007cff] selection:text-white">
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
