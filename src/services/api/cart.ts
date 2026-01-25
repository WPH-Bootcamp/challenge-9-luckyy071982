import axiosInstance from "./axios";

export const cartService = {
  getCart: () => axiosInstance.get("/cart"),

  addToCart: (data: {
    restaurantId: number;
    menuId: number;
    quantity: number;
  }) =>
    axiosInstance.post("/cart", {
      restaurantId: data.restaurantId,
      menuId: data.menuId,
      quantity: data.quantity,
    }),

  updateQuantity: (id: number, quantity: number) =>
    axiosInstance.put(`/cart/${id}`, { quantity }),

  removeItem: (id: number) => axiosInstance.delete(`/cart/${id}`),

  clearCart: () => axiosInstance.delete("/cart"),
};
