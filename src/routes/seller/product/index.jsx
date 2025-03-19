import {
  createEffect,
  createResource,
  createSignal,
  For,
  Match,
  Suspense,
  Switch,
} from "solid-js";
import BuyerLimitation from "../../../components/auth/buyer_limitation";
import RouteProtection from "../../../components/auth/route_protection";
import Container from "../../../components/layout/app/container";
import MetaTitle from "../../../components/meta/meta-title";
import Cookies from "js-cookie";
import { backendAPI } from "../../../lib/utils/secrets";
import { getErrorMessage } from "../../../lib/utils/responses";
import Error from "../../../components/layout/error";
import { useNavigate, useParams } from "@solidjs/router";
import toast from "solid-toast";
import {
  loadingState,
  startLoading,
  stopLoading,
} from "../../../lib/store/loading_store";
import { closeModal, openModal } from "../../../lib/store/modal_store";
import Spinner from "../../../components/layout/spinner";
import Editor from "../../../components/richtext/editor";

const updateProduct = async (product_id, data) => {
  const token = Cookies.get("session");

  if (!token) {
    throw new Error("Session token is missing. Please log in.");
  }

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  };

  const url = `${backendAPI}/api/v1/store/products/${product_id}/update`;

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

const deleteProduct = async (product_id) => {
  const token = Cookies.get("session");

  if (!token) {
    throw new Error("Session token is missing. Please log in.");
  }

  const options = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
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

const fetchSellerProduct = async (product_id) => {
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

const fetchProductCategories = async () => {
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

export default function SellerProduct() {
  const navigate = useNavigate();

  const params = useParams();

  const [sellerProduct, { refetch }] = createResource(
    params.product_id,
    fetchSellerProduct
  );

  const [productCategories] = createResource(fetchProductCategories);

  const [formData, setFormData] = createSignal({
    name: null,
    description: null,
    price: null,
    stock: null,
    category_id: null,
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setFormData((prev) => ({ ...prev, file: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    startLoading();

    try {
      if (
        formData().name ||
        formData().description ||
        formData().price ||
        formData().stock ||
        formData().category_id ||
        formData().file
      ) {
        const appForm = new FormData();

        appForm.append("file", formData().file);
        appForm.append(
          "data",
          JSON.stringify({
            name: formData().name,
            description: formData().description,
            price: formData().price,
            stock: formData().stock,
            category_id: formData().category_id,
            is_active: null,
          })
        );

        const result = await updateProduct(params.product_id, appForm);

        if (result.status && result.status >= 400) {
          toast.error(result.message);
        } else {
          toast.success("Product updated successfully");

          refetch();
        }
      } else {
        toast.success("No changes detected");
      }
    } catch (error) {
      toast.error(
        `An unexpected error occurred: ${error}. Please try again later.`
      );
    } finally {
      stopLoading();
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    startLoading();

    try {
      const result = await deleteProduct(params.product_id);

      if (result.status && result.status >= 400) {
        toast.error(result.message);
      } else {
        toast.success("Product deleted successfully");

        closeModal();

        navigate("/seller?tab=products");
      }
    } catch (error) {
      toast.error(
        `An unexpected error occurred: ${error}. Please try again later.`
      );
    } finally {
      stopLoading();
    }
  };

  const confirmPrompt = () => {
    openModal(
      "This action is irreversible",
      <form onSubmit={handleDelete}>
        <div className="card-actions justify-end">
          <button
            type="submit"
            className="btn btn-error w-full"
            disabled={loadingState.isLoading}
          >
            <Switch>
              <Match when={!loadingState.isLoading}>
                <span>Delete Property</span>
              </Match>
              <Match when={loadingState.isLoading}>
                <span className="loading loading-bars loading-sm"></span>
              </Match>
            </Switch>
          </button>
        </div>
      </form>
    );
  };

  return (
    <>
      <MetaTitle title="Seller" />

      <RouteProtection>
        <BuyerLimitation>
          <Container show_navbar_2={false}>
            <Suspense fallback={<Spinner />}>
              <div className="breadcrumbs text-sm">
                <ul>
                  <li>
                    <a className="link text-primary" href="/">
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      className="link text-primary"
                      href="/seller?tab=products"
                    >
                      Seller Console
                    </a>
                  </li>
                  <li>{params.product_id}</li>
                </ul>
              </div>

              <Switch>
                <Match when={sellerProduct()}>
                  <div className="my-2">
                    <div className="card bg-base-100 w-full sm:w-96 md:w-[48rem] lg:w-full shadow-sm border border-gray-100 mb-8">
                      <div className="card-body">
                        <h2 className="card-title flex justify-between items-center">
                          <span>Product Information</span>
                          <button
                            className="btn btn-sm btn-error"
                            onClick={confirmPrompt}
                          >
                            Delete Product
                          </button>
                        </h2>

                        <div className="divider p-0 m-0" />

                        <div className="avatar">
                          <div className="w-full rounded">
                            <img
                              src={
                                sellerProduct()?.image ||
                                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                              }
                            />
                          </div>
                        </div>

                        <div className="divider p-0 m-0" />

                        <form onSubmit={handleUpdate}>
                          <div className="grid grid-cols-6 gap-6 mb-4">
                            <div className="col-span-6 sm:col-span-3">
                              <label
                                htmlFor="ProductName"
                                className="block text-sm font-medium "
                              >
                                {" "}
                                Product Name{" "}
                              </label>

                              <input
                                id="ProductName"
                                type="text"
                                name="name"
                                value={sellerProduct().name}
                                onInput={handleChange}
                                className="mt-1 input input-md input-bordered w-full text-sm shadow-sm"
                              />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                              <label
                                htmlFor="Price"
                                className="block text-sm font-medium "
                              >
                                {" "}
                                Price ($){" "}
                              </label>

                              <input
                                id="Price"
                                type="number"
                                name="price"
                                value={sellerProduct().price}
                                onInput={handleChange}
                                className="mt-1 input input-md input-bordered w-full text-sm shadow-sm"
                              />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                              <label
                                htmlFor="Stock"
                                className="block text-sm font-medium "
                              >
                                Stock
                              </label>

                              <input
                                id="Stock"
                                type="number"
                                name="stock"
                                value={sellerProduct().stock}
                                onInput={handleChange}
                                className="mt-1 input input-md input-bordered w-full text-sm shadow-sm"
                              />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                              <label
                                htmlFor="Category"
                                className="block text-sm font-medium "
                              >
                                Category
                              </label>

                              <select
                                name="category_id"
                                onChange={handleChange}
                                defaultValue="Pick a category"
                                className="select select-md select-bordered w-full"
                              >
                                <For each={productCategories()}>
                                  {(item, index) => (
                                    <option
                                      key={index()}
                                      value={item.id}
                                      selected={
                                        sellerProduct().category.id === item.id
                                      }
                                    >
                                      {item.name}
                                    </option>
                                  )}
                                </For>
                              </select>
                            </div>

                            <div className="col-span-6">
                              <label
                                htmlFor="Image"
                                className="block text-sm font-medium "
                              >
                                Product Image
                              </label>

                              <input
                                id="Image"
                                type="file"
                                name="file"
                                accept="image/*"
                                onChange={handleChange}
                                className="mt-1 file-input file-input-md file-input-bordered w-full text-sm shadow-sm"
                              />
                            </div>

                            <div className="col-span-6">
                              <label
                                htmlFor="ProductDescription"
                                className="block text-sm font-medium "
                              >
                                {" "}
                                Product Description{" "}
                              </label>

                              <Editor
                                value={sellerProduct().description || ""}
                                onUpdate={(html) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    description: html,
                                  }))
                                }
                                placeholder="Product description..."
                              />
                            </div>
                          </div>

                          <div className="card-actions justify-end">
                            <button
                              type="submit"
                              className="btn btn-primary"
                              disabled={loadingState.isLoading}
                            >
                              <Switch>
                                <Match when={!loadingState.isLoading}>
                                  <span>Save Changes</span>
                                </Match>
                                <Match when={loadingState.isLoading}>
                                  <span className="loading loading-bars loading-sm"></span>
                                </Match>
                              </Switch>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </Match>
                <Match when={!sellerProduct()}>
                  <div className="my-2">
                    <Error />
                  </div>
                </Match>
              </Switch>
            </Suspense>
          </Container>
        </BuyerLimitation>
      </RouteProtection>
    </>
  );
}
