import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Ecomm POC",
  description: "Ecomm POC project using Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
