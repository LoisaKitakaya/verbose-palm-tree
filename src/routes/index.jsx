import Cookies from "js-cookie";
import Container from "../components/layout/app/container";
import { backendAPI } from "../lib/utils/secrets";
import { getErrorMessage } from "../lib/utils/responses";
import MetaTitle from "../components/meta/meta-title";
import Spinner from "../components/layout/spinner";
import ProductCard from "../components/products/product_card";
import {
  createEffect,
  createResource,
  createSignal,
  Match,
  Suspense,
  Switch,
} from "solid-js";

const fetchAllProducts = async () => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const url = `${backendAPI}/api/v1/store/products`;

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

export default function Home() {
  const [products] = createResource(fetchAllProducts);

  return (
    <>
      <MetaTitle title="Home" />

      <Container>
        <div className="m-2">
          <section class="overflow-hidden bg-base-200 sm:grid sm:grid-cols-2">
            <div class="p-8 md:p-12 lg:px-16 lg:py-24">
              <div class="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
                <h2 class="text-2xl font-bold text-gray-900 md:text-3xl">
                  Welcome to Uranium Glass Seller Console
                </h2>

                <p class="hidden text-gray-500 md:mt-4 md:block">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et,
                  egestas tempus tellus etiam sed. Quam a scelerisque amet
                  ullamcorper eu enim et fermentum, augue. Aliquet amet volutpat
                  quisque ut interdum tincidunt duis.
                </p>

                <div class="mt-4 md:mt-8">
                  <a href="/store/products" class="btn btn-neutral">
                    Go To Inventory
                  </a>
                </div>
              </div>
            </div>

            <img
              alt=""
              src="https://i.pinimg.com/originals/78/69/fa/7869facc31268386787f80538d060fb4.jpg"
              class="h-56 w-full object-cover sm:h-full"
            />
          </section>
        </div>
      </Container>
    </>
  );
}
