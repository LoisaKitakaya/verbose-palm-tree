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
  const [searchParams, setSearchParams] = useSearchParams();

  const [sellerProducts, { refetch }] = createResource(fetchSellerProducts);

  const [productCategories] = createResource(fetchProductCategories);

  const [userOrders, { refetch: refetchOrders }] =
    createResource(fetchSellerOrders);

  onMount(() => {
    if (!searchParams.tab) {
      setSearchParams({ tab: "products" });
    }
  });

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

  const changeTab = (name) => {
    setSearchParams({ tab: name });
  };

  const createProduct = () => {
    openModal(
      "Create New Product",
      <CreateProduct data={productCategories} refetch={refetch} />
    );
  };

  return (
    <>
      <MetaTitle title="Seller" />

      <RouteProtection>
        <BuyerLimitation>
          <Container show_navbar_2={false}>
            <div className="breadcrumbs text-sm">
              <ul>
                <li>
                  <a className="link text-primary" href="/">
                    Home
                  </a>
                </li>
                <li>Seller Console</li>
              </ul>
            </div>

            <div
              shipping_status="tablist"
              className="tabs tabs-sm tabs-boxed flex gap-4 w-full justify-center"
            >
              <a
                shipping_status="tab"
                className={`tab ${
                  searchParams.tab === "products" ? "tab-active" : ""
                }`}
                onClick={() => changeTab("products")}
              >
                All Products
              </a>
              <a
                shipping_status="tab"
                className={`tab ${
                  searchParams.tab === "orders" ? "tab-active" : ""
                }`}
                onClick={() => changeTab("orders")}
              >
                Orders
              </a>
            </div>

            <Switch>
              <Match when={searchParams.tab === "products"}>
                <div className="m-2">
                  <Switch>
                    <Match
                      when={sellerProducts() && sellerProducts().length > 0}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm">
                          <strong>Product Count:</strong>{" "}
                          {sellerProducts().length}
                        </span>
                        <button className="btn btn-sm" onClick={createProduct}>
                          Add Product
                        </button>
                      </div>

                      <div className="divider p-0 m-0" />

                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4 w-full mx-auto">
                        <For each={sellerProducts()}>
                          {(item) => (
                            <div key={item.id}>
                              <a
                                href={`/seller/product/${item.id}`}
                                className="group block overflow-hidden rounded hover:rounded shadow-sm hover:shadow"
                              >
                                <img
                                  src={
                                    item.image ||
                                    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                                  }
                                  alt={item.slug}
                                  className="h-[300px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[400px]"
                                />
                                <div className="relative bg-white p-3">
                                  <h3 className="group-hover:underline group-hover:underline-offset-4">
                                    {item.name}
                                  </h3>
                                </div>
                              </a>
                            </div>
                          )}
                        </For>
                      </div>
                    </Match>
                    <Match
                      when={sellerProducts() && sellerProducts().length === 0}
                    >
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
              </Match>
              <Match when={searchParams.tab === "orders"}>
                <div className="m-2">
                  <Switch>
                    <Match
                      when={userOrders() && userOrders().orders.length > 0}
                    >
                      <div className="flex justify-end items-center">
                        <div className="form-control">
                          <label className="label cursor-pointer gap-2">
                            <span className="label-text">Edit</span>
                            <label
                              htmlFor="AcceptConditions"
                              className="relative inline-block h-8 w-12 cursor-pointer [-webkit-tap-highlight-color:_transparent]"
                            >
                              <input
                                type="checkbox"
                                id="AcceptConditions"
                                className="peer sr-only"
                                checked={editMode()}
                                onChange={handleEditMode}
                              />

                              <span className="absolute inset-0 m-auto h-2 rounded-full bg-gray-300"></span>

                              <span className="absolute inset-y-0 start-0 m-auto size-6 rounded-full bg-gray-500 transition-all peer-checked:start-6 peer-checked:[&_>_*]:scale-0">
                                <span className="absolute inset-0 m-auto size-4 rounded-full bg-gray-200 transition">
                                  {" "}
                                </span>
                              </span>
                            </label>
                          </label>
                        </div>
                      </div>

                      <div className="divider p-0 m-0" />

                      <div className="overflow-x-auto">
                        <table className="table table-sm">
                          {/* head */}
                          <thead>
                            <tr>
                              <th></th>
                              <th>Payment Status</th>
                              <th>Shipping Status</th>
                              <th>Total Price</th>
                              <th>Items</th>
                            </tr>
                          </thead>
                          <tbody>
                            <For each={userOrders().orders}>
                              {(item, index) => (
                                <tr key={item.id}>
                                  <th>{index() + 1}</th>
                                  <td>
                                    {() => {
                                      switch (item.payment_status) {
                                        case "paid":
                                          return (
                                            <div className="badge badge-success">
                                              Paid
                                            </div>
                                          );
                                        case "not_paid":
                                          return (
                                            <div className="badge badge-error">
                                              Not Paid
                                            </div>
                                          );
                                      }
                                    }}
                                  </td>
                                  <td>
                                    <Switch>
                                      <Match when={!editMode()}>
                                        {() => {
                                          switch (item.shipping_status) {
                                            case "shipped":
                                              return (
                                                <div className="badge badge-success">
                                                  Shipped
                                                </div>
                                              );
                                            case "pending":
                                              return (
                                                <div className="badge">
                                                  Pending
                                                </div>
                                              );
                                            case "processing":
                                              return (
                                                <div className="badge">
                                                  Processing
                                                </div>
                                              );
                                            case "delivered":
                                              return (
                                                <div className="badge">
                                                  Delivered
                                                </div>
                                              );
                                            case "canceled":
                                              return (
                                                <div className="badge">
                                                  Canceled
                                                </div>
                                              );
                                          }
                                        }}
                                      </Match>
                                      <Match when={editMode()}>
                                        <div>
                                          <select
                                            name="shipping_status"
                                            className="select select-sm text-xs select-bordered w-full"
                                            value={item?.shipping_status}
                                            onChange={(e) =>
                                              handleSubmit(e, item.id)
                                            }
                                          >
                                            <option
                                              value="pending"
                                              selected={
                                                item?.shipping_status ===
                                                "pending"
                                              }
                                            >
                                              Pending
                                            </option>
                                            <option
                                              value="processing"
                                              selected={
                                                item?.shipping_status ===
                                                "processing"
                                              }
                                            >
                                              Processing
                                            </option>
                                            <option
                                              value="shipped"
                                              selected={
                                                item?.shipping_status ===
                                                "shipped"
                                              }
                                            >
                                              Shipped
                                            </option>
                                            <option
                                              value="delivered"
                                              selected={
                                                item?.shipping_status ===
                                                "delivered"
                                              }
                                            >
                                              Delivered
                                            </option>
                                            <option
                                              value="canceled"
                                              selected={
                                                item?.shipping_status ===
                                                "canceled"
                                              }
                                            >
                                              Canceled
                                            </option>
                                          </select>
                                        </div>
                                      </Match>
                                    </Switch>
                                  </td>
                                  <td>$ {item.total_price.toLocaleString()}</td>
                                  <td>
                                    <ul>
                                      <For each={item.items}>
                                        {(item, index) => (
                                          <li key={item.product_id}>
                                            <strong>{index() + 1}.</strong>{" "}
                                            <strong>Name:</strong> {item.name} -{" "}
                                            <strong>Quantity:</strong>{" "}
                                            {item.quantity} -{" "}
                                            <strong>Price:</strong> $
                                            {item.price.toLocaleString()}
                                          </li>
                                        )}
                                      </For>
                                    </ul>
                                  </td>
                                </tr>
                              )}
                            </For>
                          </tbody>
                        </table>
                      </div>
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
          </Container>
        </BuyerLimitation>
      </RouteProtection>
    </>
  );
}
