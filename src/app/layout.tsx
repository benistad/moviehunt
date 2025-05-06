import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MovieHunt - Mes films notés",
  description: "Une collection personnelle de films notés avec des critiques et des recommandations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-gray-900 text-white">
        {children}
      </body>
    </html>
  );
}
