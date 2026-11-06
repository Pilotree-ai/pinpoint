import type { Metadata } from "next";
import "./globals.css";

import { InspectorProvider } from "@/components/Inspector/InspectorProvider";
import InspectorLayoutWrapper from "@/components/Inspector/InspectorLayoutWrapper";

export const metadata: Metadata = {
  title: "Pinpoint",
  description: "Bug reports pinned to the exact element.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased" suppressHydrationWarning>
        <InspectorProvider>
          <InspectorLayoutWrapper>{children}</InspectorLayoutWrapper>
        </InspectorProvider>
      </body>
    </html>
  );
}
