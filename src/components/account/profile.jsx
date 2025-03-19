import moment from "moment";
import toast from "solid-toast";
import Cookies from "js-cookie";
import CreateStore from "./create_store";
import { useNavigate } from "@solidjs/router";
import { backendAPI } from "../../lib/utils/secrets";
import { openModal } from "../../lib/store/modal_store";
import { getErrorMessage } from "../../lib/utils/responses";
import { logout, userInfo } from "../../lib/store/auth_store";
import { createEffect, createSignal, Match, Show, Switch } from "solid-js";
import {
  loadingState,
  startLoading,
  stopLoading,
} from "../../lib/store/loading_store";
import Editor from "../richtext/editor";

const updateProfile = async (data) => {
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

  const url = `${backendAPI}/api/v1/auth/account`;

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

const updateStore = async (data) => {
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

const profilePic = async (data) => {
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

  const url = `${backendAPI}/api/v1/auth/account/profile-pic`;

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

const bannerPic = async (data) => {
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

  const url = `${backendAPI}/api/v1/auth/profile/banner-pic`;

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

export default function Profile(props) {
  const navigate = useNavigate();

  const [data, setData] = createSignal();

  const [formData, setFormData] = createSignal({
    username: null,
    email: null,
    firstName: null,
    lastName: null,
    bio: null,
    website: null,
    store_name: null,
    about: null,
    file: null,
    stripe_secret_key: null,
  });

  createEffect(() => {
    setData(props.data);

    // console.log(data());
  }, props.data);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setFormData((prev) => ({ ...prev, file: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    startLoading();

    try {
      if (
        formData().username ||
        formData().email ||
        formData().firstName ||
        formData().lastName ||
        formData().bio ||
        formData().website
      ) {
        const result = await updateProfile({
          username: formData().username,
          email: formData().email,
          first_name: formData().firstName,
          last_name: formData().lastName,
          bio: formData().bio,
          website: formData().website,
        });

        if (result.status && result.status >= 400) {
          toast.error(result.message);
        } else {
          toast.success("profile updated successfully");

          if (formData().username) {
            logout();

            props.refetch();

            navigate("/auth/sign-in");
          }

          props.refetch();
        }
      } else {
        toast.success("no changes detected");
      }
    } catch (error) {
      toast.error(
        `An unexpected error occurred: ${error}. Please try again later.`
      );
    } finally {
      stopLoading();
    }
  };

  const handleUpdateStore = async (e) => {
    e.preventDefault();

    startLoading();

    try {
      if (
        formData().store_name ||
        formData().about ||
        formData().stripe_secret_key
      ) {
        const result = await updateStore({
          store_name: formData().store_name,
          about: formData().about,
          stripe_secret_key: formData().stripe_secret_key,
        });

        if (result.status && result.status >= 400) {
          toast.error(result.message);
        } else {
          toast.success("store updated successfully");

          props.refetch();
        }
      } else {
        toast.success("no changes detected");
      }
    } catch (error) {
      toast.error(
        `An unexpected error occurred: ${error}. Please try again later.`
      );
    } finally {
      stopLoading();
    }
  };

  const handleUpdateProfilePic = async (e) => {
    e.preventDefault();

    startLoading();

    try {
      const appForm = new FormData();

      appForm.append("file", formData().file);
      //   appForm.append("data", JSON.stringify({}));

      const result = await profilePic(appForm);

      if (result.status && result.status >= 400) {
        toast.error(result.message);
      } else {
        toast.success("profile pic uploaded successfully");

        props.refetch();
      }
    } catch (error) {
      toast.error(
        `An unexpected error occurred: ${error}. Please try again later.`
      );
    } finally {
      stopLoading();
    }
  };

  const handleUpdateBannerPic = async (e) => {
    e.preventDefault();

    startLoading();

    try {
      const appForm = new FormData();

      appForm.append("file", formData().file);
      //   appForm.append("data", JSON.stringify({}));

      const result = await bannerPic(appForm);

      if (result.status && result.status >= 400) {
        toast.error(result.message);
      } else {
        toast.success("banner pic uploaded successfully");

        props.refetch();
      }
    } catch (error) {
      toast.error(
        `An unexpected error occurred: ${error}. Please try again later.`
      );
    } finally {
      stopLoading();
    }
  };

  const createStore = () => {
    openModal(
      "Create Store (Artist Account)",
      <CreateStore refetch={props.refetch} />
    );
  };

  const [isPasswordVisible, setPasswordVisible] = createSignal(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible());
  };

  return (
    <>
      <div className="card bg-base-100 w-full sm:w-96 md:w-[48rem] lg:w-full shadow-sm border border-gray-100 mb-8">
        <div className="card-body">
          <h2 className="card-title flex justify-between items-center">
            <span>Account Information</span>
            <div className="flex items-center gap-4">
              <Show when={!data()?.store_name && userInfo.is_artist === "Yes"}>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={createStore}
                >
                  Create Store (Artist Account)
                </button>
              </Show>
              <span className="badge badge-ghost">
                {data()?.is_artist || data()?.user?.is_artist
                  ? "Artist"
                  : "Buyer"}
              </span>
            </div>
          </h2>
          <div className="divider p-0 m-0" />

          <form
            onSubmit={handleUpdateProfilePic}
            className="flex flex-col gap-4 items-center"
          >
            <div className="avatar">
              <div className="w-40 rounded">
                <img
                  src={
                    data()?.profile_picture ||
                    data()?.user?.profile_picture ||
                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  }
                />
              </div>
            </div>

            <div className="join">
              <input
                type="file"
                name="file"
                accept="image/*"
                onChange={handleChange}
                className="file-input file-input-sm join-item"
              />
              <button
                type="submit"
                className="btn btn-sm join-item"
                disabled={loadingState.isLoading}
              >
                <Switch>
                  <Match when={!loadingState.isLoading}>
                    <span>Upload</span>
                  </Match>
                  <Match when={loadingState.isLoading}>
                    <span className="loading loading-bars loading-sm"></span>
                  </Match>
                </Switch>
              </button>
            </div>
          </form>

          <div className="divider p-0 m-0" />

          <form onSubmit={handleUpdateProfile}>
            <div className="grid grid-cols-6 gap-6 mb-4">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="Username"
                  className="block text-sm font-medium "
                >
                  {" "}
                  Username{" "}
                </label>

                <input
                  type="text"
                  id="Username"
                  name="username"
                  placeholder="Username"
                  onInput={handleChange}
                  value={data()?.username || data()?.user?.username || ""}
                  className="mt-1 input input-md input-bordered w-full text-sm shadow-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="Email" className="block text-sm font-medium ">
                  {" "}
                  Email{" "}
                </label>

                <input
                  type="email"
                  id="Email"
                  name="email"
                  placeholder="Email"
                  onInput={handleChange}
                  value={data()?.email || data()?.user?.email || ""}
                  className="mt-1 input input-md input-bordered w-full text-sm shadow-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="FirstName"
                  className="block text-sm font-medium "
                >
                  First Name
                </label>

                <input
                  type="text"
                  id="FirstName"
                  name="firstName"
                  placeholder="First Name"
                  onInput={handleChange}
                  value={data()?.first_name || data()?.user?.first_name || ""}
                  className="mt-1 input input-md input-bordered w-full text-sm shadow-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="LastName"
                  className="block text-sm font-medium "
                >
                  Last Name
                </label>

                <input
                  type="text"
                  id="LastName"
                  name="lastName"
                  placeholder="Last Name"
                  onInput={handleChange}
                  value={data()?.last_name || data()?.user?.last_name || ""}
                  className="mt-1 input input-md input-bordered w-full text-sm shadow-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="DateJoined"
                  className="block text-sm font-medium "
                >
                  {" "}
                  Date Joined{" "}
                </label>

                <div className="mt-1 input input-md input-bordered w-full text-sm shadow-sm pt-3">
                  {moment(
                    data()?.date_joined || data()?.user?.date_joined || ""
                  ).format("MMMM Do YYYY")}
                </div>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="Website" className="block text-sm font-medium ">
                  {" "}
                  Website{" "}
                </label>

                <input
                  type="text"
                  id="Website"
                  name="website"
                  placeholder="Website"
                  onInput={handleChange}
                  value={data()?.website || data()?.user?.website || ""}
                  className="mt-1 input input-md input-bordered w-full text-sm shadow-sm"
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="Bio" className="block text-sm font-medium ">
                  {" "}
                  Bio{" "}
                </label>

                <Editor
                  value={data()?.bio || data()?.user?.bio || ""}
                  onUpdate={(html) =>
                    setFormData((prev) => ({ ...prev, bio: html }))
                  }
                  placeholder="Enter your bio..."
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

      <Show when={data()?.store_name}>
        <div className="card bg-base-100 w-full sm:w-96 md:w-[48rem] lg:w-full shadow-sm border border-gray-100 mb-8">
          <div className="card-body">
            <h2 className="card-title flex justify-between items-center">
              <span>Store Information</span>
            </h2>
            <div className="divider p-0 m-0" />

            <form
              onSubmit={handleUpdateBannerPic}
              className="flex flex-col gap-4 items-center"
            >
              <div className="rounded">
                <img
                  src={
                    data()?.banner_image ||
                    "https://i.pinimg.com/736x/5e/65/c4/5e65c41080117f2145eecf66efe6fe84.jpg"
                  }
                />
              </div>

              <div className="join">
                <input
                  type="file"
                  name="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="file-input file-input-sm join-item"
                />
                <button
                  type="submit"
                  className="btn btn-sm join-item"
                  disabled={loadingState.isLoading}
                >
                  <Switch>
                    <Match when={!loadingState.isLoading}>
                      <span>Upload</span>
                    </Match>
                    <Match when={loadingState.isLoading}>
                      <span className="loading loading-bars loading-sm"></span>
                    </Match>
                  </Switch>
                </button>
              </div>
            </form>

            <div className="divider p-0 m-0" />

            <form onSubmit={handleUpdateStore}>
              <div className="grid grid-cols-6 gap-6 mb-4">
                <div className="col-span-6">
                  <label
                    htmlFor="StoreName"
                    className="block text-sm font-medium "
                  >
                    {" "}
                    Store Name{" "}
                  </label>

                  <input
                    type="text"
                    id="StoreName"
                    name="store_name"
                    placeholder="Store Name"
                    onInput={handleChange}
                    value={data()?.store_name || ""}
                    className="mt-1 input input-md input-bordered w-full text-sm shadow-sm"
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="About" className="block text-sm font-medium ">
                    {" "}
                    About{" "}
                  </label>

                  <Editor
                    value={data()?.about || data()?.user?.about || ""}
                    onUpdate={(html) =>
                      setFormData((prev) => ({ ...prev, about: html }))
                    }
                    placeholder="About your shop..."
                  />
                </div>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="StripeSecretKey"
                  className="block text-sm font-medium "
                >
                  Stripe Secret Key
                </label>

                <input
                  type={!isPasswordVisible() ? "password" : "text"}
                  id="StripeSecretKey"
                  name="stripe_secret_key"
                  placeholder="Stripe Secret Key"
                  onInput={handleChange}
                  value={
                    data().stripe_secret_key === null
                      ? ""
                      : data().stripe_secret_key
                  }
                  className="mt-1 input input-md input-bordered w-full text-sm shadow-sm"
                />
              </div>

              <label
                htmlFor="MarketingAccept"
                className="flex items-center gap-2 mt-2"
              >
                <input
                  type="checkbox"
                  id="ShowPassword"
                  name="showPassword"
                  onChange={togglePasswordVisibility}
                  className="checkbox"
                />

                <span className="text-sm ">Show Secret Key</span>
              </label>

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
      </Show>
    </>
  );
}
