import { MoonIcon,  SearchIcon } from "lucide-react";
import NavBarIcon from "./icons/headerIcon";

export const Header = () => {
    return (
      <div className="w-screen h-[59px] bg-black flex  justify-center ">
        <div className="header flex justify-center items-center h-[59px] w-[375px] bg-[#FFFFFF] px-[20px] justify-between">
          <div className="flex flex-row items-center w-[92px] h-[20px] gap-[8px]">
            <NavBarIcon />
            <p className="text-16px font-bold text-[#4338CA]">Movie Z</p>
          </div>
          <div className="flex flex-row items-center w-[84px] h-[36px] justify-between">
            <button className="flex justify-center items-center w-[36px] h-[36px] rounded-md border-[#E4E4E7] border-solid border">
              <SearchIcon />
            </button>
            <button className="flex justify-center items-center w-[36px] h-[36px] rounded-md border-[#E4E4E7] border-solid border">
              <MoonIcon />
            </button>
          </div>
        </div>
      </div>
    );
  };