const path = require('path')
const fs = require('fs')

const staticDir = path.resolve(
  process.env.STATIC_DIR || path.join(__dirname, '../../../uniapp/src/static')
)

function exportToStatic(data, pdfSourcePath) {
  if (!fs.existsSync(staticDir)) {
    fs.mkdirSync(staticDir, { recursive: true })
  }

  fs.writeFileSync(
    path.join(staticDir, 'resume.json'),
    JSON.stringify(data, null, 2),
    'utf-8'
  )

  if (pdfSourcePath && fs.existsSync(pdfSourcePath)) {
    fs.copyFileSync(pdfSourcePath, path.join(staticDir, 'resume.pdf'))
  }
}

module.exports = { exportToStatic }
