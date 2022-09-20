import { GLTFExporter as Exporter } from "three/examples/jsm/exporters/GLTFExporter"

import Downloader from "../helpers/Downloader"
import { store } from "../Store"
import { headerButton, panel } from "../styles"

const exporter = new Exporter()
const downloader = new Downloader()

const Export = () => {
  const exportMesh = () => {
    if (!store.model) return
    exporter.parse(
      store.model,
      (result) =>
        downloader.fromArrayBuffer(result as ArrayBuffer, "model.glb"),
      () => {},
      { binary: true }
    )
  }

  return (
    <div class={panel}>
      <button class={headerButton} onclick={exportMesh}>
        export
      </button>
    </div>
  )
}
export default Export
