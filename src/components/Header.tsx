"use client";

import { useState } from "react";
import { MoonIcon, SearchIcon } from "lucide-react";
import NavBarIcon from "@/app/icons/headerIcon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="w-screen h-auto bg-white flex justify-center">
      <div className="header flex justify-center items-center h-[59px] w-full bg-[#FFFFFF] px-[20px] justify-between lg:w-90% lg:px-[40px] xl:max-w-[1280px]">
        <div className="flex flex-row items-center w-[92px] h-[20px] gap-[8px]">
          <NavBarIcon />
          <p className="text-16px font-bold text-[#4338CA] w-[64px]">Movie Z</p>
        </div>
        <div className="hidden lg:flex w-auto h-[36px] flex-row items-center gap-[8px]">
          <Button className="h-[36px]" />
          <Input className="w-[379px] h-[36px]" placeholder="Search" />
        </div>
        <div className="flex flex-row items-center w-[84px] h-[36px] justify-between">
          {!showSearch && (
            <button
              className="flex justify-center items-center w-[36px] h-[36px] rounded-md border-[#E4E4E7] border-solid border lg:hidden"
              onClick={() => setShowSearch(true)}
            >
              <SearchIcon />
            </button>
          )}
          {showSearch && <Input className="w-[379px] h-[36px]" placeholder="Search" />}
          <button className="flex justify-center items-center w-[36px] h-[36px] rounded-md border-[#E4E4E7] border-solid border">
            <MoonIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
