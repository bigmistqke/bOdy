import { JSXElement, onMount } from 'solid-js'
import { setStore } from '../Store'

import { fetchEntries, loadModel } from '../helpers/helpers'

import { dirty } from '../actions'
import Archive from '../components/Archive'
import Default from '../components/Default'
import Export from '../components/Export'
import Hierarchy from '../components/Hierarchy'
import Import from '../components/Import'
import { LogOut } from '../components/LogOut'
import Save from '../components/Save'
import Sliders from '../components/Sliders'
import TextInput from '../components/TextInput'
import ThreeScene from '../components/ThreeScene'
import { addLoadedModelToScene } from '../components/threeActions'

const PanelContainer = (props: { class: string; children: JSXElement | JSXElement[] }) => (
  <div class={'gap-1 box-border h-full z-10 flex flex-col ' + props.class}>{props.children}</div>
)

const Editor = () => {
  onMount(async () => {
    const [model, entries] = await Promise.all([loadModel(), fetchEntries()])

    addLoadedModelToScene(model)
    if (entries) {
      setStore('entries', entries)
    }

    setTimeout(() => {
      model.visible = true
      dirty()
    }, 500)
  })

  return (
    <div class="h-full text-gray-600">
      <ThreeScene />
      <div class="flex items-end h-full overflow-hidden p-1 gap-1">
        <PanelContainer class="right-0 items-end w-52 ">
          <Default />
          <Sliders style={{ 'max-height': '40vh' }} />
          <Hierarchy />
        </PanelContainer>
        <PanelContainer class="flex-1 flex items-end pointer-events-none">
          <TextInput maxHeight={250} />
        </PanelContainer>
        <PanelContainer class="left-0 w-72">
          <div class="flex w-full gap-1">
            <Save />
            <Import />
            <Export />
            <LogOut />
          </div>
          <Archive />
        </PanelContainer>
      </div>
    </div>
  )
}

export default Editor
