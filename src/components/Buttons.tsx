import { For, JSXElement } from 'solid-js'
import { setStore, store } from '../Store'

const Button = (props: {
  active: boolean
  onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
  children: JSXElement
}) => (
  <button
    class={`pointer-events-auto rounded-md p-1 ${props.active ? 'bg-gray-300' : ''}`}
    onClick={props.onClick}
  >
    {props.children}
  </button>
)

export const Buttons = () => {
  return (
    <div class="flex gap-2 text-xs">
      <div class="flex flex-col items-end font-mono gap-2">
        <For each={['world', 'local'] as const}>
          {space => (
            <Button
              active={store.transform.space === space}
              onClick={() => setStore('transform', 'space', space)}
            >
              {space}
            </Button>
          )}
        </For>
      </div>
      <div class="flex flex-col items-end font-mono gap-2">
        <For each={['translate', 'rotate', 'scale'] as const}>
          {mode => (
            <Button
              active={store.transform.mode === mode}
              onClick={() => setStore('transform', 'mode', mode)}
            >
              {mode}
            </Button>
          )}
        </For>
      </div>
    </div>
  )
}
