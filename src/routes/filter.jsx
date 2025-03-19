import Cookies from "js-cookie";
import Container from "../components/layout/app/container";
import { backendAPI } from "../lib/utils/secrets";
import { getErrorMessage } from "../lib/utils/responses";
import MetaTitle from "../components/meta/meta-title";
import Spinner from "../components/layout/spinner";
import { useSearchParams } from "@solidjs/router";
import ProductCard from "../components/products/product_card";
import {
  createEffect,
  createResource,
  createSignal,
  For,
  Match,
  Suspense,
  Switch,
} from "solid-js";

const fetchFilteredProducts = async ({ search, category, page }) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (category !== "all") params.append("category", category);
  if (page) params.append("page", page);

  const url = `${backendAPI}/api/v1/store/products/filter?${params}`;

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

export default function Filter() {
  const [searchParams] = useSearchParams();

  const [products] = createResource(
    () => ({
      search: searchParams.search,
      category: searchParams.category || "all",
    }),
    fetchFilteredProducts
  );

  // createEffect(() => {
  //   console.log(products())
  // })

  return (
    <>
      <MetaTitle title="Filter" />

      <Container show_navbar_2={false}>
        <Suspense fallback={<Spinner />}>
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <a className="link text-primary" href="/">
                  Home
                </a>
              </li>
              <li>Filter Result</li>
            </ul>
          </div>

          <Switch>
            <Match when={products()}>
              <Switch>
                <Match when={products() && products().results.length > 0}>
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4 w-full mx-auto">
                    <For each={products().results}>
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
                <Match when={products() && products().results.length === 0}>
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-2xl font-semibold text-center mt-40">
                      Product Query Not Found
                    </span>
                  </div>
                </Match>
              </Switch>
            </Match>
            <Match when={!products()}>
              <Error />
            </Match>
          </Switch>
        </Suspense>
      </Container>
    </>
  );
}
