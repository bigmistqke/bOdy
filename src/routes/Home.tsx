import { JSXElement, onMount } from 'solid-js'
import { setStore } from '../Store'

import { fetchEntries, loadModel } from '../helpers/helpers'

import { dirty } from '../actions'
import Default from '../components/Default'
import Hierarchy from '../components/Hierarchy'
import Sliders from '../components/Sliders'
import ThreeScene from '../components/ThreeScene'
import { addLoadedModelToScene } from '../components/threeActions'

const PanelContainer = (props: { class: string; children: JSXElement | JSXElement[] }) => (
  <div class={'gap-1 box-border h-full z-10 flex flex-col ' + props.class}>{props.children}</div>
)

const Home = () => {
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
        <PanelContainer class="right-0 items-end w-64 ">
          <Default />
          <Sliders />
        </PanelContainer>
        <div class="flex-1 pointer-events-none" />
        <PanelContainer class="left-0 w-72">
          <Hierarchy />
        </PanelContainer>
      </div>
    </div>
  )
}

export default Home
