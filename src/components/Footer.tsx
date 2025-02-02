"use client";

import FooterIcon from "@/app/icons/FooterIcon";
import MailIcon from "@/app/icons/mailIcon";
import PhoneIcon from "@/app/icons/phoneIcon";

export const Footer = () => {
  return (
    <div className="w-screen h-auto  flex justify-center bg-[#4338CA]">
      <div className="w-full h-[308px] bg-[#4338CA] px-[20px] py-[40px] flex flex-col items-center sm:flex-row sm:justify-between lg:w-90% lg:px-[40px] sm:items-start xl:max-w-[1280px]">
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
        <div className="flex flex-row w-auto h-[148px] mt-[28px] gap-[48px]">
          <div className="w-[174px] h-[136px] flex flex-col">
            <div>
              <p className="text-[14px] font-normal text-[#FAFAFA]">
                Contact Information
              </p>
            </div>
            <div className="flex flex-row w-full h-auto items-center gap-[12px] mt-[12px]">
              <MailIcon />
              <div className="flex flex-col">
                <p className="text-[14px] font-semibold text-[#FAFAFA]">
                  Email:
                </p>
                <p className="text-[14px] font-normal text-[#FAFAFA]">
                  drew@gmail.com
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
                  (+976) 969377799
                </p>
              </div>
            </div>
          </div>
          <div className="w-auto h-auto flex flex-col">
            <p className="text-[14px] font-normal text-[#FAFAFA]">Follow us</p>
            <div className="flex flex-col gap-[12px] mt-[12px] lg:flex-row">
              <p className="text-[14px] font-semibold text-[#FAFAFA]">
                Facebook
              </p>
              <p className="text-[14px] font-semibold text-[#FAFAFA]">
                Instagram
              </p>
              <p className="text-[14px] font-semibold text-[#FAFAFA]">
                YouTube
              </p>
              <p className="text-[14px] font-semibold text-[#FAFAFA]">
                Twitter
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
