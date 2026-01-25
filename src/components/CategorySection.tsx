import AllFoodIcon from "@/assets/CategoryIcon/AllFood.svg";
import NearbyIcon from "@/assets/CategoryIcon/Location.svg";
import DiscountIcon from "@/assets/CategoryIcon/Discount.svg";
import BestSellerIcon from "@/assets/CategoryIcon/BestSeller.svg";
import DeliveryIcon from "@/assets/CategoryIcon/Delivery.svg";
import LunchIcon from "@/assets/CategoryIcon/Lunch.svg";

const categories = [
  { id: 1, name: "All Restaurant", icon: AllFoodIcon },
  { id: 2, name: "Nearby", icon: NearbyIcon },
  { id: 3, name: "Discount", icon: DiscountIcon },
  { id: 4, name: "Best Seller", icon: BestSellerIcon },
  { id: 5, name: "Delivery", icon: DeliveryIcon },
  { id: 6, name: "Lunch", icon: LunchIcon },
];

export const CategorySection = () => {
  return (
    <section className="max-w-[1440px] mx-auto px-6 lg:px-[120px] py-10 lg:py-16">
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-8">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-col items-center gap-3 group cursor-pointer"
          >
            <div className="w-full aspect-square bg-white rounded-[24px] lg:rounded-[32px] shadow-sm border border-gray-50 flex items-center justify-center p-4 lg:p-6 transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
              <img
                src={category.icon}
                alt={category.name}
                className="w-10 h-10 lg:w-14 lg:h-14 object-contain"
              />
            </div>
            <span className="text-[12px] lg:text-[14px] font-semibold text-gray-700 text-center">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
