export default class {
  link: HTMLAnchorElement
  constructor() {
    this.link = document.createElement("a")
    this.link.style.display = "none"
    document.body.appendChild(this.link)
  }

  download(blob: Blob, filename: string) {
    this.link.href = URL.createObjectURL(blob)
    this.link.download = filename
    this.link.click()
  }
  fromString(text: string, filename: string) {
    this.download(new Blob([text], { type: "text/plain" }), filename)
  }

  fromArrayBuffer(buffer: ArrayBuffer, filename: string) {
    this.download(
      new Blob([buffer], { type: "application/octet-stream" }),
      filename
    )
  }
}
