import { createEffect, For, Show } from "solid-js"
import { createUniqueId } from "solid-js"
import { createStore, unwrap } from "solid-js/store"
import { dirty } from "../actions.js"
import { MorphsDictionaryNode } from "../helpers/helpers.js"
import { store } from "../Store"
import { header, panel } from "../styles.js"

const Slider = (props: {
  area: string
  targets: number[]
  morph: MorphsDictionaryNode
}) => {
  const id = createUniqueId()
  const targets = unwrap(props.targets)
  const [morph, setMorph] = createStore(props.morph)

  const update = () => {
    if (morph.value < 0) {
      targets[morph.types.thin] = Math.abs(+morph.value)
      targets[morph.types.thick] = 0
    } else {
      targets[morph.types.thin] = 0
      targets[morph.types.thick] = +morph.value
    }
    dirty()
  }

  createEffect(update)

  return (
    <div class="flex items-baseline text-gray-500 hover:text-gray-700">
      <label class="text-xs select-none w-16 font-mono " for={id}>
        {props.area.split("_").join(" ")}
      </label>
      <input
        id={id}
        type="range"
        min="-2"
        max="2"
        step="0.01"
        value={morph.value}
        class="slider flex-1"
        onInput={(e) => setMorph("value", +e.currentTarget.value)}
      />
    </div>
  )
}

const Sliders = () => {
  return (
    <div class={"flex-1" + panel}>
      <h3 class={header}>morphs</h3>
      <div class="p-2 pr-3 pl-3">
        <For
          each={store.morphs ? Object.entries(store.morphs?.dictionary) : []}
        >
          {([area, morph]) => (
            <Slider
              targets={store.morphs?.targets || []}
              area={area}
              morph={morph}
            />
          )}
        </For>
      </div>
    </div>
  )
}

export default Sliders
