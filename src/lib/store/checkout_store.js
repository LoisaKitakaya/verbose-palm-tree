// src/lib/store/checkout_store.js
import Cookies from "js-cookie";
import toast from "solid-toast";
import { createStore } from "solid-js/store";
import { backendAPI } from "../utils/secrets";
import { startLoading, stopLoading } from "./loading_store";
import { closeModal } from "./modal_store";
import { authState } from "./auth_store";

// Checkout Store
export const createCheckoutStore = () => {
  const [state, setState] = createStore({
    items: [],
    error: null,
  });

  // Sync with localStorage
  const syncWithLocalStorage = () => {
    const savedCart = localStorage.getItem("checkout");
    if (savedCart) {
      setState({ items: JSON.parse(savedCart) });
    }
  };

  const persistCart = () => {
    localStorage.setItem("checkout", JSON.stringify(state.items));
  };

  const cartActions = {
    addItem: (product, quantity = 1) => {
      if (!authState.isAuthenticated) {
        toast.error("Please login to perform this action");

        return;
      }

      const newItems = state.items.find(
        (item) => item.product.id === product.id
      )
        ? state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...state.items, { product, quantity }];

      setState({ items: newItems });
      persistCart();
      toast.success("Item added to cart");
    },

    updateQuantity: (productId, quantity) => {
      if (!authState.isAuthenticated) {
        toast.error("Please login to perform this action");

        return;
      }

      const newItems = state.items.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      );
      setState({ items: newItems });
      persistCart();
    },

    removeItem: (productId) => {
      if (!authState.isAuthenticated) {
        toast.error("Please login to perform this action");

        return;
      }

      const newItems = state.items.filter(
        (item) => item.product.id !== productId
      );
      setState({ items: newItems });
      persistCart();
      toast.success("Item removed from cart");
    },

    clearCart: () => {
      setState({ items: [] });
      localStorage.removeItem("checkout");
      toast.success("Cart cleared");
    },
  };

  const createOrder = async () => {
    if (!authState.isAuthenticated) {
      toast.error("Please login to perform this action");

      return;
    }

    try {
      startLoading();
      const token = Cookies.get("session");

      if (!token) {
        toast.error("Please log in to complete checkout");

        return;
      }

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: state.items.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
        }),
      };

      const url = `${backendAPI}/api/v1/orders/create-order`;

      const response = await fetch(url, options);

      if (!response.ok) throw new Error("Order creation failed");

      const orderData = await response.json();

      cartActions.clearCart();

      const newTab = window.open(orderData.payment_url, "_blank");

      if (newTab) {
        newTab.focus(); // Ensure the new tab is brought into focus
      } else {
        alert("Popup blocked! Please allow popups for this site.");
      }

      closeModal();
    } catch (error) {
      setState({ error: error.message });

      toast.error(`Order creation failed: ${error.message}`);
    } finally {
      stopLoading();
    }
  };

  const processPayment = async (orderId) => {
    if (!authState.isAuthenticated) {
      toast.error("Please login to perform this action");

      return;
    }
    
    const token = Cookies.get("session");

    if (!token) {
      toast.error("Please log in to complete checkout");

      return;
    }

    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 1000);
    });
  };

  return {
    state,
    ...cartActions,
    createOrder,
    syncWithLocalStorage,
    get totalItems() {
      return state.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    get totalPrice() {
      return state.items
        .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
        .toFixed(2);
    },
  };
};

// Initialize stores
export const checkoutStore = createCheckoutStore();
