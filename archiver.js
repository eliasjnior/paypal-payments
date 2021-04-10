const package = require('./package.json')
const fs = require('fs')
const archiver = require('archiver')
const path = require('path')

const filename = `${package.name}-${package.version}.zip`
const pathname = path.resolve(__dirname, filename)
const output = fs.createWriteStream(pathname)
const archive = archiver('zip', {
  zlib: {
    level: 9,
  }
})

output.on('close', () => {
  console.log(`✅ zip file generated with ${archive.pointer()} bytes in ${pathname}`)
})

output.on('error', (error) => {
  console.log(`❌ there was an error building`)
  throw error
})

archive.pipe(output)

archive.glob(
  '**', 
  {
    cwd: __dirname,
    ignore: [
      'node_modules/**',
      'src/**',
      'yarn.lock',
      '*.yml',
      '*.json',
      '*.js',
      '*.md',
      '*.zip',
    ],
  }, 
  {
    prefix: package.name,
  }
)

archive.finalize()