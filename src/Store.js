import { createStore } from "solid-js/store";
const [store, setStore] = createStore({ mode: "navigation" });

export { store, setStore }