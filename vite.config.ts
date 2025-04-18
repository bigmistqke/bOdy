import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    solidPlugin(),
    /*viteStaticCopy({
      targets: [
        {
          src: 'api/*', // adjust this path to where your files are
          dest: '', // copied to dist/ (root of output folder)
        },
      ],
    }),*/
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
  base: './',
})
