import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

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
import { AuthProvider } from "@/components/auth/auth-provider";
import { IntroVideo } from "@/components/ui/intro-video";

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!['en', 'ml'].includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${quicksand.variable} h-full`}
      suppressHydrationWarning
    >
    <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <NotificationProvider>
              <IntroVideo />
              <NotificationChecker />
              {children}
            </NotificationProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

