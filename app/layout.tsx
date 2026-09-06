import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";

export const metadata: Metadata = {
  title: {
    default: "TravelTrucks — Campers of your dreams",
    template: "%s | TravelTrucks",
  },
  description:
    "Find, explore, and book a camper for your next adventure with TravelTrucks.",
  openGraph: {
    title: "TravelTrucks — Campers of your dreams",
    description: "Find, explore, and book a camper for your next adventure.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
