import Cookies from "js-cookie";
import { createStore } from "solid-js/store";
import toast from "solid-toast";

const [authState, setAuthState] = createStore({
  isAuthenticated: !!Cookies.get("session"),
});

const [userInfo, setUserInfo] = createStore({
  is_artist: Cookies.get("is_artist"),
});

const login = (token, is_artist = false) => {
  logout();

  Cookies.set("session", token, { expires: 3 });
  Cookies.set("is_artist", (is_artist = is_artist ? "Yes" : "No"), {
    expires: 3,
  });

  setAuthState({ isAuthenticated: true });
};

const logout = () => {
  setAuthState({ isAuthenticated: false });

  Cookies.remove("csrftoken");
  Cookies.remove("session");
  Cookies.remove("is_artist");
  Cookies.remove("sessionid");
};

export { userInfo, authState, login, logout };
