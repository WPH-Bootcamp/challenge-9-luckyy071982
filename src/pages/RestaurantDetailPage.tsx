import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiStar, HiOutlineShare, HiPlus, HiMinus } from "react-icons/hi";
import axios from "axios";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useCart } from "@/features/cart/CartContext";

export const RestaurantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { cartData, addToCart, updateQty } = useCart();
  const { token } = useSelector((state: any) => state.auth);

  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Menu");
  const [isProcessing, setIsProcessing] = useState<number | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://restaurant-be-400174736012.asia-southeast2.run.app/api/resto/${id}`,
        );
        setRestaurant(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  const getMenuItemStatus = (menuId: number) => {
    for (const group of cartData) {
      const item = group.items.find((i) => i.menu.id === menuId);
      if (item) return item;
    }
    return null;
  };

  const handleAdd = async (menuId: number) => {
    if (!token) {
      navigate("/auth", { state: { from: location.pathname } });
      return;
    }

    try {
      setIsProcessing(menuId);
      await addToCart(Number(id), menuId, 1);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(null);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEFBF0]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
      </div>
    );

  if (!restaurant) return null;

  const filteredMenus = (restaurant.menus || []).filter(
    (m: any) =>
      activeTab === "All Menu" ||
      m.type?.toLowerCase() === activeTab.toLowerCase(),
  );

  return (
    <div className="min-h-screen bg-[#FEFBF0]">
      <Header />

      <main className="pt-28 lg:pt-32 max-w-[1440px] mx-auto px-6 lg:px-[120px] pb-20">
        <div className="flex flex-col lg:flex-row gap-8 mb-10">
          <div className="w-full lg:w-2/3">
            <div className="hidden lg:grid grid-cols-4 grid-rows-2 gap-4 h-[400px]">
              <div className="col-span-2 row-span-2 rounded-3xl overflow-hidden shadow-md">
                <img
                  src={restaurant.images?.[0] || restaurant.logo}
                  className="w-full h-full object-cover"
                  alt="Main"
                />
              </div>
              <div className="col-span-2 row-span-1 rounded-3xl overflow-hidden shadow-md">
                <img
                  src={restaurant.images?.[1] || restaurant.images?.[0]}
                  className="w-full h-full object-cover"
                  alt="Sub 1"
                />
              </div>
              <div className="col-span-1 row-span-1 rounded-3xl overflow-hidden shadow-md">
                <img
                  src={restaurant.images?.[2] || restaurant.images?.[0]}
                  className="w-full h-full object-cover"
                  alt="Sub 2"
                />
              </div>
              <div className="col-span-1 row-span-1 rounded-3xl overflow-hidden shadow-md">
                <img
                  src={restaurant.images?.[3] || restaurant.images?.[0]}
                  className="w-full h-full object-cover"
                  alt="Sub 3"
                />
              </div>
            </div>
            <div className="lg:hidden rounded-[2.5rem] overflow-hidden aspect-video shadow-lg relative">
              <img
                src={restaurant.images?.[0] || restaurant.logo}
                className="w-full h-full object-cover"
                alt={restaurant.name}
              />
            </div>
          </div>

          <div className="lg:w-1/3 flex flex-col justify-end lg:pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white p-2 rounded-3xl shadow-md border flex items-center justify-center">
                  <img
                    src={restaurant.logo}
                    className="w-full object-contain"
                    alt="Logo"
                  />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900">
                    {restaurant.name}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-500 mt-1 font-medium text-sm lg:text-base">
                    <HiStar className="text-yellow-400" size={20} />
                    <span className="text-gray-900 font-bold">
                      {restaurant.star}
                    </span>
                    <span className="truncate text-gray-400">
                      • {restaurant.place} • {restaurant.distance} km
                    </span>
                  </div>
                </div>
              </div>
              <button className="p-3 bg-white rounded-full shadow-md border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                <HiOutlineShare size={22} className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        <hr className="border-gray-200/60 mb-10" />

        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
          </div>
          <div className="flex gap-3 mb-8 overflow-x-auto no-scrollbar pb-2">
            {["All Menu", "Food", "Drink"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2.5 rounded-full border font-bold transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-red-50 border-red-500 text-red-600 shadow-sm"
                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {filteredMenus.map((menu: any) => {
              const cartItem = getMenuItemStatus(menu.id);
              const isLoading = isProcessing === menu.id;

              return (
                <div
                  key={menu.id}
                  className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-gray-100 flex flex-col items-center"
                >
                  <div className="w-full aspect-square rounded-[2rem] overflow-hidden mb-4 bg-gray-50">
                    <img
                      src={menu.image}
                      className="w-full h-full object-cover"
                      alt={menu.foodName}
                    />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1 text-center line-clamp-1">
                    {menu.foodName}
                  </h3>
                  <p className="font-extrabold text-red-600 mb-4 text-lg">
                    Rp{menu.price?.toLocaleString()}
                  </p>

                  {cartItem ? (
                    <div className="flex items-center justify-between w-full bg-white rounded-full p-1 border border-gray-200">
                      <button
                        onClick={() =>
                          updateQty(cartItem.id, cartItem.quantity - 1)
                        }
                        className="w-9 h-9 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors active:scale-90"
                      >
                        <HiMinus size={18} />
                      </button>
                      <span className="font-bold text-gray-800 text-lg">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQty(cartItem.id, cartItem.quantity + 1)
                        }
                        className="w-9 h-9 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-red-700 transition-colors active:scale-90"
                      >
                        <HiPlus size={18} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAdd(menu.id)}
                      disabled={isLoading}
                      className="w-full py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 shadow-lg shadow-red-100 transition-all active:scale-95 disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Loading..." : "Add"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Bagian Review tetap sama */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Review</h2>
            <div className="flex items-center gap-2">
              <HiStar className="text-yellow-400" size={24} />
              <span className="text-lg font-bold text-gray-900">
                {restaurant.star} ({restaurant.totalReviews} Ulasan)
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(restaurant.reviews || []).map((rev: any) => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={rev.user?.avatar || "https://i.pravatar.cc/100"}
                    className="w-12 h-12 rounded-full border"
                    alt={rev.user?.name}
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {rev.user?.name || "Customer"}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <HiStar
                        key={i}
                        size={16}
                        className={
                          i < rev.star ? "text-yellow-400" : "text-gray-200"
                        }
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 italic leading-relaxed text-sm">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
