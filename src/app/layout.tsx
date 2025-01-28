import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FooterIcon from "./icons/FooterIcon";
import { MoonIcon, SearchIcon } from "lucide-react";
import NavBarIcon from "./icons/headerIcon";
import MailIcon from "./icons/mailIcon";
import PhoneIcon from "./icons/phoneIcon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export const Header = () => {
  return (
    <div className="header flex justify-center items-center h-[59px] w-100% bg-[#FFFFFF] px-[20px] justify-between">
      <div className="flex flex-row items-center w-[92px] h-[20px] gap-[8px]">
        <NavBarIcon />
        <p className="text-16px font-bold text-[#4338CA] w-[64px]">Movie Z</p>
      </div>
      <div className="hidden lg:block  h-[36px] flex flex-row items-center gap-[8px]">
        <Button />
        <Input className="hidden sm:block w-[379px] h-[36px]" placeholder="Search" />
      </div>
      <div className="flex flex-row items-center w-[84px] h-[36px] justify-between">
        <button className="flex justify-center items-center w-[36px] h-[36px] rounded-md border-[#E4E4E7] border-solid border lg:hidden">
          <SearchIcon />
        </button>
        <button className="flex justify-center items-center w-[36px] h-[36px] rounded-md border-[#E4E4E7] border-solid border">
          <MoonIcon />
        </button>
      </div>
    </div>
  );
};
export const Footer = () => {
  return (
    <div className="w-100% h-[308px] bg-[#4338CA] px-[20px] py-[40px]">
      <div className="flex flex-col w-[247px] h-[52px] gap-[12px]">
        <div className="flex flex-row items-center w-[92px] h-[20px] gap-[8px]">
          <FooterIcon />
          <p className="text-16px font-bold text-[#FAFAFA]">Movie Z</p>
        </div>
        <div className="w-[247px] h-[20px] flex items-center">
          <p className="text-[14px] font-normal text-[#FAFAFA]">
            © 2024 Movie Z. All Rights Reserved.
          </p>
        </div>
      </div>
      <div className="flex flex-row w-100% h-[148px] mt-[28px] gap-[48px]">
        <div className="w-[174px] h-[136px] flex flex-col ">
          <div className="w-100% h-auto">
            <p className="text-[14px] font-normal text-[#FAFAFA]">
              Contact Information
            </p>
          </div>
          <div className="flex flex-row w-100% h-auto items-center gap-[12px] mt-[12px]">
            <MailIcon />
            <div className="flex flex-col">
              <p className="text-[14px] font-semibold text-[#FAFAFA]">Email:</p>
              <p className="text-[14px] font-normal text-[#FAFAFA]">
                drew@gmail.com
              </p>
            </div>
          </div>

          <div className="flex flex-row w-100% h-auto items-center gap-[12px] mt-[12px]">
            <PhoneIcon />
            <div className="flex flex-col">
              <p className="text-[14px] font-semibold text-[#FAFAFA]">Phone:</p>
              <p className="text-[14px] font-normal text-[#FAFAFA]">
                (+976) 969377799
              </p>
            </div>
          </div>

          <div></div>
        </div>
        <div className="w-[114px] h-[138px] flex flex-col ">
          <div>
            <p className="text-[14px] font-normal text-[#FAFAFA]">Follow us</p>
          </div>
          <div className="flex flex-col gap-[12px] mt-[12px]">
            <p className="text-[14px] font-semibold text-[#FAFAFA]">Facebook</p>
            <p className="text-[14px] font-semibold  text-[#FAFAFA]">
              Instagram
            </p>
            <p className="text-[14px] font-semibold  text-[#FAFAFA]">Youtube</p>
            <p className="text-[14px] font-semibold  text-[#FAFAFA]">Twitter</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
