import { For, Match, Show, Switch, batch, createSignal } from 'solid-js'
import { setStore, store } from '../Store'
import { header, panel } from '../styles'

const Layer = (props: { node: THREE.Object3D; margin: number }) => {
  const [collapsed, setCollapsed] = createSignal(false)

  return (
    <div class="whitespace-nowrap" style={{ 'margin-left': '0.25em' }}>
      <Switch fallback={<div class="w-3 inline-block" />}>
        <Match when={props.node.children.length > 0}>
          <button
            class="hover:bg-gray-200 bg-white w-3 text-gray-500 inline-block align-center rounded-md"
            onClick={() => setCollapsed(c => !c)}
            innerHTML={collapsed() ? '+' : '–'}
          />
        </Match>
      </Switch>

      <button
        class={`active:bg-gray-100 pl-1 pr-1 pt-1 rounded-md ${
          store.selectedNode && store.selectedNode.name === props.node.name
            ? ' bg-gray-200 text-gray-700'
            : 'hover:bg-gray-200 hover:text-gray-700'
        }`}
        onClick={() => {
          batch(() => {
            setStore('selectedNode', store.selectedNode !== props.node ? props.node : false)
          })
        }}
        innerHTML={props.node.name}
      />

      <div class={collapsed() ? 'hidden' : ''}>
        <For each={props.node.children}>
          {node => <Layer node={node} margin={props.margin + 1} />}
        </For>
      </div>
    </div>
  )
}

const Hierarchy = () => {
  return (
    <div class={'flex-1 w-full ' + panel}>
      <h3 class={header}>hierarchy</h3>
      <Show when={store.skeleton}>
        <div class="font-mono text-xs overflow-auto text-gray-500 p-2">
          <For each={store.skeleton!.children}>{child => <Layer node={child} margin={0} />}</For>
        </div>
      </Show>
    </div>
  )
}
export default Hierarchy
