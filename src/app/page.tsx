import { Button } from "@/components/ui/button";
import RightArrow from "./icons/RightArrow";

export default function Home() {
  return (
    <div className="w-screen h-auto bg-white flex  justify-center ">
      <div className="w-100% h-auto bg-white lg:w-90% lg:px-[40px] xl:max-w-[1280px]">
        <div className="ImageContainer w-100% h-[246px] flex justify-center items-center bg-green">
          here goes image
        </div>
        <div className="AboutMovie w-100% h-auto px-[20px] py-[20px] flex flex-col gap-[16px] justify-content">
          <div className="w-100% h-[52px]">
            <div className="flex flex-col w-[252px] h-[52px]">
              <div className="w-100% h-[20px]">
                <p className="text-[14px] font-normal text-[#09090B]">
                  Now playing:
                </p>
              </div>
              <div className="w-100% h-[32px]">
                <p className="text-[24px] font-semibold text-[#09090B]">Name</p>
              </div>
            </div>
            <div className="flex flex-row"></div>
          </div>
          <div className="w-100% h-auto">
            Elp, a misunderstood young woman because of her green skin, and
            Gal, a popular girl, become friends at NewYork University in the
            Land of Oz. After an encounter with the Wonderful Wizard of Oz,
            their friendship reaches a crossroads.
          </div>
          <div className="w-100% h-[40px]">
            <Button variant="outline">Play Trailer</Button>
          </div>
        </div>
        <div className="MovieList w-100% h-auto px-[20px] flex flex-col mt-[32px]">
          <div className="w-100% h-[36px] flex flex-row justify-between">
            <div className="w-[114px] h-100% flex justify-center items-center">
              <p className="text-[24px] font-semibold text-[#09090B]">
                Upcoming
              </p>
            </div>
            <div className="w-[120px] h-100% flex flex-row justify-center items-center gap-[8px]">
              <p className="text-[14px] font-medium text-[#09090B]">See more</p>
              <RightArrow />
            </div>
          </div>
          <div className="MovieImgs w-100%"></div>
        </div>
        <div className="MovieList w-100% h-auto px-[20px] flex flex-col mt-[32px]">
          <div className="w-100% h-[36px] flex flex-row justify-between">
            <div className="w-auto h-100% flex justify-center items-center">
              <p className="text-[24px] font-semibold text-[#09090B]">
                Top Rated
              </p>
            </div>
            <div className="w-[120px] h-100% flex flex-row justify-center items-center gap-[8px]">
              <p className="text-[14px] font-medium text-[#09090B]">See more</p>
              <RightArrow />
            </div>
          </div>
          <div className="MovieImgs w-100%"></div>
        </div>
        <div className="MovieList w-100% h-auto px-[20px] flex flex-col mt-[32px]">
          <div className="w-100% h-[36px] flex flex-row justify-between">
            <div className="w-auto h-100% flex justify-center items-center">
              <p className="text-[24px] font-semibold text-[#09090B]">
                Popular
              </p>
            </div>
            <div className="w-[120px] h-100% flex flex-row justify-center items-center gap-[8px]">
              <p className="text-[14px] font-medium text-[#09090B]">See more</p>
              <RightArrow />
            </div>
          </div>
          <div className="MovieImgs w-100%"></div>
        </div>
        
      </div>
    </div>
  );
}
