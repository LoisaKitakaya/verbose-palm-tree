class Cache {
  constructor(prefix = "Cache_", storageType = "sessionStorage") {
    if (!["localStorage", "sessionStorage"].includes(storageType)) {
      throw new Error(
        "Invalid storage type. Supported types: localStorage, sessionStorage"
      );
    }

    this.storage = window[storageType];

    this.prefix = prefix;
  }

  // Get cached data with expiry check
  get(key) {
    const serializedData = this.storage.getItem(this.prefix + key);

    if (!serializedData) return null;

    try {
      const { data, expiry } = JSON.parse(serializedData);

      if (expiry && expiry <= Date.now()) {
        this.remove(key);

        return null;
      }

      return data;
    } catch (error) {
      console.error("Error parsing cached data:", error);

      this.remove(key);

      return null;
    }
  }

  // Set cached data with optional expiry
  set(key, value, ttl = null) {
    const expiry = ttl ? Date.now() + ttl * 1000 : null;

    const data = { data: value, expiry };

    try {
      this.storage.setItem(this.prefix + key, JSON.stringify(data));
    } catch (error) {
      console.error("Error storing data in cache:", error);
    }
  }

  // Remove cached data
  remove(key) {
    this.storage.removeItem(this.prefix + key);
  }

  // Clear all cached data
  clear() {
    const keys = Object.keys(this.storage);

    for (const key of keys) {
      if (key.startsWith(this.prefix)) {
        this.storage.removeItem(key);
      }
    }
  }
}

export const apiCache = new Cache();

// Usage example:
// const localStorageCache = new Cache("localStorage");
// const sessionStorageCache = new Cache("sessionStorage");

// Set data with expiry in localStorage
// localStorageCache.set("user", { name: "John" }, 60 * 10); // Expires in 10 minutes

// Get data from sessionStorage
// const cachedData = sessionStorageCache.get("sessionData");

// Clear all data from localStorage cache
// localStorageCache.clear();
