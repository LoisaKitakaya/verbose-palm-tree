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
import LoggedInUser from "./logged_in_user";

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
      <div className="navbar bg-black text-white">
        <div className="navbar-start ">
          <label htmlFor="my-drawer-2" className=" drawer-button lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>

          <a href="/" className="btn btn-ghost text-xl">Uranium Glass</a>
        </div>

        <div className="navbar-end">
          <button className="btn btn-sm btn-outline px-2 py-0.5 border-none mr-4">
            <i class="bi bi-bell text-xl text-white"></i>
          </button>

          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button">
              <LoggedInUser />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-48 p-2 mt-4 shadow text-base-content"
            >
              <li>
                <a href="/favorites">Favorites</a>
              </li>
              <Show when={authState.isAuthenticated}>
                <div className="divider p-0 m-0"></div>
                <li>
                  <button className="btn btn-sm btn-error" onClick={logout}>
                    Log Out
                  </button>
                </li>
              </Show>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
