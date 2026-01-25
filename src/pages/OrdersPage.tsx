import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect, useState, useMemo } from "react";
import { getMyOrders } from "@/services/api/order";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/features/auth/authSlice";
import {
  HiOutlineSearch,
  HiOutlineLocationMarker,
  HiOutlineClipboardList,
  HiOutlineLogout,
  HiStar,
  HiOutlineX,
} from "react-icons/hi";
import { toast } from "sonner";

export const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("done");
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const statuses = ["Preparing", "On the Way", "Delivered", "Done", "Canceled"];

  const fetchOrders = async (status: string) => {
    setLoading(true);
    try {
      const apiStatus = status.toLowerCase().replace(/\s+/g, "_");
      const response = await getMyOrders({ status: apiStatus as any });

      if (response.success) {
        setOrders(response.data.orders || []);
      }
    } catch (error: any) {
      toast.error("Failed to load order history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(activeStatus);
  }, [activeStatus]);

  const filteredOrders = useMemo(() => {
    if (searchQuery.length < 5) return orders;

    const query = searchQuery.toLowerCase();
    return orders.filter((order) => {
      const restaurantName =
        order.restaurants?.[0]?.restaurant?.name?.toLowerCase() || "";

      const hasMatchingMenu = order.restaurants?.[0]?.items?.some((item: any) =>
        item.menuName?.toLowerCase().includes(query),
      );

      return restaurantName.includes(query) || hasMatchingMenu;
    });
  }, [searchQuery, orders]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const openRatingModal = (order: any) => {
    setSelectedOrder(order);
    setRating(0);
    setComment("");
    setIsModalOpen(true);
  };

  const handleSubmitReview = () => {
    if (rating === 0) {
      toast.error("Please provide a star rating");
      return;
    }
    toast.success("Thank you for your review!");
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FEFBF0] flex flex-col relative">
      <Header />

      <main className="flex-grow pt-24 lg:pt-32 pb-20 px-4 lg:px-10 max-w-[1200px] mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-64 bg-white rounded-[2rem] p-6 shadow-sm h-fit border border-gray-50">
            <div className="flex items-center gap-3 mb-8 px-2">
              <img
                src="https://i.pravatar.cc/150?u=john"
                alt="avatar"
                className="w-12 h-12 rounded-full border-2 border-red-50"
              />
              <span className="font-bold text-gray-900">User</span>
            </div>
            <nav className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-[#D63031] rounded-xl transition-all cursor-pointer">
                <HiOutlineLocationMarker className="text-xl" />
                <span className="font-medium">Delivery Address</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 text-[#D63031] rounded-xl transition-all cursor-pointer">
                <HiOutlineClipboardList className="text-xl" />
                <span className="font-bold">My Orders</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-[#D63031] rounded-xl transition-all mt-4 cursor-pointer"
              >
                <HiOutlineLogout className="text-xl" />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </aside>

          <section className="flex-1">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
              My Orders
            </h1>

            <div className="bg-white rounded-[2.5rem] p-4 lg:p-8 shadow-sm border border-gray-50">
              <div className="relative mb-8">
                <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search restaurant or menu (min. 5 chars)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-full py-3 pl-12 pr-6 focus:ring-2 focus:ring-red-100 transition-all text-sm outline-none"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scrollbar-hide">
                <span className="flex items-center font-bold text-gray-900 mr-2 min-w-fit">
                  Status
                </span>
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setActiveStatus(status.toLowerCase())}
                    className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                      activeStatus === status.toLowerCase()
                        ? "bg-red-50 border-red-200 text-[#D63031]"
                        : "bg-white border-gray-100 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D63031]"></div>
                </div>
              ) : filteredOrders.length > 0 ? (
                <div className="space-y-6">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={
                            order.restaurants?.[0]?.restaurant?.logo ||
                            "https://placehold.co/40x40"
                          }
                          className="w-10 h-10 rounded-lg object-contain bg-gray-50 p-1"
                          alt="logo"
                        />
                        <h3 className="font-extrabold text-gray-900">
                          {order.restaurants?.[0]?.restaurant?.name}
                        </h3>
                      </div>

                      {order.restaurants?.[0]?.items?.map(
                        (item: any, idx: number) => (
                          <div key={idx} className="flex gap-4 mb-4">
                            <img
                              src={item.image}
                              className="w-20 h-20 rounded-[1.5rem] object-cover"
                              alt={item.menuName}
                            />
                            <div className="flex flex-col justify-center">
                              <p className="text-gray-500 text-sm mb-1">
                                {item.menuName}
                              </p>
                              <p className="font-extrabold text-gray-900">
                                {item.quantity} x Rp
                                {item.price?.toLocaleString("id-ID")}
                              </p>
                            </div>
                          </div>
                        ),
                      )}

                      <div className="h-[1px] bg-gray-100 my-4" />

                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Total</p>
                          <p className="text-lg font-black text-gray-900">
                            Rp
                            {order.pricing?.totalPrice?.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <button
                          onClick={() => openRatingModal(order)}
                          className="bg-[#D63031] text-white font-bold py-3 px-10 rounded-full hover:bg-[#b52829] active:scale-95 transition-all cursor-pointer text-center"
                        >
                          Give Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-400">
                    {searchQuery.length >= 5
                      ? `No orders match "${searchQuery}"`
                      : "You haven't placed any orders yet."}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>

          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 relative z-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-6 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <HiOutlineX size={24} />
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-black text-gray-900 mb-2">
                Give Review
              </h2>
              <p className="text-gray-500 mb-8 font-medium">
                Rate your experience with{" "}
                {selectedOrder?.restaurants?.[0]?.restaurant?.name}
              </p>

              <div className="flex justify-center gap-2 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform active:scale-125 cursor-pointer"
                  >
                    <HiStar
                      size={42}
                      className={`transition-colors ${
                        star <= rating ? "text-yellow-400" : "text-gray-200"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Please share your thoughts about our service!"
                className="w-full bg-gray-50 border-2 border-transparent focus:border-red-100 rounded-3xl p-5 min-h-[150px] outline-none transition-all text-gray-700 font-medium text-sm mb-8"
              ></textarea>

              <button
                onClick={handleSubmitReview}
                className="w-full bg-[#D63031] text-white font-bold py-4 rounded-full shadow-lg shadow-red-200 hover:bg-[#b52829] active:scale-95 transition-all cursor-pointer"
              >
                Send Review
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
