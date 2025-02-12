"use client";

import { House } from "lucide-react";
import { Popcorn } from "lucide-react";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";


export const Header = () => {
  const { push } = useRouter();

  return (
    <div className="fixed top-0 left-0 w-screen h-[59px] flex justify-center bg-transparent z-[1000]">
      <div className="header flex justify-center items-center h-[59px] w-full px-[20px] justify-between lg:w-90% lg:px-[40px] xl:max-w-[1280px]">
        <div className="flex flex-row items-center h-[20px] gap-[8px]">
          <House
            className="cursor-pointer hover:text-[#4338CA]"
            onClick={() => push(`/`)}
          />
        </div>
        <div className=" lg:flex w-auto h-[36px] flex-row items-center gap-[8px]">
          <Popcorn className="w-[50px] h-[50px] text-[#4338CA] font-bold" />
        </div>

        <SearchIcon
          className="cursor-pointer hover:text-[#4338CA]"
          onClick={() => push(`/genres`)}
        />
      </div>
    </div>
  );
};
