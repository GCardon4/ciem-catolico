import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Ciem Santa Hildegarda | Bisutería Católica",
  description:
    "Bisutería y joyería católica elaborada con devoción: medallas, rosarios y cruces inspirados en la tradición monástica de Santa Hildegarda.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-on-surface font-body">
        {children}
      </body>
    </html>
  );
}
