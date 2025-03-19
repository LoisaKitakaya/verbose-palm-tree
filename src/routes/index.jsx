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
        <div className="card bg-base-100 w-full shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Setup Guide</h2>
            <p>
              Follow the following instructions to help you setup a merchant
              shop ASAP!
            </p>

            <br />

            <ul className="steps steps-vertical">
              <li className="step step-primary">Register</li>
              <li className="step step-primary">Choose plan</li>
              <li className="step">Purchase</li>
              <li className="step">Receive Product</li>
            </ul>
          </div>
        </div>
      </Container>
    </>
  );
}
