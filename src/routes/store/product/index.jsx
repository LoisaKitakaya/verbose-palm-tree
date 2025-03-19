import Cookies from "js-cookie";
import { createResource, Match, Suspense, Switch } from "solid-js";
import { backendAPI } from "../../../lib/utils/secrets";
import MetaTitle from "../../../components/meta/meta-title";
import { getErrorMessage } from "../../../lib/utils/responses";
import Container from "../../../components/layout/app/container";
import RouteProtection from "../../../components/auth/route_protection";
import { useParams } from "@solidjs/router";
import Spinner from "../../../components/layout/spinner";
import Error from "../../../components/layout/error";
import ProductCard from "../../../components/products/product_card";

const fetchProduct = async (product_id) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const url = `${backendAPI}/api/v1/store/products/${product_id}`;

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

export default function Product() {
  const params = useParams();

  const [product] = createResource(params.product_id, fetchProduct);

  return (
    <>
      <MetaTitle title="Product" />

      <Container show_navbar_2={false}>
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <a className="link text-primary" href="/">
                Home
              </a>
            </li>
            <li>{params.product_id}</li>
          </ul>
        </div>

        <Suspense fallback={<Spinner />}>
          <Switch>
            <Match when={product()}>
              <div className="my-4">
                <div class="card card-side bg-base-100 shadow-xs border border-gray-50 mb-6 flex-col lg:flex-row">
                  <figure class="w-1/2">
                    <img
                      src={product().image || "/placeholder-product.jpg"}
                      alt={product().name}
                      class="h-full object-cover w-full mx-auto"
                    />
                  </figure>
                  <div class="card-body p-0 lg:p-4">
                    <div className="flex flex-col justify-between h-full mt-4 lg:mt-0">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 class="card-title">{product().name}</h2>

                          {product().stock > 0 ? (
                            <span className="badge badge-xs badge-success">
                              In Stock
                            </span>
                          ) : (
                            <span className="badge badge-xs badge-error">
                              Out of Stock
                            </span>
                          )}
                        </div>
                        <p>
                          Store:{" "}
                          <a
                            href={`/store/${product().artist.slug}`}
                            className="link link-hover text-primary"
                          >
                            {product().artist.store_name}
                          </a>
                        </p>
                        <p>Artist: {product().artist.user.username}</p>
                        <p>Category: {product().category.name}</p>
                      </div>
                      <div class="card-actions justify-start items-center">
                        <ProductCard item={product()} />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="card card-side bg-base-100 shadow-xs border border-gray-50 mb-6">
                  <div className="card-body">
                    <h2 className="card-title">Product Description</h2>

                    <div className="divider p-0 m-0"></div>

                    <div class="ql-snow">
                      <div
                        class="ql-editor"
                        innerHTML={product().description}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Match>
            <Match when={!product()}>
              <Error />
            </Match>
          </Switch>
        </Suspense>
      </Container>
    </>
  );
}
