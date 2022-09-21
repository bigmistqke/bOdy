import Downloader from "../helpers/Downloader"
import { store, setStore } from "../Store"
import { headerButton, panel } from "../styles"
import getValidExtension from "../helpers/getValidExtension"
import { fbxLoader } from "../helpers/helpers"
import { createStore } from "solid-js/store"
import { addLoadedModelToScene } from "./threeActions"

const Import = () => {
  let input: HTMLInputElement | undefined

  const allowedFileTypes = ["fbx", "glb", "gltf"]
  const importMesh = (e: Event) => {
    const files = (e.target as HTMLInputElement).files
    if (!files) return

    const file = files[0]
    const validExtension = getValidExtension(file.name, allowedFileTypes)

    switch (validExtension) {
      case "fbx":
        fbxLoader.load(URL.createObjectURL(file), (model) =>
          addLoadedModelToScene(model)
        )
        break
    }
  }

  return (
    <div class={panel}>
      <input ref={input} type="file" hidden onInput={importMesh} />
      <button class={headerButton} onclick={() => input?.click()}>
        import
      </button>
    </div>
  )
}
export default Import
