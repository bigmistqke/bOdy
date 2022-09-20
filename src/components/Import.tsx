import Downloader from "../helpers/Downloader"
import { store } from "../Store"
import { headerButton, panel } from "../styles"
import getValidExtension from "../helpers/getValidExtension"
import { fbxLoader } from "../helpers/helpers"

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
        fbxLoader.load(URL.createObjectURL(file), (file) => {
          console.log("FILE IS ", file)
          store.model
        })
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
