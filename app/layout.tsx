import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Snoonu Creators | Connect with Qatar's Top Restaurants",
  description: "Join the Snoonu Creator Program. Create amazing content for Qatar's best restaurants and get paid for your creativity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased min-h-screen flex flex-col`}>
        <AppProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
