import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";

import { cn } from "@/lib/utils";

import { Footer } from "@/components/base/footer";
import { Header } from "@/components/base/header";
import { AuthProvider } from "@/providers/auth-provider";
import { FirebaseSubscriber } from "@/providers/firebase-subscriber";
import { ModalProvider } from "@/providers/modal-provider";
import { SheetProvider } from "@/providers/sheet-provider";
import { ThemeProvider } from "@/providers/theme-provider";

import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Step Bunmer",
  description:
    "Step Bunmer is a psychological game where you try to find the location of your opponent's bomb while trying to make them step on your bomb. The game is played on a grid, and players take turns placing bombs on the grid. The goal is to be the first player to get rid of all of your bombs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      suppressHydrationWarning
      className="scroll-pt-(--header-height) scroll-smooth"
    >
      <body className={cn(notoSansJP.className, "antialiased")}>
        <AuthProvider>
          <FirebaseSubscriber />
          <ThemeProvider>
            <SheetProvider />
            <ModalProvider />
            <div className="min-h-screen">
              <Header />
              <main>{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
