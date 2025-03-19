import { useParams } from "@solidjs/router";
import RouteProtection from "../../components/auth/route_protection";
import Container from "../../components/layout/app/container";
import MetaTitle from "../../components/meta/meta-title";
import Cookies from "js-cookie";
import { backendAPI } from "../../lib/utils/secrets";
import { getErrorMessage } from "../../lib/utils/responses";
import Spinner from "../../components/layout/spinner";
import Error from "../../components/layout/error";
import ProductCard from "../../components/products/product_card";
import {
  createEffect,
  createResource,
  For,
  Match,
  Suspense,
  Switch,
} from "solid-js";

const fetchStore = async (store_slug) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const url = `${backendAPI}/api/v1/store/products/store/${store_slug}`;

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

export default function Store() {
  const params = useParams();

  const [store] = createResource(params.store_slug, fetchStore);

  //   createEffect(() => {
  //     console.log(store());
  //   });

  return (
    <>
      <MetaTitle title="Store" />

      <Container show_navbar_2={false}>
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <a className="link text-primary" href="/">
                Home
              </a>
            </li>
            <li>{params.store_slug}</li>
          </ul>
        </div>

        <Suspense fallback={<Spinner />}>
          <Switch>
            <Match when={store()}>
              <div className="my-4">
                <div className="relative">
                  <img
                    src={store().artist.banner_image}
                    className="h-80 w-full"
                  />
                  <div className="flex items-center gap-2 absolute top-20 left-2 lg:left-16">
                    <div className="card p-0 bg-base-100 flex flex-row justify-start gap-2">
                      <div className="avatar">
                        <div className="w-24 rounded">
                          <img src={store().artist.user.profile_picture} />
                        </div>
                      </div>

                      <div className="card-body gap-0">
                        <p className="text-sm">
                          <strong>Username:</strong>{" "}
                          {store().artist.user.username}
                        </p>
                        <p className="text-sm">
                          <strong>Email:</strong> {store().artist.user.email}
                        </p>
                        <p className="text-sm">
                          <strong>Name:</strong>{" "}
                          {store().artist.user.first_name}{" "}
                          {store().artist.user.first_name}
                        </p>
                        <p className="text-sm">
                          <strong>Store:</strong> {store().artist.store_name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="divider m-0 p-0" /> */}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4 w-full mx-auto">
                  <For each={store().products}>
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
                          </div>
                        </div>

                        <div className="divider my-0 mx-2 p-0" />

                        <ProductCard item={item} />
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </Match>
            <Match when={!store()}>
              <Error />
            </Match>
          </Switch>
        </Suspense>
      </Container>
    </>
  );
}
