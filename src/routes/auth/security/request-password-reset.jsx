import toast from "solid-toast";
import { createSignal } from "solid-js";
import { backendAPI } from "../../../lib/utils/secrets";
import image from "../../../assets/img/auth_image.jpg";
import MetaTitle from "../../../components/meta/meta-title";
import { getErrorMessage } from "../../../lib/utils/responses";
import {
  loadingState,
  startLoading,
  stopLoading,
} from "../../../lib/store/loading_store";

const requestPasswordReset = async (data) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const url = `${backendAPI}/api/v1/auth/request-password-reset`;

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

export default function RequestPasswordReset() {
  const [formData, setFormData] = createSignal({
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData(), [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    startLoading();

    try {
      const result = await requestPasswordReset({
        email: formData().email,
      });

      if (result.status && result.status >= 400) {
        toast.error(result.message);
      } else {
        toast.success(result.message);
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
      <MetaTitle title="Request Password Reset" />

      <section className="bg-white">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
          <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
            <img
              src={image}
              alt="auth image"
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
                Mi Uranium Glass, Su Uranium Glass
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
                    src={
                      "https://i.pinimg.com/736x/3c/07/40/3c0740017fa1c2ca4b529179ef1ffb08.jpg"
                    }
                    alt="app logo"
                    className="w-full"
                  />
                </a>

                <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                  Mi Uranium Glass, Su Uranium Glass
                </h1>

                <p className="mt-4 leading-relaxed text-gray-500">
                  Uranium glass marketplace.
                </p>
              </div>

              <h2 className="font-semibold text-lg mt-8 lg:mt-8">Password Reset</h2>

              <form
                onSubmit={handleSubmit}
                className="mt-8 grid grid-cols-6 gap-6"
              >
                <div className="col-span-6">
                  <p className="text-sm text-gray-500">
                    A link to reset your account will be sent to your email
                    address.
                  </p>
                </div>

                <div className="col-span-6">
                  <label htmlFor="Email" className="block text-sm font-medium ">
                    {" "}
                    Email{" "}
                    <sup>
                      <span className="text-error">*</span>
                    </sup>
                  </label>

                  <input
                    type="email"
                    id="Email"
                    name="email"
                    onInput={handleChange}
                    value={formData().email}
                    className="mt-1 input input-md input-bordered w-full text-sm shadow-sm"
                  />
                </div>

                <div className="col-span-6">
                  <p className="text-sm text-gray-500">
                    Your personal data will be used to support your experience
                    throughout this website, to manage access to your account,
                    and for other purposes described in our{" "}
                    <a
                      href="/privacy-policy"
                      target="blank"
                      className=" underline"
                    >
                      privacy policy
                    </a>
                    and{" "}
                    <a
                      href="/terms-and-conditions"
                      target="blank"
                      className=" underline"
                    >
                      terms and conditions
                    </a>{" "}
                    and .
                  </p>
                </div>

                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={loadingState.isLoading}
                  >
                    <Switch>
                      <Match when={!loadingState.isLoading}>
                        <span>Submit</span>
                      </Match>
                      <Match when={loadingState.isLoading}>
                        <span className="loading loading-bars loading-sm"></span>
                      </Match>
                    </Switch>
                  </button>
                </div>

                <div className="col-span-6">
                  <p className="text-sm text-center text-gray-500 sm:mt-0">
                    Already have an account?{" "}
                    <a href="/auth/sign-in" className=" underline">
                      Log in
                    </a>
                    .
                  </p>
                </div>
              </form>
            </div>
          </main>
        </div>
      </section>
    </>
  );
}
