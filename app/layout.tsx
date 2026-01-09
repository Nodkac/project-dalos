import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project Dalos",
  description: "Daily resolution check-in",
  manifest: "/manifest.json",
  themeColor: "#000000", // correct for dark PWA
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark"> {/* locks dark mode */}
      <body
  className={`${geistSans.variable} ${geistMono.variable} antialiased`}
>
  {children}

  <script
    dangerouslySetInnerHTML={{
      __html: `
        if ('serviceWorker' in navigator) {
          window.addEventListener('load', () => {
            navigator.serviceWorker
              .register('/sw.js')
              .then(() => console.log('Service Worker registered'))
              .catch(err => console.error('Service Worker registration failed', err));
          });
        }
      `,
    }}
  />
</body>
    </html>
  );
}
