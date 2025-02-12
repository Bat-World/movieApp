"use client";

import PhoneIcon from "@/app/icons/phoneIcon";
import { InstagramIcon } from "lucide-react";
import MailIcon from "@/app/icons/mailIcon";
import { FacebookIcon } from "lucide-react";
import { Popcorn } from "lucide-react";
import Link from "next/link";


export const Footer = () => {
  return (
    <div className="w-screen h-auto  flex justify-center bg-[#4338CA] mt-[50px]">
      <div className="w-full h-[308px] bg-[#4338CA] px-[20px] py-[40px] flex flex-col items-center sm:flex-row sm:justify-between lg:w-90% lg:px-[40px] sm:items-start xl:max-w-[1280px] lg:h-[216px] ">
        <div className="flex flex-col w-auto h-[52px] gap-[12px]">
          <div className="flex flex-row items-center w-auto h-[20px] gap-[8px]">
            <Popcorn />
            <p className="text-16px font-bold text-[#FAFAFA]">Movie Z</p>
          </div>
          <div className="w-auto h-[20px] flex items-center mt-[10px]">
            <p className="text-[14px] font-normal text-[#FAFAFA] ">
              © 2024 Movie Z. All Rights Reserved.
            </p>
          </div>
        </div>
        <div className="flex flex-row w-auto h-[148px] mt-[28px] gap-[48px] lg:mt-0">
          <div className="w-auto h-[136px] flex flex-col">
            <div>
              <p className="text-[14px] font-normal text-[#FAFAFA]">
                Contact Information
              </p>
            </div>
            <div className="flex flex-row w-full h-auto items-center gap-[12px] mt-[12px]">
              <Link href="/https://mail.google.com/mail/u/0/#inbox?compose=new">
                {" "}
                <MailIcon />
              </Link>
              <div className="flex flex-col">
                <p className="text-[14px] font-semibold text-[#FAFAFA]">
                  Email:
                </p>
                <p className="text-[14px] font-normal text-[#FAFAFA]">
                  drewuncle863724lu@gmail.com
                </p>
              </div>
            </div>
            <div className="flex flex-row w-full h-auto items-center gap-[12px] mt-[12px]">
              <PhoneIcon />
              <div className="flex flex-col">
                <p className="text-[14px] font-semibold text-[#FAFAFA]">
                  Phone:
                </p>
                <p className="text-[14px] font-normal text-[#FAFAFA]">
                  (+976) 9693 - 7799
                </p>
              </div>
            </div>
          </div>
          <div className="w-auto h-auto flex flex-col">
            <p className="text-[14px] font-normal text-[#FAFAFA]">Follow me:</p>
            <div className="flex flex-col gap-[12px] mt-[12px] lg:flex-row">
              <p className="text-[14px] font-semibold text-[#FAFAFA]">
                <Link
                  href="https://www.facebook.com/baterdene.davaadorj.773 "
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  <FacebookIcon className="font-normal hover:font-semi-bold cursor:pointer" />
                </Link>
              </p>
              <p className="text-[14px] font-semibold text-[#FAFAFA]">
                <Link
                  href="https://www.instagram.com/baterdenede/ "
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  <InstagramIcon />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
