"use client";
import { useRouter } from "next/navigation";
const WelcomePage = () => {
const { push } = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center mt-20">
      <div className="flex flex-col  gap-[8px]">
        <h2 className="text-2xl font-semibold mb-4 text-center">Welcome to MovieZ</h2>
        <button className="w-auto h-auto rounded-lg text-white bg-[#4338CA]" onClick={() => push(`/`)}>
          Start the Journey
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
