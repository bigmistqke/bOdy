import { createEffect } from "solid-js";
import { setStore, store } from "../Store";
import { panel } from "../styles";
import s from "./TextInput.module.css";

const TextInput = (props) => {
  let ref;

  const onInput = ({ target: { value } }) => {
    update(value);
    setStore("text", value);
  };

  const update = (value) => {
    ref.dataset.replicatedValue = value;
  };

  createEffect(() => update(store.text));

  return (
    <div class={`${panel} bg-gray-100 p-2 pointer-events-auto w-full mt-auto`}>
      <div class="flex h-full flex-col">
        <div
          ref={ref}
          class={`${s.container} font-mono flex-1 text-xs`}
          style={{
            "max-height": "150px",
          }}
        >
          <textarea
            onInput={onInput}
            onFocus={() => setStore("isTextFocused", true)}
            onBlur={() => setStore("isTextFocused", false)}
            value={store.text || ""}
            spellCheck="false"
            class="pl-2 p-1 hover:text-gray-700 text-gray-500 focus:text-gray-700 border-gray-200 border-2 focus:outline-none rounded-md"
            style={{
              "max-height": `calc(${props.maxHeight} - 1em)` ?? null,
            }}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default TextInput;
