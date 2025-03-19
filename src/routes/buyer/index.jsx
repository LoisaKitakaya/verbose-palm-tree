import Cookies from "js-cookie";
import Container from "../../components/layout/app/container";
import { backendAPI } from "../../lib/utils/secrets";
import { getErrorMessage } from "../../lib/utils/responses";
import MetaTitle from "../../components/meta/meta-title";
import Spinner from "../../components/layout/spinner";
import { useSearchParams } from "@solidjs/router";
import ProductCard from "../../components/products/product_card";
import RouteProtection from "../../components/auth/route_protection";
import {
  createEffect,
  createResource,
  createSignal,
  For,
  Match,
  onMount,
  Suspense,
  Switch,
} from "solid-js";
import SellerLimitation from "../../components/auth/seller_limitation";
import OrdersTable from "../../components/buyer/orders_table";

const fetchFavoriteProducts = async () => {
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

const fetchUserOrders = async () => {
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

  const url = `${backendAPI}/api/v1/orders/user-orders`;

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

export default function Favorites() {
  const [searchParams, setSearchParams] = useSearchParams();

  onMount(() => {
    if (!searchParams.tab) {
      setSearchParams({ tab: "favorites" });
    }
  });

  const [favoriteProducts] = createResource(fetchFavoriteProducts);

  const [userOrders] = createResource(fetchUserOrders);

  const changeTab = (name) => {
    setSearchParams({ tab: name });
  };

    createEffect(() => {
      console.log(userOrders());
    });

  return (
    <>
      <MetaTitle title="Favorites/Orders" />

      <RouteProtection>
        <SellerLimitation>
          <Container show_navbar_2={false}>
            <Suspense fallback={<Spinner />}>
              <div className="breadcrumbs text-sm">
                <ul>
                  <li>
                    <a className="link text-primary" href="/">
                      Home
                    </a>
                  </li>
                  <li>Favorites/Orders</li>
                </ul>
              </div>

              <div
                role="tablist"
                className="tabs tabs-sm tabs-boxed flex gap-4 w-full justify-center"
              >
                <a
                  role="tab"
                  className={`tab ${
                    searchParams.tab === "favorites" ? "tab-active" : ""
                  }`}
                  onClick={() => changeTab("favorites")}
                >
                  Favorites
                </a>
                <a
                  role="tab"
                  className={`tab ${
                    searchParams.tab === "orders" ? "tab-active" : ""
                  }`}
                  onClick={() => changeTab("orders")}
                >
                  Orders
                </a>
              </div>

              <Switch>
                <Match when={searchParams.tab === "favorites"}>
                  <div className="m-2">
                    <Switch>
                      <Match
                        when={
                          favoriteProducts() && favoriteProducts().length > 0
                        }
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4 w-full mx-auto">
                          <For each={favoriteProducts()}>
                            {(item) => (
                              <div
                                key={item.id}
                                className="group block overflow-hidden rounded hover:rounded-lg shadow-sm hover:shadow-lg transition duration-300 border border-gray-100"
                              >
                                <a href={`/store/product/${item.id}`}>
                                  <img
                                    src={
                                      item.image ||
                                      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                                    }
                                    alt={item.slug}
                                    className="h-[300px] w-full object-cover transition duration-300 group-hover:scale-105 sm:h-[400px]"
                                  />
                                </a>
                                <div className="relative bg-white p-3">
                                  <div className="flex justify-between items-center">
                                    <a
                                      href={`/product/${item.id}`}
                                      className="group-hover:underline group-hover:underline-offset-4 font-semibold"
                                    >
                                      {item.name}
                                    </a>
                                    {item.stock > 0 ? (
                                      <div className="badge badge-xs badge-success">
                                        In Stock
                                      </div>
                                    ) : (
                                      <div className="badge badge-xs badge-error">
                                        Out of Stock
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="tracking-wider font-semibold">
                                        ${item.price}
                                      </p>
                                    </div>

                                    <div>
                                      <p class="text-sm">
                                        Store:{" "}
                                        <a
                                          href={`/store/${item.artist.slug}`}
                                          className="link link-hover text-primary"
                                        >
                                          {item.artist.store_name}
                                        </a>
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="divider my-0 mx-2 p-0" />

                                <ProductCard item={item} />
                              </div>
                            )}
                          </For>
                        </div>
                      </Match>
                      <Match
                        when={
                          favoriteProducts() && favoriteProducts().length === 0
                        }
                      >
                        <div className="flex flex-col items-center gap-4">
                          <span className="text-2xl font-semibold text-center mt-40">
                            Favorite Products Not Found
                          </span>
                        </div>
                      </Match>
                    </Switch>
                  </div>
                </Match>
                <Match when={searchParams.tab === "orders"}>
                  <div className="m-2">
                    <Switch>
                      <Match
                        when={userOrders() && userOrders().orders.length > 0}
                      >
                        <OrdersTable data={userOrders().orders} />
                      </Match>
                      <Match
                        when={userOrders() && userOrders().orders.length === 0}
                      >
                        <div className="flex flex-col items-center gap-4">
                          <span className="text-2xl font-semibold text-center mt-40">
                            User Orders Not Found
                          </span>
                        </div>
                      </Match>
                    </Switch>
                  </div>
                </Match>
              </Switch>
            </Suspense>
          </Container>
        </SellerLimitation>
      </RouteProtection>
    </>
  );
}
