"use client";

import { useState } from "react";
import { MoonIcon, SearchIcon, SunIcon } from "lucide-react";
import NavBarIcon from "@/app/icons/headerIcon";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

export const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const { setTheme, theme } = useTheme();

  return (
    <div className="fixed top-0 left-0 w-screen h-auto  flex justify-center">
      <div className="header flex justify-center items-center h-[59px] w-full  px-[20px] justify-between lg:w-90% lg:px-[40px] xl:max-w-[1280px]">
        <div className="flex flex-row items-center w-[92px] h-[20px] gap-[8px]">
          <NavBarIcon />
          <p className="text-16px font-bold text-[#4338CA] w-[64px]">Movie Z</p>
        </div>
        <div className="hidden lg:flex w-auto h-[36px] flex-row items-center gap-[8px]">
          <Select>
            <SelectTrigger className="w-[90px] h-[36px] flex-row-reverse focus:outline-none focus:ring-0">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>

          <Input className="w-[379px] h-[36px] focus:outline-none focus:ring-0 focus:shadow-none" placeholder="Search" />
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
          {showSearch && (
            <Input className="w-[379px] h-[36px]" placeholder="Search" />
          )}
          {theme === "dark" ? (
            <Button
              variant="outline"
              className="w-9 h-9"
              onClick={() => setTheme("light")}
            >
              <SunIcon />
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-9 h-9"
              onClick={() => setTheme("dark")}
            >
              <MoonIcon />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
