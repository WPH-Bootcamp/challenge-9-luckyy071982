import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/features/cart/CartContext";
import {
  HiPlus,
  HiMinus,
  HiLocationMarker,
  HiCheckCircle,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "@/services/api/axios";
import { toast } from "sonner";

export const CheckoutPage = () => {
  const { cartData, updateQty, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState(
    "BNI Bank Negara Indonesia",
  );
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  const deliveryFee = 10000;
  const serviceFee = 1000;

  const currentGroup = cartData[0];
  const subtotal = currentGroup?.subtotal || 0;
  const totalItems =
    currentGroup?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const grandTotal = subtotal + deliveryFee + serviceFee;

  const paymentMethods = [
    {
      id: "BNI Bank Negara Indonesia",
      name: "Bank Negara Indonesia",
      logo: "https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/1200px-BNI_logo.svg.png",
    },
    {
      id: "Bank Rakyat Indonesia",
      name: "Bank Rakyat Indonesia",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/BANK_BRI_logo.svg/1280px-BANK_BRI_logo.svg.png",
    },
    {
      id: "Bank Central Asia",
      name: "Bank Central Asia",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/1200px-Bank_Central_Asia.svg.png",
    },
    {
      id: "Mandiri",
      name: "Mandiri",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bank_Mandiri_logo_2016.svg/1200px-Bank_Mandiri_logo_2016.svg.png",
    },
  ];

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const payload = {
        restaurants: [
          {
            restaurantId: currentGroup.restaurant.id,
            items: currentGroup.items.map((item) => ({
              menuId: item.menu.id,
              quantity: item.quantity,
            })),
          },
        ],
        deliveryAddress: "Jl. Sudirman No. 25, Jakarta Pusat, 10220",
        phone: "0812-3456-7890",
        paymentMethod: paymentMethod,
        notes: "Please ring the doorbell",
      };

      const response = await axiosInstance.post("/order/checkout", payload);

      if (response.data.success) {
        setOrderData(response.data.data.transaction);
        setShowSuccess(true);
        clearCart();
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Failed to place order. Please check your connection.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentGroup && !showSuccess) {
    return (
      <div className="min-h-screen bg-[#FEFBF0] flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">No items to checkout.</p>
        <button
          onClick={() => navigate("/cart")}
          className="text-[#D63031] font-bold cursor-pointer hover:underline"
        >
          Back to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFBF0] flex flex-col relative">
      <Header />

      <main className="flex-grow pt-24 lg:pt-32 pb-20 px-6 max-w-[1200px] mx-auto w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow space-y-6">
            <div className="bg-white rounded-[2.5rem] p-6 lg:p-8 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-red-50 rounded-full text-[#D63031]">
                  <HiLocationMarker size={24} />
                </div>
                <div className="flex-grow">
                  <h2 className="font-bold text-gray-900 mb-1">
                    Delivery Address
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Jl. Sudirman No. 25, Jakarta Pusat, 10220
                  </p>
                  <p className="text-gray-600 text-sm">0812-3456-7890</p>
                </div>
              </div>
              <button className="px-6 py-2 border border-gray-200 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer">
                Change
              </button>
            </div>

            <div className="bg-white rounded-[2.5rem] p-6 lg:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏪</span>
                  <h2 className="font-bold text-gray-900">
                    {currentGroup?.restaurant.name}
                  </h2>
                </div>
                <button
                  onClick={() => navigate("/")}
                  className="px-4 py-2 bg-gray-50 text-gray-700 text-xs font-bold rounded-full border border-gray-100 cursor-pointer"
                >
                  Add item
                </button>
              </div>
              <div className="space-y-6">
                {currentGroup?.items.map((item) => (
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
                      <p className="font-bold text-gray-900">
                        Rp{item.menu.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 cursor-pointer active:scale-90 transition-transform"
                      >
                        <HiMinus size={14} />
                      </button>
                      <span className="font-bold text-gray-900 w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-[#D63031] flex items-center justify-center text-white cursor-pointer active:scale-90 transition-transform"
                      >
                        <HiPlus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-[400px] space-y-6">
            <div className="bg-white rounded-[2.5rem] p-6 lg:p-8 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-6">Payment Method</h2>
              <div className="space-y-4 mb-8">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className="flex items-center justify-between p-1 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 overflow-hidden flex items-center justify-center border border-gray-100 rounded bg-gray-50">
                        <img
                          src={method.logo}
                          className="max-w-full max-h-[14px] object-contain"
                          alt={method.name}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {method.name}
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="w-5 h-5 accent-[#D63031] cursor-pointer"
                    />
                  </label>
                ))}
              </div>
              <div className="border-t border-dashed border-gray-200 pt-6">
                <h2 className="font-bold text-gray-900 mb-4">
                  Payment Summary
                </h2>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between text-gray-500">
                    <span>Price ({totalItems} items)</span>
                    <span className="font-bold text-gray-900">
                      Rp{subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-gray-900">
                      Rp{deliveryFee.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Service Fee</span>
                    <span className="font-bold text-gray-900">
                      Rp{serviceFee.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-50 text-base">
                    <span className="text-gray-900 font-bold">Total</span>
                    <span className="font-extrabold text-[#D63031]">
                      Rp{grandTotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
                <button
                  disabled={loading}
                  onClick={handleCheckout}
                  className="w-full py-4 bg-[#D63031] text-white font-bold rounded-2xl shadow-lg shadow-red-100 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Buy"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#FEFBF0] w-full max-w-[500px] rounded-[3rem] p-8 lg:p-12 text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-100">
                <HiCheckCircle size={48} />
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              Payment Success
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Your payment has been successfully processed.
            </p>

            <div className="space-y-4 text-left border-y border-dashed border-gray-200 py-6 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Date</span>
                <span className="font-bold text-gray-900">
                  {orderData
                    ? new Date(orderData.createdAt).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Payment Method</span>
                <span className="font-bold text-gray-900 uppercase">
                  {orderData?.paymentMethod.split(" ").slice(1).join(" ") ||
                    "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">
                  Price ({totalItems} items)
                </span>
                <span className="font-bold text-gray-900">
                  Rp{orderData?.pricing.subtotal.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Delivery Fee</span>
                <span className="font-bold text-gray-900">
                  Rp{orderData?.pricing.deliveryFee.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Service Fee</span>
                <span className="font-bold text-gray-900">
                  Rp{orderData?.pricing.serviceFee.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-100">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-extrabold text-[#D63031] text-lg">
                  Rp{orderData?.pricing.totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/orders")}
              className="w-full py-4 bg-[#D63031] text-white font-bold rounded-2xl shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              See My Orders
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
