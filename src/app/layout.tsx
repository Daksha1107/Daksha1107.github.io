import type { Metadata } from "next";
import "./globals.css";
import { ApolloWrapper } from "@/components/providers/apollo-wrapper";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Chatbot Assessment | AI-Powered Conversations",
  description: "Advanced chatbot assessment platform with real-time AI conversations and premium user experience.",
  keywords: ["chatbot", "AI", "assessment", "conversation", "real-time"],
  authors: [{ name: "Daksha1107" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        <ApolloWrapper>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
