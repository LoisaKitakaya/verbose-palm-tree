import { createStore } from "solid-js/store";

let intervalId;

const [loadingState, setLoadingState] = createStore({
  isLoading: false,
  progress: 0,
});

const startLoading = () => {
  setLoadingState({ isLoading: true, progress: 0 });
  intervalId = setInterval(() => {
    setLoadingState("progress", (prev) => (prev < 90 ? prev + 1 : prev));
  }, 80);
};

const stopLoading = () => {
  clearInterval(intervalId);
  setLoadingState("progress", 100);
  setTimeout(() => {
    setLoadingState({ isLoading: false, progress: 0 });
  }, 300);
};

export { loadingState, startLoading, stopLoading };
