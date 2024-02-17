import clsx from 'clsx'
import { createEffect, createUniqueId, For, JSX } from 'solid-js'
import { createStore, unwrap } from 'solid-js/store'

import { dirty } from '../actions.js'
import { MorphsDictionaryNode } from '../helpers/helpers.js'
import { store } from '../Store'
import { header, panel } from '../styles.js'

import styles from './Sliders.module.css'

const Slider = (props: { area: string; morph: MorphsDictionaryNode }) => {
  const id = createUniqueId()
  const targets = unwrap(store.morphs.targets)
  const [morph, setMorph] = createStore(props.morph)
  const update = () => {
    if (morph.value < 0) {
      targets[morph.types._thin] = Math.abs(+morph.value)
      targets[morph.types._thick] = 0
    } else {
      targets[morph.types._thin] = 0
      targets[morph.types._thick] = +morph.value
    }
    dirty()
  }

  createEffect(update)

  return (
    <div class="flex items-baseline gap-10 text-gray-500 hover:text-gray-700">
      <label class="text-xs select-none w-16 font-mono" for={id}>
        {props.area.split('_').join(' ')}
      </label>
      <input
        id={id}
        type="range"
        min="-2"
        max="2"
        step="0.01"
        value={morph.value}
        class="slider flex-1"
        onInput={e => setMorph('value', +e.currentTarget.value)}
      />
    </div>
  )
}

const Sliders = (props: { style?: JSX.CSSProperties }) => {
  return (
    <div class={'flex-1 ' + panel} style={props.style}>
      <h3 class={header}>morphs</h3>
      <div class={clsx('p-2 pr-3 pl-3 flex gap-1 flex-col', styles.sliders)}>
        <For each={store.morphs ? Object.entries(store.morphs?.dictionary) : []}>
          {([area, morph]) => <Slider area={area} morph={morph} />}
        </For>
      </div>
    </div>
  )
}

export default Sliders
