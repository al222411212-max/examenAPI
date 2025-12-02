import type { Metadata } from "next";
import EmpresaForm from "@/components/EmpresaForm";
import VacanteForm from "@/components/VacanteForm";
import PostulacionForm from "@/components/PostulacionForm";
import "./globals.css";

export const metadata: Metadata = {
  title: "Job Portal",
  description: "Portal de empleos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
