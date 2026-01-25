import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getRestaurants } from "@/lib/api/queries/restaurant";
import { RestaurantCard } from "./RestaurantCard";

export const RecommendedSection = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["restaurants"],
    queryFn: getRestaurants,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[120px] py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 bg-gray-200 animate-pulse rounded-[24px]"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  const restaurants = data?.recommendations || [];

  return (
    <section className="max-w-[1440px] mx-auto px-6 lg:px-[120px] pb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
          Recommended
        </h2>
        <button className="text-red-600 font-bold text-sm hover:underline cursor-pointer">
          See All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
        {restaurants.map((res: any) => (
          <Link to={`/restaurant/${res.id}`} key={res.id}>
            <RestaurantCard
              name={res.name}
              image={res.logo || "https://placehold.co/600x400?text=Foody"}
              rating={res.star}
              location={res.place}
              distance={`${res.distance} km`}
            />
          </Link>
        ))}
      </div>
    </section>
  );
};
