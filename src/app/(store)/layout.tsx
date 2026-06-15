import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      <Footer />
    </>
  );
}
