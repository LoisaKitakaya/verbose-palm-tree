import { useLocation, useNavigate, useSearchParams } from "@solidjs/router";
import { authState, logout, userInfo } from "../../../lib/store/auth_store";
import Cookies from "js-cookie";
import { backendAPI } from "../../../lib/utils/secrets";
import { getErrorMessage } from "../../../lib/utils/responses";
import { checkoutStore } from "../../../lib/store/checkout_store";
import Cart from "../../checkout/cart";
import {
  createEffect,
  createResource,
  createSignal,
  For,
  Show,
} from "solid-js";
import { openModal } from "../../../lib/store/modal_store";

const fetchProductCategories = async () => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const url = `${backendAPI}/api/v1/store/categories`;

  try {
    const response = await fetch(url, options);

    const res = await response.json();

    if (response.status >= 400) {
      const message = res?.detail
        ? res?.detail
        : getErrorMessage(response.status);

      return {
        status: response.status,
        message,
      };
    }

    return res;
  } catch (err) {
    throw new Error("Something went wrong: " + err);
  }
};

export default function Navbar(props) {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = createSignal("");
  const [categorySelect, setCategorySelect] = createSignal("");

  const location = useLocation();

  const [productCategories] = createResource(fetchProductCategories);

  const logOut = () => {
    logout();

    navigate("/auth/sign-in");
  };

  const handleCategoryChange = (e) => {
    setCategorySelect(e.target.value);

    setSearchParams({ category: categorySelect() });
  };

  // Handle search form submission
  const handleSearch = (e) => {
    setSearchInput(e.target.value);

    setSearchParams({ search: searchInput() });
  };

  const handleSubmit = (e) => {
    navigate(
      `/filter?search=${searchParams.search || ""}&category=${
        searchParams.category || "all"
      }`
    );
  };

  const openCart = () => {
    openModal("Cart", <Cart />);
  };

  const openSearch = () => {
    openModal(
      "Search",
      <form onSubmit={handleSubmit} className="join w-1/2">
        <input
          type="text"
          placeholder="Search products..."
          className="input input-sm input-bordered join-item w-48"
          value={searchInput() || ""}
          onInput={handleSearch}
        />
        <select
          className="select select-sm select-bordered join-item w-32"
          value={searchParams.category || "all"}
          onChange={handleCategoryChange}
        >
          <option value="all">All Categories</option>
          <For each={productCategories()}>
            {(category) => (
              <option value={category.slug}>{category.name}</option>
            )}
          </For>
        </select>
        <Show when={!location.pathname.startsWith("/filter")}>
          <button type="submit" className="btn btn-sm btn-neutral join-item">
            Search
          </button>
        </Show>
      </form>
    );
  };

  // createEffect(() => {
  //   console.log(JSON.stringify(checkoutStore.state.items, null, 2));
  // });

  return (
    <>
      <div className="navbar bg-base-100 w-full top-0 sticky z-50 shadow-xs px-4 border-b">
        <div className="navbar-start">
          <a
            href="/"
            className="text-3xl text-green-400"
            style={{
              "font-family": "'Germania One', system-ui",
              "font-weight": 400,
              "font-style": "normal",
            }}
          >
            Uranium Glass
          </a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <form onSubmit={handleSubmit} className="join">
            <input
              type="text"
              placeholder="Search products..."
              className="input input-sm input-bordered join-item w-80"
              value={searchInput() || ""}
              onInput={handleSearch}
            />
            <select
              className="select select-sm select-bordered join-item w-32"
              value={searchParams.category || "all"}
              onChange={handleCategoryChange}
            >
              <option value="all">All Categories</option>
              <For each={productCategories()}>
                {(category) => (
                  <option value={category.slug}>{category.name}</option>
                )}
              </For>
            </select>
            <Show when={!location.pathname.startsWith("/filter")}>
              <button
                type="submit"
                className="btn btn-sm btn-neutral join-item"
              >
                Search
              </button>
            </Show>
          </form>
        </div>
        <div className="navbar-end gap-4">
          <button
            className="btn btn-sm btn-circle btn-outline border-gray-100 hover:border-gray-100 hover:bg-gray-100"
            onClick={openSearch}
          >
            <i class="bi bi-search text-lg text-black"></i>
          </button>
          <div className="dropdown dropdown-end dropdown-hover">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-sm btn-circle btn-outline border-gray-100 hover:border-gray-100 hover:bg-gray-100"
            >
              <i class="bi bi-person text-xl text-black"></i>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 border border-gray-100 rounded-box z-1 w-40 p-2 shadow-sm"
            >
              <Show when={!location.pathname.startsWith("/account")}>
                <li>
                  <a href="/account">Account</a>
                </li>
              </Show>
              <Show when={userInfo.is_artist === "No"}>
                <li>
                  <a href="/favorites-orders">Favorites/Orders</a>
                </li>
              </Show>
              <Show
                when={
                  !location.pathname.startsWith("/seller") &&
                  userInfo.is_artist === "Yes"
                }
              >
                <li>
                  <a href="/seller">Seller Console</a>
                </li>
              </Show>
              <Show when={authState.isAuthenticated}>
                <div className="divider m-0 p-0"></div>
                <li>
                  <button
                    className="btn btn-sm btn-error w-full"
                    onClick={logOut}
                  >
                    Log Out
                  </button>
                </li>
              </Show>
            </ul>
          </div>
          <Show
            when={
              !location.pathname.startsWith("/seller") &&
              userInfo.is_artist === "No"
            }
          >
            <div className="indicator">
              <span className="indicator-item text-xs badge badge-neutral badge-xs rounded-2xl font-semibold">
                {checkoutStore.state.items.length}
              </span>
              <button
                className="btn btn-sm btn-circle btn-outline border-gray-100 hover:border-gray-100 hover:bg-gray-100"
                onClick={openCart}
              >
                <i class="bi bi-bag text-xl text-black"></i>
              </button>
            </div>
          </Show>
        </div>
      </div>
    </>
  );
}
