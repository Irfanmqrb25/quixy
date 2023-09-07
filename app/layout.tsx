import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import PostUploadModal from "@/components/modal/PostUploadModal";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import "swiper/css";
import AuthContext from "@/context/AuthContext";
import OnlineStatus from "@/components/OnlineStatus";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://quixy-app.vercel.app/"),
  title: "Quixy",
  description:
    "Social media application powered by Next.js 13, Tailwind, Prisma, MongoDB, Pusher and more.",
  icons: "/assets/logo.svg",
  keywords: [
    "Social media",
    "Next.js",
    "React",
    "Tailwind",
    "Prisma",
    "MongoDB",
    "TypeScript",
    "Software",
    "Web Application",
    "Chat application",
    "PusherJS",
    "NextAuth",
    "Realtime application",
  ],
  authors: [
    {
      name: "Irfan Muqorib",
      url: "https://github.com/Irfanmqrb25",
    },
  ],
  creator: "Irfan Muqorib",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://expozone.vercel.app",
    title: "Quixy",
    description:
      "Social media application powered by Next.js 13, Tailwind, Prisma, MongoDB, Pusher and more.",
    siteName: "Quixy",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <AuthContext>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
          <Toaster />
          <PostUploadModal />
          <OnlineStatus />
        </AuthContext>
      </body>
    </html>
  );
}
