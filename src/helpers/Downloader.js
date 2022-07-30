export default function () {
  const link = document.createElement('a');
  link.style.display = 'none';
  document.body.appendChild(link);


  function download(blob, filename) {
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  this.fromString = (text, filename) => {
    download(new Blob([text], { type: "text/plain" }), filename);
  }

  this.fromArrayBuffer = (buffer, filename) => {
    download(new Blob([buffer], { type: "application/octet-stream" }), filename);
  }
}
