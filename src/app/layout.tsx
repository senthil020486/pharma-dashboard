import type { Metadata } from "next";
import RootProvider from "@/shared/components/RootProvider";
import "./layout.css";

export const metadata: Metadata = {
  title: "Drug Development Portfolio Dashboard",
  description: "Clinical RCD portfolio management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
