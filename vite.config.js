import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'animeUtils',
      fileName: (format) => `anime-utils.${format === 'umd' ? 'umd' : 'es'}.js`,
      formats: ['umd']
    },
    outDir: 'dist',
    minify: 'terser',
    target: 'es2020'
  },
  server: {
    open: 'index.html',
    port: 5173
  }
})
