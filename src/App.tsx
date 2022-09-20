import { JSX, JSXElement, onMount } from "solid-js"
import { setStore } from "./Store"

import {
  fetchEntries,
  flattenHierarchy,
  loadModel,
  preprocessMorphs,
  skeletonToPose,
} from "./helpers/helpers"

import Sliders from "./components/Sliders"
import ThreeScene from "./components/ThreeScene"
import Hierarchy from "./components/Hierarchy"
import Export from "./components/Export"
import Archive from "./components/Archive"
import Save from "./components/Save"
import Default from "./components/Default"
import TextInput from "./components/TextInput"
import { dirty } from "./actions"
import Import from "./components/Import"

const PanelContainer = (props: {
  class: string
  children: JSXElement | JSXElement[]
}) => (
  <div class={"gap-1 box-border h-full z-10 flex flex-col " + props.class}>
    {props.children}
  </div>
)

const App = () => {
  onMount(async () => {
    const [model, entries] = await Promise.all([loadModel(), fetchEntries()])

    model.visible = false
    const [skeleton, mesh, poses] = model.children
    const skinnedMesh = mesh.children[0] as THREE.SkinnedMesh
    const [defaultPose] = poses.children

    skinnedMesh.children.forEach((child) => (child.visible = false))

    setStore("skeleton", skeleton as THREE.Object3D)
    setStore("defaultPose", skeletonToPose(defaultPose))
    setStore("flatHierarchy", flattenHierarchy(skeleton))
    setStore("model", model)
    setStore("entries", entries)
    setStore("morphs", {
      targets: skinnedMesh.morphTargetInfluences,
      dictionary: skinnedMesh.morphTargetDictionary
        ? preprocessMorphs(skinnedMesh.morphTargetDictionary)
        : {},
    })

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
          <Sliders />
          <Default />
          <Hierarchy />
        </PanelContainer>
        <PanelContainer class="flex-1 flex items-end pointer-events-none">
          <TextInput maxHeight={250} />
        </PanelContainer>
        <PanelContainer class="left-0 w-48 ">
          <div class="flex w-full gap-1">
            <Save />
            <Import />
            <Export />
          </div>
          <Archive />
        </PanelContainer>
      </div>
    </div>
  )
}

export default App
