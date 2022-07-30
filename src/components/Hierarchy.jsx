import { Show } from "solid-js";
import { createSignal } from "solid-js";
import { createEffect } from "solid-js";
import { batch } from "solid-js";
import { Match } from "solid-js";
import { Switch } from "solid-js";
import { setStore, store } from "../Store";
import { header, panel } from "../styles";

const Layer = (props) => {
  const [collapsed, setCollapsed] = createSignal(false);

  return (
    <div class="whitespace-nowrap" style={{ "margin-left": "0.25em" }}>
      <Switch fallback={<div class="w-3 inline-block" />}>
        <Match when={props.node.children.length > 0}>
          <button
            class="hover:bg-gray-200 bg-white w-3 text-gray-500 inline-block align-center rounded-md"
            onClick={() => setCollapsed((c) => !c)}
            innerHTML={collapsed() ? "+" : "–"}
          />
        </Match>
      </Switch>

      <button
        class={`active:bg-gray-100 pl-1 pr-1 pt-1 rounded-md ${
          store.selectedNode?.name === props.node.name
            ? " bg-gray-200 text-gray-700"
            : "hover:bg-gray-200 hover:text-gray-700"
        }`}
        onClick={() => {
          batch(() => {
            setStore(
              "selectedNode",
              store.selectedNode !== props.node ? props.node : false
            );
          });
        }}
        innerHTML={props.node.name}
      />

      <div class={collapsed() ? "hidden" : ""}>
        <For each={props.node.children}>
          {(node) => <Layer node={node} margin={props.margin + 1} />}
        </For>
      </div>
    </div>
  );
};

const Hierarchy = () => {
  return (
    <div class={"flex-1 w-full " + panel}>
      <h3 class={header}>hierarchy</h3>
      <Show when={store.skeleton}>
        <div class="font-mono text-xs overflow-auto text-gray-500 p-2">
          <Layer node={store.skeleton.children[0]} margin={0} />
        </div>
      </Show>
    </div>
  );
};
export default Hierarchy;
