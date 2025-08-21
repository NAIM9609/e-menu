import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { PrimeReactProvider, FilterMatchMode } from 'primereact/api';
import "primereact/resources/themes/arya-orange/theme.css";
import "primeicons/primeicons.css";
import { CartProvider } from "@/context/CartContext";
import { MenuProvider } from "@/store/menuStore";
import { IngredientsProvider } from "@/store/ingredientsStore";
import { BadgesProvider } from "@/store/badgesStore";
import { I18nProvider } from "@/i18n/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "e-menu",
  description: "Digital menu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const value = {
    filterMatchModeOptions: {
      text: [FilterMatchMode.STARTS_WITH, FilterMatchMode.CONTAINS, FilterMatchMode.NOT_CONTAINS, FilterMatchMode.ENDS_WITH, FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS],
      numeric: [FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS, FilterMatchMode.LESS_THAN, FilterMatchMode.LESS_THAN_OR_EQUAL_TO, FilterMatchMode.GREATER_THAN, FilterMatchMode.GREATER_THAN_OR_EQUAL_TO],
      date: [FilterMatchMode.DATE_IS, FilterMatchMode.DATE_IS_NOT, FilterMatchMode.DATE_BEFORE, FilterMatchMode.DATE_AFTER]
    }
  };

  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PrimeReactProvider value={value}>
          <I18nProvider>
            <IngredientsProvider>
              <BadgesProvider>
                <MenuProvider>
                  <CartProvider>{children}</CartProvider>
                </MenuProvider>
              </BadgesProvider>
            </IngredientsProvider>
          </I18nProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
