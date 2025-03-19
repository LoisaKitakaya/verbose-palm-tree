import toast from "solid-toast";
import { createSignal } from "solid-js";
import image from "../../assets/img/auth_image.jpg";
import { backendAPI } from "../../lib/utils/secrets";
import MetaTitle from "../../components/meta/meta-title";
import { getErrorMessage } from "../../lib/utils/responses";
import { useNavigate, useSearchParams } from "@solidjs/router";
// import logo from "../../assets/logos/casaflex_dark_4_no_bg.png";
// import logo2 from "../../assets/logos/casaflex_light_4_no_bg.png";
import {
  loadingState,
  startLoading,
  stopLoading,
} from "../../lib/store/loading_store";

const signupUser = async (data, verification_token) => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  const url = `${backendAPI}/api/v1/auth/account?verification_token=${verification_token}`;

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

export default function CreateAccount() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [formData, setFormData] = createSignal({
    username: "",
    role: false,
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData(), [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    startLoading();

    try {
      const result = await signupUser(
        {
          username: formData().username,
          is_artist: formData().role,
          password: formData().password,
          confirm_password: formData().confirmPassword,
        },
        searchParams.verification_token
      );

      if (result.status && result.status >= 400) {
        toast.error(result.message);
      } else {
        toast.success(result?.message);

        navigate("/auth/sign-in");
      }
    } catch (error) {
      toast.error(
        `An unexpected error occurred: ${error}. Please try again later.`
      );
    } finally {
      stopLoading();
    }
  };

  const [isPasswordVisible, setPasswordVisible] = createSignal(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible());
  };

  return (
    <>
      <MetaTitle title="Reset Password" />

      <section className="bg-white">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
          <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
            <img
              alt="auth image"
              src={image}
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />

            <div className="hidden lg:relative lg:block lg:p-12">
              <a className="block text-white" href="/">
                <span className="sr-only">Home</span>
                <img
                  src={
                    "https://i.pinimg.com/736x/3c/07/40/3c0740017fa1c2ca4b529179ef1ffb08.jpg"
                  }
                  alt="app logo"
                  className="w-1/4"
                />
              </a>

              <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                Welcome to Uranium Glass
              </h2>

              <p className="mt-4 leading-relaxed text-white/90">
                Uranium glass marketplace.
              </p>
            </div>
          </section>

          <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
            <div className="max-w-xl lg:max-w-3xl">
              <div className="relative -mt-16 block lg:hidden">
                <a
                  className="inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20"
                  href="/"
                >
                  <span className="sr-only">Home</span>
                  <img
                    src={`https://i.pinimg.com/736x/3c/07/40/3c0740017fa1c2ca4b529179ef1ffb08.jpg`}
                    alt="app logo"
                    className="w-full"
                  />
                </a>

                <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                  Welcome to Uranium Glass
                </h1>

                <p className="mt-4 leading-relaxed text-gray-500">
                  Uranium glass marketplace.
                </p>
              </div>

              <h2 className="font-semibold text-lg mt-8 lg:mt-8">
                Create new account
              </h2>

              <form
                onSubmit={handleSubmit}
                className="mt-8 grid grid-cols-6 gap-6"
              >
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="Username"
                    className="block text-sm font-medium "
                  >
                    Username
                  </label>

                  <input
                    type="text"
                    id="Username"
                    name="username"
                    onInput={handleChange}
                    value={formData().username}
                    className="mt-1 input input-md input-bordered w-full text-sm shadow-sm"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="Role" className="block text-sm font-medium ">
                    Role
                  </label>

                  <select
                    defaultValue="Role"
                    className="mt-1 select select-md select-bordered w-full text-sm shadow-sm"
                    id="Role"
                    name="role"
                    onChange={handleChange}
                  >
                    <option disabled={true}>Role</option>
                    <option value={true}>Artist</option>
                    <option value={false}>Buyer</option>
                  </select>
                </div>

                <div className="col-span-6">
                  <label
                    htmlFor="Password"
                    className="block text-sm font-medium "
                  >
                    {" "}
                    Password{" "}
                  </label>

                  <input
                    type={!isPasswordVisible() ? "password" : "text"}
                    id="Password"
                    name="password"
                    onInput={handleChange}
                    value={formData().password}
                    className="mt-1 input input-md input-bordered w-full text-sm shadow-sm"
                  />
                </div>

                <div className="col-span-6">
                  <label
                    htmlFor="PasswordConfirmation"
                    className="block text-sm font-medium "
                  >
                    Password Confirmation
                  </label>

                  <input
                    type={!isPasswordVisible() ? "password" : "text"}
                    id="PasswordConfirmation"
                    name="confirmPassword"
                    onInput={handleChange}
                    value={formData().confirmPassword}
                    className="mt-1 input input-md input-bordered w-full text-sm shadow-sm"
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="MarketingAccept" className="flex gap-4">
                    <input
                      type="checkbox"
                      id="ShowPassword"
                      name="showPassword"
                      onChange={togglePasswordVisibility}
                      className="checkbox"
                    />

                    <span className="text-sm ">Show password</span>
                  </label>
                </div>

                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={loadingState.isLoading}
                  >
                    <Switch>
                      <Match when={!loadingState.isLoading}>
                        <span>Create Account</span>
                      </Match>
                      <Match when={loadingState.isLoading}>
                        <span className="loading loading-bars loading-sm"></span>
                      </Match>
                    </Switch>
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </section>
    </>
  );
}
