import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "WebCrawler Pro | Professional Web Scraping Tool",
  description: "Advanced web crawling with real-time monitoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans antialiased bg-white text-slate-900">
        {children}
        <Toaster
          position="top-right"
          expand={false}
          visibleToasts={3}
          // closeButton removed
          theme="light"
          toastOptions={{
            classNames: {
              // The Glass Effect:
              // bg-white/70 provides transparency
              // backdrop-blur-md creates the frosted glass look
              // border-white/20 adds a subtle edge highlight
              toast:
                "font-poppins rounded-2xl border border-white/20 bg-white/70 backdrop-blur-md p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.08)]",
              title: "text-slate-900 font-bold tracking-tight",
              description: "text-slate-500 text-xs",
            },
          }}
        />
      </body>
    </html>
  );
}
