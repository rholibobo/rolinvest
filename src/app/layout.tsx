import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Montserrat } from "next/font/google";
import "./globals.css"
import { AuthProvider } from "../context/auth-context"
import ThemeRegistry from "../components/theme-registry"
import Script from "next/script";


const montserrat = Montserrat({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "BI Tool",
  description: "A Business Intelligent tool to keep up to date with trends of the business",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            id="msw-setup"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                if (typeof window !== 'undefined') {
                  window.MSW_READY = false;
                  window.addEventListener('MSW_READY', () => {
                    window.MSW_READY = true;
                  });
                }
              `,
            }}
          />
        )}
      </head>
      <body className={montserrat.className}>
        <ThemeRegistry>
          <AuthProvider>{children}</AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  )
}





