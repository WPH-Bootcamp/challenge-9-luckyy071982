import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/features/cart/CartContext";
import { HiPlus, HiMinus, HiChevronRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export const CartPage = () => {
  const { cartData, updateQty, loading } = useCart();
  const navigate = useNavigate();

  if (loading && cartData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEFBF0]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#D63031]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFBF0] flex flex-col">
      <Header />

      <main className="flex-grow pt-24 lg:pt-32 pb-20 px-6 max-w-[600px] mx-auto w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Cart</h1>

        {cartData.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🛒</div>
            <p className="text-gray-500 mb-6">Your cart is empty.</p>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 bg-[#D63031] text-white font-bold rounded-full shadow-lg cursor-pointer hover:brightness-110 transition-all"
            >
              Browse Food
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {cartData.map((group) => (
              <div
                key={group.restaurant.id}
                className="bg-white rounded-[2.5rem] p-6 lg:p-8 shadow-sm border border-gray-100"
              >
                <div
                  className="flex items-center gap-2 mb-6 cursor-pointer group w-fit"
                  onClick={() => navigate(`/restaurant/${group.restaurant.id}`)}
                >
                  <span className="text-xl">🏪</span>
                  <h2 className="font-bold text-gray-900 group-hover:text-[#D63031] transition-colors">
                    {group.restaurant.name}
                  </h2>
                  <HiChevronRight className="text-gray-400" />
                </div>

                <div className="space-y-6">
                  {group.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                        <img
                          src={item.menu.image}
                          className="w-full h-full object-cover"
                          alt={item.menu.foodName}
                        />
                      </div>

                      <div className="flex-grow">
                        <h3 className="font-bold text-gray-800 text-sm lg:text-base">
                          {item.menu.foodName}
                        </h3>
                        <p className="font-bold text-gray-900 mt-0.5">
                          Rp{item.menu.price.toLocaleString("id-ID")}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#D63031] hover:text-[#D63031] transition-all bg-white cursor-pointer active:scale-90"
                        >
                          <HiMinus size={14} />
                        </button>
                        <span className="font-bold text-gray-900 min-w-[12px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-[#D63031] flex items-center justify-center text-white shadow-md hover:brightness-110 transition-all cursor-pointer active:scale-90"
                        >
                          <HiPlus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-dashed border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-400 font-medium">Total</span>
                    <span className="font-bold text-gray-900 text-lg">
                      Rp{group.subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full py-4 bg-[#D63031] text-white font-bold rounded-2xl shadow-lg shadow-red-100 hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
