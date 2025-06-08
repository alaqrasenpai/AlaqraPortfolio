import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import FireFliesBackground from "@/components/FireFliesBackground";
import Sound from "@/components/Sound";
import Script from "next/script"; // 👈 استيراد سكربت

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: {
    template: "Ahmad Alaqra Portfolio",
    default: "Ahmad Alaqra Portfolio",
  },
  description: "a personal portfolio developed by ahmad alaqra.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* 👇 سكربت Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9VZ7ZL0NBX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9VZ7ZL0NBX');
          `}
        </Script>
      </head>
      <body
        className={clsx(
          inter.variable,
          "bg-background text-foreground font-inter"
        )}
      >
        {children}
        <FireFliesBackground />
        {/* <Sound /> */}
        <div id="my-modal" />
      </body>
    </html>
  );
}
