import toast from "solid-toast";
import Cookies from "js-cookie";
import { backendAPI } from "../../lib/utils/secrets";
import { createEffect, createSignal, For, Match, Switch } from "solid-js";
import { closeModal } from "../../lib/store/modal_store";
import { getErrorMessage } from "../../lib/utils/responses";
import {
  loadingState,
  startLoading,
  stopLoading,
} from "../../lib/store/loading_store";

const createProduct = async (data) => {
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

export default function CreateProduct(props) {
  const [data, setData] = createSignal();

  createEffect(() => {
    setData(props.data);
  }, props.data);

  const [formData, setFormData] = createSignal({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category_id: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    startLoading();

    try {
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
        })
      );

      const result = await createProduct(appForm);

      if (result.status && result.status >= 400) {
        toast.error(result.message);
      } else {
        toast.success("Product added successfully");

        props.refetch();

        closeModal();
      }
    } catch (error) {
      toast.error(
        `An unexpected error occurred: ${error}. Please try again later.`
      );
    } finally {
      stopLoading();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label className="form-control w-full mb-2">
          <div className="label">
            <span className="label-text text-sm">Product Name</span>
          </div>
          <input
            required
            type="text"
            name="name"
            value={formData().name}
            onInput={handleChange}
            placeholder="Product Name"
            className="input input-bordered w-full"
          />
        </label>

        <label className="form-control w-full mb-2">
          <div className="label">
            <span className="label-text text-sm">Price</span>
          </div>
          <input
            required
            type="number"
            name="price"
            value={formData().price}
            onInput={handleChange}
            placeholder="Price"
            className="input input-bordered w-full"
          />
        </label>

        <label className="form-control w-full mb-2">
          <div className="label">
            <span className="label-text text-sm">Stock</span>
          </div>
          <input
            required
            type="number"
            name="stock"
            value={formData().stock}
            onInput={handleChange}
            placeholder="Stock"
            className="input input-bordered w-full"
          />
        </label>

        <label className="form-control w-full mb-2">
          <div className="label">
            <span className="label-text text-sm">Category</span>
          </div>
          <select
            required
            name="category_id"
            onChange={handleChange}
            defaultValue="Pick a category"
            className="select select-bordered w-full"
          >
            <option disabled={true}>Pick a category</option>
            <For each={data()}>
              {(item, index) => (
                <option key={index()} value={item.id}>
                  {item.name}
                </option>
              )}
            </For>
          </select>
        </label>

        <label className="form-control w-full mb-2">
          <div className="label">
            <span className="label-text text-sm">Image</span>
          </div>
          <input
            required
            type="file"
            name="file"
            accept="image/*"
            onChange={handleChange}
            className="file-input file-input-bordered w-full"
          />
        </label>

        <label className="form-control w-full mb-2">
          <div className="label">
            <span className="label-text text-sm">Product Description</span>
          </div>
          <textarea
            required
            name="description"
            placeholder="Product Description"
            onInput={handleChange}
            value={formData().description}
            className="textarea textarea-bordered w-full"
          ></textarea>
        </label>

        <button
          type="submit"
          className="btn btn-primary w-full mt-2"
          disabled={loadingState.isLoading}
        >
          <Switch>
            <Match when={!loadingState.isLoading}>
              <span>Create</span>
            </Match>
            <Match when={loadingState.isLoading}>
              <span className="loading loading-bars loading-sm"></span>
            </Match>
          </Switch>
        </button>
      </form>
    </>
  );
}
