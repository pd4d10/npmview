const fs = require('fs')
const path = require('path')

const USED_ICONS = [
  'search',
  'arrow-left',
  'info-sign',
  'arrow-right',
  'folder-close',
  'document',
  'chevron-right',
]

const ORIGINAL_FILE_PATH = path.resolve(
  __dirname,
  '../node_modules',
  '@blueprintjs/icons/lib/esm/generated/iconSvgPaths.js'
)
const BACKUP_FILE_PATH = path.resolve(
  __dirname,
  '../node_modules',
  '@blueprintjs/icons/lib/esm/generated/iconSvgPaths.backup.js'
)
if (fs.existsSync(BACKUP_FILE_PATH)) {
  // Recover
  fs.writeFileSync(ORIGINAL_FILE_PATH, fs.readFileSync(BACKUP_FILE_PATH))
} else {
  // Backup (first time)
  fs.writeFileSync(BACKUP_FILE_PATH, fs.readFileSync(ORIGINAL_FILE_PATH))
}

const {
  IconSvgPaths16,
  IconSvgPaths20,
} = require('@blueprintjs/icons/lib/esm/generated/iconSvgPaths.js')

// Remove unused keys
for (const iconMap of [IconSvgPaths16, IconSvgPaths20]) {
  for (const key of Object.keys(iconMap)) {
    if (!USED_ICONS.includes(key)) {
      delete iconMap[key]
    }
  }
}

// Write
const content = `export var IconSvgPaths16 = ${JSON.stringify(IconSvgPaths16)}
export var IconSvgPaths20 = ${JSON.stringify(IconSvgPaths20)}`

fs.writeFileSync(ORIGINAL_FILE_PATH, content)
