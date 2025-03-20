import Cookies from "js-cookie";
import { useSearchParams } from "@solidjs/router";
import {
  createResource,
  createSignal,
  For,
  Match,
  onMount,
  Switch,
} from "solid-js";
import { backendAPI } from "../../lib/utils/secrets";
import MetaTitle from "../../components/meta/meta-title";
import { getErrorMessage } from "../../lib/utils/responses";
import Container from "../../components/layout/app/container";
import BuyerLimitation from "../../components/auth/buyer_limitation";
import RouteProtection from "../../components/auth/route_protection";
import { openModal } from "../../lib/store/modal_store";
import CreateProduct from "../../components/seller/create_product";
import { startLoading, stopLoading } from "../../lib/store/loading_store";
import toast from "solid-toast";

const fetchSellerProducts = async () => {
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

  const url = `${backendAPI}/api/v1/store/products/seller`;

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

const updateOrder = async (order_id, data) => {
  const token = Cookies.get("session");

  if (!token) {
    throw new Error("Session token is missing. Please log in.");
  }

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  };

  const url = `${backendAPI}/api/v1/orders/user-orders/${order_id}`;

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

const fetchSellerOrders = async () => {
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

  const url = `${backendAPI}/api/v1/orders/seller-orders`;

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

export default function Seller() {
  const [sellerProducts, { refetch }] = createResource(fetchSellerProducts);

  const [productCategories] = createResource(fetchProductCategories);

  const [userOrders, { refetch: refetchOrders }] =
    createResource(fetchSellerOrders);

  const [editMode, setEditMode] = createSignal(false);

  const handleEditMode = () => {
    setEditMode(!editMode());
  };

  const [formData, setFormData] = createSignal({
    shipping_status: null,
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData(), [name]: value });
  };

  const handleSubmit = async (e, order_id) => {
    e.preventDefault();

    startLoading();

    handleChange(e);

    try {
      const result = await updateOrder(order_id, {
        shipping_status: formData().shipping_status,
      });

      if (result.status && result.status >= 400) {
        toast.error(result.message);
      } else {
        toast.success("order updated successfully");

        refetchOrders();
      }
    } catch (error) {
      toast.error(
        `An unexpected error occurred: ${error}. Please try again later.`
      );
    } finally {
      stopLoading();
    }
  };

  const createProduct = () => {
    openModal(
      "Create New Product",
      <CreateProduct data={productCategories} refetch={refetch} />
    );
  };

  return (
    <>
      <MetaTitle title="Products" />

      <RouteProtection>
        <BuyerLimitation>
          <Container>
            <div className="breadcrumbs text-sm">
              <ul>
                <li>
                  <a className="link text-primary" href="/">
                    Home
                  </a>
                </li>
                <li>Products</li>
              </ul>
            </div>

            <div className="m-2">
              <Switch>
                <Match when={sellerProducts() && sellerProducts().length > 0}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      <strong>Product Count:</strong> {sellerProducts().length}
                    </span>
                    <button
                      className="btn btn-sm btn-neutral"
                      onClick={createProduct}
                    >
                      Add Product
                    </button>
                  </div>

                  <div className="divider p-0 m-0" />

                  <div className="overflow-x-auto w-full mt-4">
                    <table className="table bg-base-100">
                      {/* head */}
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Product</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <For each={sellerProducts()}>
                          {(item, index) => (
                            <tr key={item.id}>
                              <th>{index() + 1}</th>
                              <td>
                                <div className="flex items-center gap-8">
                                  <div className="avatar">
                                    <div className="mask mask-squircle h-20 w-20">
                                      <img
                                        src={
                                          item.image ||
                                          "https://img.daisyui.com/images/profile/demo/2@94.webp"
                                        }
                                        alt="Avatar Tailwind CSS Component"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <div className="font-bold">{item.name}</div>
                                    {item.is_active ? (
                                      <span className="badge badge-success">
                                        Active
                                      </span>
                                    ) : (
                                      <span className="badge badge-warning">
                                        Inactive
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td>{item.category.name}</td>
                              <td>$ {item.price.toLocaleString()}</td>
                              <td>
                                <strong>{item.stock}</strong> pieces in Stock
                              </td>
                              <td>
                                <a
                                  href={`/store/products/${item.id}`}
                                  className="link text-primary"
                                >
                                  View
                                </a>
                              </td>
                            </tr>
                          )}
                        </For>
                      </tbody>
                    </table>
                  </div>
                </Match>
                <Match
                  when={sellerProducts() && sellerProducts().status === 404}
                >
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-2xl font-semibold text-center mt-40">
                      No store is associated with this account | Go to account
                      to create one.
                    </span>
                  </div>
                </Match>
                <Match when={sellerProducts() && sellerProducts().length === 0}>
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-2xl font-semibold text-center mt-40">
                      0 Products Units Found
                    </span>
                    <button className="btn btn-sm" onClick={createProduct}>
                      Add Product
                    </button>
                  </div>
                </Match>
              </Switch>
            </div>
          </Container>
        </BuyerLimitation>
      </RouteProtection>
    </>
  );
}
