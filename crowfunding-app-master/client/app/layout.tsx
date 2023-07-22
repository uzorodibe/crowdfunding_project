import "./globals.css";
import { Ysabeau, DM_Mono } from "next/font/google";
import localFont from "next/font/local";
// import source_C
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DashboardLayout from "./dashboard/layout";
import { UserProvider } from "@auth0/nextjs-auth0/client";

// FONT DECLARATION
const myFont = localFont({
  src: "../public/fonts/Chromatic/Grad.ttf",
});

const dm_Mono = DM_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  display: "swap",
});

// default metadata
export const metadata = {
  title: "Web3 Crowdfunding",
  description: "Crowdfunding Project app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en">
        <body className={dm_Mono.className}>
          <UserProvider>
            <DashboardLayout>{children}</DashboardLayout>{" "}
          </UserProvider>
        </body>
      </html>
    </>
  );
}
