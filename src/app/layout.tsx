import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FamilyOS — Family Management",
  description: "Your family's intelligent operating system. Manage expenses, events, EMIs, and health — all in one place.",
};

import { NotificationProvider } from "@/components/ui/notification-manager";
import { NotificationChecker } from "@/components/ui/notification-checker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${quicksand.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        <NotificationProvider>
          <NotificationChecker />
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}

