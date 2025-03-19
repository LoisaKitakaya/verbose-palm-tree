// src/lib/store/favorite_store.js
import Cookies from "js-cookie";
import toast from "solid-toast";
import { createStore } from "solid-js/store";
import { backendAPI } from "../utils/secrets";
import { authState } from "./auth_store";

// Favorites Store
export const createFavoritesStore = () => {
  const [favorites, setFavorites] = createStore({ items: [] });

  const syncWithServer = async () => {
    try {
      const token = Cookies.get("session");

      if (!token) {
        throw new Error("Session token is missing. Please log in.");
      }

      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const url = `${backendAPI}/api/v1/store/favorites`;

      const response = await fetch(url, options);

      if (response.ok) {
        const serverFavorites = await response.json();
        setFavorites({ items: serverFavorites.map((f) => f.product.id) });
      }
    } catch (error) {
      // toast.error(`Failed to sync favorites: ${error.message}`);
      new Error(`Failed to sync favorites: ${error.message}`);
    }
  };

  const toggleFavorite = async (productId) => {
    if (!authState.isAuthenticated) {
      toast.error("Please login to perform this action");

      return;
    }

    try {
      const token = Cookies.get("session");

      if (!token) {
        toast.error("Please log in to manage favorites");

        return;
      }

      const isFavorite = favorites.items.includes(productId);
      const previousItems = [...favorites.items]; // Store previous state

      // Optimistic update
      setFavorites({
        items: isFavorite
          ? previousItems.filter((id) => id !== productId)
          : [...previousItems, productId],
      });

      const method = isFavorite ? "DELETE" : "POST";
      const url = `${backendAPI}/api/v1/store/favorites`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId }),
      });

      if (!response.ok) {
        // Revert on error
        setFavorites({ items: previousItems });
        throw new Error(`Failed: ${response.statusText}`);
      }

      toast.success(
        isFavorite ? "Removed from favorites" : "Added to favorites"
      );
    } catch (error) {
      toast.error(error.message);
      throw error; // Re-throw for component handling
    }
  };

  return { favorites, toggleFavorite, syncWithServer };
};

// Initialize stores
export const favoritesStore = createFavoritesStore();
