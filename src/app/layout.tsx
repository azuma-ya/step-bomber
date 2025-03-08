import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";

import { cn } from "@/lib/utils";

import { Footer } from "@/components/base/footer";
import { Header } from "@/components/base/header";
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
  title: "Step Bomber",
  description: "心理ボードゲーム。爆弾を設置して相手に踏ませよ！",
  openGraph: {
    title: "Step Bomber",
    description: "心理ボードゲーム。爆弾を設置して相手に踏ませよ！",
  },
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
      </body>
    </html>
  );
}
