import React from "react";
import { Button } from "./ui/button";
// import { Carousel } from "./ui/carousel";

export const ImageShiftPart = () => {
  return (
    <div className="w-screen h-auto  flex  justify-center ">
      <div className="w-100% h-auto  lg:w-90% lg:px-[40px] xl:max-w-[1280px]">
        <div className="ImageContainer w-100% h-[246px] flex justify-center items-center">
          here goes image
        </div>
        <div className="AboutMovie w-100% h-auto px-[20px] py-[20px] flex flex-col gap-[16px] justify-content">
          <div className="w-100% h-[52px]">
            <div className="flex flex-col w-[252px] h-[52px]">
              <div className="w-100% h-[20px]">
                <p className="text-[14px] font-normal ">
                  Now playing:
                </p>
              </div>
              <div className="w-100% h-[32px]">
                <p className="text-[24px] font-semibold ]">Name</p>
              </div>
            </div>
            <div className="flex flex-row"></div>
          </div>
          <div className="w-100% h-auto">
            Elp, a misunderstood young woman because of her green skin, and Gal,
            a popular girl, become friends at NewYork University in the Land of
            Oz. After an encounter with the Wonderful Wizard of Oz, their
            friendship reaches a crossroads.
          </div>
          <div className="w-100% h-[40px]">
            <Button variant="outline">Play Trailer</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
