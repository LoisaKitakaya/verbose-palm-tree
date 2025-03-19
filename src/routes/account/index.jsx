import Cookies from "js-cookie";
import Error from "../../components/layout/error";
import { useSearchParams } from "@solidjs/router";
import { backendAPI } from "../../lib/utils/secrets";
import Spinner from "../../components/layout/spinner";
import MetaTitle from "../../components/meta/meta-title";
import { getErrorMessage } from "../../lib/utils/responses";
import Container from "../../components/layout/app/container";
import RouteProtection from "../../components/auth/route_protection";
import {
  createEffect,
  createResource,
  createSignal,
  Match,
  onMount,
  Suspense,
  Switch,
} from "solid-js";
import Profile from "../../components/account/profile";

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

export default function Account() {
  const [user, { refetch }] = createResource(fetchUserData);

  // createEffect(() => {
  //   console.log(user());
  // });

  return (
    <>
      <MetaTitle title="Account" />

      <RouteProtection>
        <Container show_navbar_2={false}>
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <a className="link text-primary" href="/">
                  Home
                </a>
              </li>
              <li>Account</li>
            </ul>
          </div>
          <Suspense fallback={<Spinner />}>
            <Switch>
              <Match when={user()}>
                <div className="my-2">
                  <Profile data={user()} refetch={refetch} />
                </div>
              </Match>
              <Match when={!user()}>
                <Error />
              </Match>
            </Switch>
          </Suspense>
        </Container>
      </RouteProtection>
    </>
  );
}
