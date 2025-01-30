
import { Button } from "./ui/button";
import Starx from "@/app/icons/Star";


export const ImageShiftPart = () => {
  return (
    <div className="w-screen h-auto flex flex-col lg:relative">
      <div className="ImageContainer w-full h-[246px] flex justify-center items-center lg:h-[600px]">
      here goes image
      </div>
      <div className="AboutMovie w-full h-auto px-[20px] py-[20px] flex flex-col gap-[16px] justify-content lg:absolute lg:top-[40%] lg:left-[10%] lg:w-[302px] lg:h-[246px] lg:rounded-[8px] lg:bg-transparent">
        <div className="w-full h-auto">
          <div className="flex flex-row w-auto h-auto justify-between lg:flex-col lg:gap-[8px]">
            <div>
              <div className="w-full h-[20px]">
                <p className="text-[14px] font-normal">Now playing:</p>
              </div>
              <div className="w-full h-[32px]">
                <p className="text-[24px] font-semibold">Name</p>
              </div>
            </div>
            <div className="flex flex-row w-auto h-auto items-center gap-[8px]">
              <Starx />
              <p className="text-[16px] font-semibold">6.9</p>
              <p>/10</p>
            </div>
          </div>
          <div className="flex flex-row"></div>
        </div>
        <div className="w-full h-auto">
          Elp, a misunderstood young woman because of her green skin, and Gal,
          a popular girl, become friends at NewYork University in the Land of
          Oz. After an encounter with the Wonderful Wizard of Oz, their
          friendship reaches a crossroads.
        </div>
        <div className="w-full h-[40px]">
          <Button variant="outline">Play Trailer</Button>
        </div>
      </div>
    </div>
  );
};
