import toast from "solid-toast";
import Cookies from "js-cookie";
import { backendAPI } from "../../lib/utils/secrets";
import { createSignal, Match, Switch } from "solid-js";
import { closeModal } from "../../lib/store/modal_store";
import { getErrorMessage } from "../../lib/utils/responses";
import {
  loadingState,
  startLoading,
  stopLoading,
} from "../../lib/store/loading_store";

const createStore = async (data) => {
  const token = Cookies.get("session");

  if (!token) {
    throw new Error("Session token is missing. Please log in.");
  }

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  };

  const url = `${backendAPI}/api/v1/auth/profile`;

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

export default function CreateStore(props) {
  const [formData, setFormData] = createSignal({
    store_name: null,
    about: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData(), [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    startLoading();

    try {
      const result = await createStore({
        store_name: formData().store_name,
        about: formData().about,
      });

      if (result.status && result.status >= 400) {
        toast.error(result.message);
      } else {
        toast.success("store created successfully");

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
            <span className="label-text text-sm">Store Name</span>
          </div>
          <input
            required
            type="text"
            name="store_name"
            value={formData().store_name}
            onInput={handleChange}
            placeholder="Store Name"
            className="input input-bordered w-full"
          />
        </label>

        <label className="form-control w-full mb-2">
          <div className="label">
            <span className="label-text text-sm">About</span>
          </div>
          <textarea
            required
            name="about"
            placeholder="About"
            onInput={handleChange}
            value={formData().about}
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
