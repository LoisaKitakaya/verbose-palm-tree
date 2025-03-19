import { onMount, Show } from "solid-js";
import { Toaster } from "solid-toast";
import Loader from "./components/layout/loader";
import Modal from "./components/layout/modal/modal";
import { loadingState } from "./lib/store/loading_store";
import { favoritesStore } from "./lib/store/favorite_store";
import { checkoutStore } from "./lib/store/checkout_store";
import { authState } from "./lib/store/auth_store";

const App = (props) => {
  onMount(() => {
    if (authState.isAuthenticated) {
      favoritesStore.syncWithServer();
      checkoutStore.syncWithLocalStorage();
    }
  });

  return (
    <>
      <Show when={loadingState}>
        <Loader />
      </Show>

      {props.children}

      <Toaster position="top-center" />

      <Modal />
    </>
  );
};

export default App;
