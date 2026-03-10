import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Team Board",
  description: "A simple team workflow board",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-board-bg text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
