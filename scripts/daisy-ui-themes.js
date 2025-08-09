const fs = require('node:fs')
const path = require('node:path')

const dir = path.resolve(__dirname, '../node_modules/daisyui/theme')
const files = fs.readdirSync(dir)

const themes = files
  .filter((file) => file.endsWith('.css'))
  .map((file) => path.basename(file, '.css'))
  .sort()

fs.writeFileSync(path.resolve(__dirname, '../.storybook/daisy-themes.json'), JSON.stringify(themes, null, 2))

console.log(`✅ Exported ${themes.length} daisyUI themes`)
