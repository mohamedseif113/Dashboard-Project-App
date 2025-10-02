import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { InstallPrompt } from "@/components/install-prompt";
import { OfflineIndicator } from "@/components/offline-indicator";
import { PWALifecycle } from "@/components/pwa-lifecycle";
import "./globals.css";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Project Dashboard - Manage Your Projects",
  description:
    "A feature-rich project management dashboard with real-time updates and analytics",
  generator: "MohamedSeif-Dashboard-project.app",
  manifest: "/manifest.json",
  keywords: [
    "project management",
    "dashboard",
    "tasks",
    "analytics",
    "collaboration",
  ],
  authors: [{ name: "Project Dashboard Team" }],
  icons: {
    icon: "/icon-192.jpg",
    apple: "/icon-192.jpg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Project Dashboard",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Project Dashboard",
    title: "Project Dashboard - Manage Your Projects",
    description:
      "A feature-rich project management dashboard with real-time updates and analytics",
  },
  twitter: {
    card: "summary",
    title: "Project Dashboard - Manage Your Projects",
    description:
      "A feature-rich project management dashboard with real-time updates and analytics",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          {children}
          <InstallPrompt />
          <OfflineIndicator />
          <PWALifecycle />
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
