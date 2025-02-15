import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";  // Import Skeleton component

const CastAndCrew = ({ director, writers, topCast, isLoading }) => {
  const [selectedCategory, setSelectedCategory] = useState("actors");

  const categories = [
    { key: "actors", label: "Actors", data: topCast },
    { key: "writers", label: "Writers", data: writers },
    { key: "director", label: "Director", data: director ? [director] : [] },
  ];

  return (
    <div className="w-full h-auto flex-col items-start mt-[30px] md:mt-[50px]">
      <div className="flex flex-row gap-[10px] items-center">
        <div className="w-[10px] h-[30px] rounded-[20px] bg-[#4338CA] flex items-center"></div>
        {categories.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-4 py-2 rounded-md ${
              selectedCategory === key
                ? "bg-transparent text-white font-bold text-[22px] lg:text-[30px] p-0"
                : "bg-transparent text-gray-500 text-[22px] lg:text-[30px] font-normal p-0"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Cast Section */}
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">
          {isLoading
            ? 
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-gray-900 rounded-md p-2"
                >
                  <Skeleton className="w-[50px] h-[50px] rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))
            : 
              categories
                .find((c) => c.key === selectedCategory)
                ?.data?.map((person) => (
                  <div
                    key={person.id || person.name}
                    className="flex items-center gap-3 hover:bg-[var(--detail-bg)] rounded-md p-2"
                  >
                    {person.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500/${person.profile_path}`}
                        alt={person.name}
                        width={75}
                        height={75}
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-[50px] h-[50px] bg-gray-300 rounded-full flex items-center justify-center"></div>
                    )}
                    <p className="text-gray-600 text-sm">{person.name}</p>
                  </div>
                ))}
        </div>
      </div>
    </div>
  );
};

export default CastAndCrew;
