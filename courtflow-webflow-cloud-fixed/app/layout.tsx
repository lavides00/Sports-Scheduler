import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CourtFlow — Sports Court Scheduler",
  description: "A modern sports court availability and booking scheduler."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
