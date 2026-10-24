import type { Metadata } from "next";
import "./globals.css";
import UserBadge from "./UserBadge";

export const metadata: Metadata = {
  title: "Macedonian Alphabet",
  description: "Learn the Macedonian alphabet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UserBadge />
        {children}
      </body>
    </html>
  );
}
