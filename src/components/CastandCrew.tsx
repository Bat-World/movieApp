import Image from "next/image";
import { useState } from "react";
import RightArrow from "@/app/icons/RightArrow";

const CastAndCrew = ({ director, writers, topCast }) => {
  const [selectedCategory, setSelectedCategory] = useState("actors");

  const categories = [
    { key: "actors", label: "Actors", data: topCast },
    { key: "writers", label: "Writers", data: writers },
    { key: "director", label: "Director", data: director ? [director] : [] },
  ];

  return (
    <div className="w-full h-auto flex-col items-start">
      <div className="flex gap-4 mb-4">
        {categories.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-4 py-2 rounded-md ${
              selectedCategory === key
                ? "bg-transparent text-white font-bold"
                : "bg-transparent text-white font-normal"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="w-full">
        <h3 className="font-semibold text-center">
          {categories.find((c) => c.key === selectedCategory)?.label}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-5">
          {categories
            .find((c) => c.key === selectedCategory)
            ?.data?.map((person) => (
              <div
                key={person.id || person.name}
                className="flex items-center gap-3"
              >
                {person.profile_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500/${person.profile_path}`}
                    alt={person.name}
                    width={50}
                    height={50}
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
