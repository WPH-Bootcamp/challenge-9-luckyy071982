import { HiStar } from "react-icons/hi";

interface RestaurantProps {
  name: string;
  image: string;
  rating: number;
  location: string;
  distance: string;
}

export const RestaurantCard = ({
  name,
  image,
  rating,
  location,
  distance,
}: RestaurantProps) => {
  return (
    <div className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-50 flex flex-row lg:flex-col items-center lg:items-start gap-4 hover:shadow-md transition-all cursor-pointer group w-full h-full">
      {/* Container Gambar: Kecil di samping (mobile), Lebar di atas (desktop) */}
      <div className="w-20 h-20 lg:w-full lg:h-48 rounded-2xl overflow-hidden  flex-shrink-0 flex items-center justify-center">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain p-2 lg:p-4 group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Konten Teks */}
      <div className="flex flex-col gap-1 w-full overflow-hidden">
        <h3 className="font-bold text-gray-900 text-base lg:text-lg truncate">
          {name}
        </h3>

        <div className="flex items-center gap-1">
          <HiStar className="text-yellow-400" size={18} />
          <span className="text-sm font-bold text-gray-700">{rating}</span>
        </div>

        <p className="text-xs lg:text-sm text-gray-500 truncate">
          {location} • {distance}
        </p>
      </div>
    </div>
  );
};
