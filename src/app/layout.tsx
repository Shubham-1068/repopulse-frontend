import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppHeader } from "@/components/app-header";

export const metadata: Metadata = {
  title: "RepoPulse",
  description: "Repo analytics with guided login and analysis flow.",
  icons: {
    icon: "/Logo.png",
    shortcut: "/Logo.png",
    apple: "/Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-black text-neutral-100">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AppHeader />
          <main className="relative z-10 mx-auto w-full max-w-6xl px-4 py-10" style={{ minHeight: "calc(100vh - var(--nav-height))" }}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
