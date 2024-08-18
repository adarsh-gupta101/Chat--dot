import type { Metadata ,Viewport} from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Web Dev Starter Pack",
  description: "The Ultimate Web Developer Wholesome Package ",

};




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.className}>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={true}
            disableTransitionOnChange
            

          >
            {children}
          </ThemeProvider>{" "}
        </body>
      </html>
    </ClerkProvider>
  );
}
