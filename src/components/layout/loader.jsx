import { Show } from "solid-js";
import { loadingState } from "../../lib/store/loading_store";

export default function Loader() {
  return (
    <Show when={loadingState.isLoading}>
      <div className="loader fixed top-0 w-full h-1 bg-white/15 overflow-hidden z-[100]">
        <div
          className="loader-bar absolute top-0 left-0 h-1 bg-[#3b82f6] transition-all duration-300"
          style={{ width: `${loadingState.progress}%` }}
        ></div>
      </div>
    </Show>
  );
}
