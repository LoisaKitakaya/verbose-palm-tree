import { createStore } from "solid-js/store";

const [globalModal, setGlobalModal] = createStore({
  title: null,
  content: null,
  modalId: "global_modal",
});

const openModal = (title, content) => {
  setGlobalModal({ title, content });

  document.getElementById(globalModal.modalId).showModal();
};

const closeModal = () => {
  setGlobalModal({ title: null, content: null });

  document.getElementById(globalModal.modalId).close();
};

export { globalModal, openModal, closeModal };
