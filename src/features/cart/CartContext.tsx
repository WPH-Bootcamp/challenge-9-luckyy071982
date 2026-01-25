import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { cartService } from "@/services/api/cart";
import { useSelector } from "react-redux";

interface CartItem {
  id: number;
  menu: {
    id: number;
    foodName: string;
    price: number;
    type: string;
    image: string;
  };
  quantity: number;
  itemTotal: number;
}

interface CartGroup {
  restaurant: {
    id: number;
    name: string;
    logo: string;
  };
  items: CartItem[];
  subtotal: number;
}

interface CartSummary {
  totalItems: number;
  totalPrice: number;
  restaurantCount: number;
}

interface CartContextType {
  cartData: CartGroup[];
  summary: CartSummary;
  loading: boolean;
  refreshCart: () => Promise<void>;
  addToCart: (
    restaurantId: number,
    menuId: number,
    quantity: number,
  ) => Promise<void>;
  updateQty: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getGlobalCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartData, setCartData] = useState<CartGroup[]>([]);
  const [summary, setSummary] = useState<CartSummary>({
    totalItems: 0,
    totalPrice: 0,
    restaurantCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state: any) => state.auth);

  const refreshCart = useCallback(async () => {
    try {
      const response = await cartService.getCart();
      if (response.data.success) {
        setCartData(response.data.data.cart || []);
        setSummary(
          response.data.data.summary || {
            totalItems: 0,
            totalPrice: 0,
            restaurantCount: 0,
          },
        );
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCartData([]);
      setSummary({ totalItems: 0, totalPrice: 0, restaurantCount: 0 });
    }
  }, []);

  const addToCart = async (
    restaurantId: number,
    menuId: number,
    quantity: number,
  ) => {
    try {
      setLoading(true);
      const response = await cartService.addToCart({
        restaurantId,
        menuId,
        quantity,
      });
      if (response.data.success) {
        await refreshCart();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (cartItemId: number, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeItem(cartItemId);
      } else {
        const response = await cartService.updateQuantity(cartItemId, quantity);
        if (response.data.success) {
          await refreshCart();
        }
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (cartItemId: number) => {
    try {
      const response = await cartService.removeItem(cartItemId);
      if (response.data.success) {
        await refreshCart();
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await cartService.clearCart();
      if (response.data.success) {
        setCartData([]);
        setSummary({ totalItems: 0, totalPrice: 0, restaurantCount: 0 });
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const getGlobalCount = () => {
    return summary.totalItems || 0;
  };

  useEffect(() => {
    if (token) {
      refreshCart();
    } else {
      setCartData([]);
      setSummary({ totalItems: 0, totalPrice: 0, restaurantCount: 0 });
    }
  }, [token, refreshCart]);

  return (
    <CartContext.Provider
      value={{
        cartData,
        summary,
        loading,
        refreshCart,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
        getGlobalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
