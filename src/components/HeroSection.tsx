import { HiOutlineSearch } from "react-icons/hi";
import HeroImage from "@/assets/HeroImage.svg";

export const HeroSection = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={HeroImage}
          className="w-full h-full object-cover brightness-[0.4]"
          alt="Hero Background"
        />
      </div>

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-[120px] text-center">
        <h1 className="text-4xl lg:text-7xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
          Explore Culinary Experiences
        </h1>
        <p className="text-gray-200 text-lg lg:text-2xl mb-10 max-w-2xl mx-auto drop-shadow-md">
          Search and refine your choice to discover the perfect restaurant.
        </p>

        <div className="relative max-w-2xl mx-auto">
          <HiOutlineSearch
            className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"
            size={28}
          />
          <input
            type="text"
            placeholder="Search restaurants, food and drink"
            className="w-full h-16 lg:h-20 pl-16 pr-8 rounded-full bg-white/95 backdrop-blur-md shadow-2xl focus:outline-none text-gray-800 text-lg"
          />
        </div>
      </div>
    </section>
  );
};
