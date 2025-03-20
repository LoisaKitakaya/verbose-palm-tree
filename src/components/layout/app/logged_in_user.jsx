import Cookies from "js-cookie";
import { backendAPI } from "../../../lib/utils/secrets";
import { getErrorMessage } from "../../../lib/utils/responses";
import { createEffect, createResource, Match, Show, Switch } from "solid-js";
import { getInitialsOne } from "../../../lib/utils/initials";
import { authState } from "../../../lib/store/auth_store";

const fetchUserData = async () => {
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

export default function LoggedInUser(props) {
  const [user] = createResource(fetchUserData);

  // createEffect(() => {
  //   console.log(user());
  // });

  const fullName = () => {
    const firstName = user()?.first_name || user()?.user?.first_name;
    const lastName = user()?.last_name || user()?.user?.last_name;
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    return null;
  };

  return (
    <>
      <Switch>
        <Match when={user() && authState.isAuthenticated}>
          <div className="px-2 py-1 bg-info rounded hidden lg:block">
            <p className="font-semibold text-sm">
              {fullName() || "USER'S NAME"}
            </p>
          </div>

          {/* For small screens, show initials */}
          <div className="px-2 py-1 bg-info rounded lg:hidden">
            <p className="font-semibold text-sm">
              <Show when={fullName()} fallback="UN">
                {() => {
                  const name = fullName();
                  try {
                    return getInitialsOne(name);
                  } catch (error) {
                    return name.slice(0, 2).toUpperCase();
                  }
                }}
              </Show>
            </p>
          </div>
        </Match>
        <Match when={!user() && !authState.isAuthenticated}>
          <div className="px-2 py-1 bg-info rounded hidden lg:block">
            <p className="font-semibold text-sm">USER'S NAME</p>
          </div>

          <div className="px-2 py-1 bg-info rounded lg:hidden">
            <p className="font-semibold text-sm">UN</p>
          </div>
        </Match>
      </Switch>
    </>
  );
}
