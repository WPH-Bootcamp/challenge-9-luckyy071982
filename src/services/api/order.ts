import axiosInstance from "./axios";

export const getMyOrders = async (params?: {
  status?: "preparing" | "on_the_way" | "delivered" | "done" | "cancelled";
  page?: number;
  limit?: number;
}) => {
  // Kita hapus default status: "done" agar semua order muncul
  const response = await axiosInstance.get("/order/my-order", {
    params: params || { page: 1, limit: 10 },
  });
  return response.data;
};
